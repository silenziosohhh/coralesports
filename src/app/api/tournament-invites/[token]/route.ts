import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function playersPerTeamFromMode(mode: "SOLO" | "DUO" | "TRIO") {
  if (mode === "TRIO") return 3;
  if (mode === "DUO") return 2;
  return 1;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;
    const invitation = await prisma.tournamentTeamInvite.findUnique({
      where: { token },
      select: {
        token: true,
        status: true,
        expiresAt: true,
        createdAt: true,
        respondedAt: true,
        invitedUserId: true,
        invitedBy: { select: { id: true, name: true, discordTag: true, image: true } },
        tournament: { select: { id: true, name: true, teamMode: true, startDate: true, status: true } },
      },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invito non trovato" }, { status: 404 });
    }

    const session = await getServerSession(authOptions);
    const me = session?.user?.id ?? null;

    return NextResponse.json({
      invitation,
      viewer: { userId: me, isRecipient: me ? invitation.invitedUserId === me : false },
    });
  } catch (error) {
    console.error("Error fetching tournament invite:", error);
    return NextResponse.json(
      { error: "Errore nel recupero invito" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const token = params.token;
    const body = await req.json().catch(() => ({}));
    const action = body?.action;
    if (action !== "accept" && action !== "decline") {
      return NextResponse.json({ error: "Azione non valida" }, { status: 400 });
    }

    const now = new Date();

    const invitation = await prisma.tournamentTeamInvite.findUnique({
      where: { token },
      include: {
        tournament: { select: { id: true, name: true, teamMode: true, status: true, startDate: true } },
        tournamentTeam: { select: { id: true, status: true } },
      },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invito non trovato" }, { status: 404 });
    }

    if (invitation.invitedUserId !== session.user.id) {
      return NextResponse.json({ error: "Invito non valido" }, { status: 403 });
    }

    if (invitation.status !== "PENDING") {
      return NextResponse.json({ error: "Invito non più valido" }, { status: 400 });
    }

    if (invitation.expiresAt <= now) {
      await prisma.tournamentTeamInvite.update({
        where: { id: invitation.id },
        data: { status: "EXPIRED", respondedAt: now },
      });
      return NextResponse.json({ error: "Invito scaduto" }, { status: 400 });
    }

    if (invitation.tournament.status === "LIVE") {
      return NextResponse.json(
        { error: "Il torneo è già iniziato" },
        { status: 400 }
      );
    }

    const me = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { minecraftUsername: true, status: true },
    });

    if (!me || me.status !== "ACTIVE") {
      return NextResponse.json({ error: "Utente non valido" }, { status: 400 });
    }

    if (!me.minecraftUsername) {
      return NextResponse.json(
        { error: "Collega prima il nick Minecraft" },
        { status: 400 }
      );
    }

    if (action === "decline") {
      await prisma.tournamentTeamInvite.update({
        where: { id: invitation.id },
        data: { status: "DECLINED", respondedAt: now },
      });

      await prisma.notification.create({
        data: {
          userId: invitation.invitedById,
          type: "TOURNAMENT_UPDATE",
          title: "Invito rifiutato",
          message: "Un utente ha rifiutato un invito torneo. Puoi invitare qualcun altro per completare l’iscrizione.",
          link: `/tournaments/${invitation.tournamentId}`,
        },
      });

      return NextResponse.json({ success: true, status: "DECLINED" });
    }

    const requiredPlayers = playersPerTeamFromMode(invitation.tournament.teamMode);

    const alreadyRegistered = await prisma.tournamentTeamPlayer.findFirst({
      where: {
        userId: session.user.id,
        tournamentTeam: { tournamentId: invitation.tournamentId },
      },
      select: { id: true },
    });

    if (alreadyRegistered) {
      return NextResponse.json(
        { error: "Sei già iscritto a questo torneo" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.tournamentTeamInvite.update({
        where: { id: invitation.id },
        data: { status: "ACCEPTED", respondedAt: now },
      });

      await tx.tournamentTeamPlayer.create({
        data: {
          tournamentTeamId: invitation.tournamentTeamId,
          userId: session.user.id,
        },
      });

      const playersCount = await tx.tournamentTeamPlayer.count({
        where: { tournamentTeamId: invitation.tournamentTeamId },
      });

      if (playersCount >= requiredPlayers) {
        await tx.tournamentTeam.update({
          where: { id: invitation.tournamentTeamId },
          data: { status: "REGISTERED" },
        });
      }

      await tx.notification.create({
        data: {
          userId: invitation.invitedById,
          type: "TOURNAMENT_UPDATE",
          title: "Invito accettato",
          message: "Un utente ha accettato il tuo invito torneo.",
          link: `/tournaments/${invitation.tournamentId}`,
        },
      });

      return { playersCount };
    });

    return NextResponse.json({ success: true, status: "ACCEPTED", ...result });
  } catch (error: any) {
    console.error("Error responding to tournament invite:", error);
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Sei già stato aggiunto a questa iscrizione" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Errore durante la risposta all'invito" },
      { status: 500 }
    );
  }
}

