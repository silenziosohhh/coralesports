import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const teamId = params.id;
    const userId = session.user.id;
    const body = await req.json().catch(() => ({}));
    const message = typeof body?.message === "string" ? body.message.slice(0, 500) : null;

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: {
        id: true,
        name: true,
        members: { select: { userId: true, role: true } },
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Team non trovato" }, { status: 404 });
    }

    if (team.members.some((member) => member.userId === userId)) {
      return NextResponse.json({ error: "Fai già parte di questo team" }, { status: 400 });
    }

    const existing = await prisma.teamJoinRequest.findUnique({
      where: { teamId_userId: { teamId, userId } },
    });

    if (existing?.status === "PENDING") {
      return NextResponse.json({ error: "Hai già una richiesta in sospeso" }, { status: 400 });
    }

    const joinRequest = existing
      ? await prisma.teamJoinRequest.update({
          where: { id: existing.id },
          data: { status: "PENDING", message, resolvedAt: null, createdAt: new Date() },
        })
      : await prisma.teamJoinRequest.create({
          data: { teamId, userId, message },
        });

    const captains = team.members.filter(
      (member) => member.role === "CAPTAIN" || member.role === "CO_CAPTAIN",
    );
    if (captains.length) {
      const requesterName =
        session.user.minecraftUsername || session.user.name || "Un giocatore";
      await prisma.notification.createMany({
        data: captains.map((captain) => ({
          userId: captain.userId,
          type: "TEAM_INVITATION" as const,
          title: "Nuova richiesta di ingresso",
          message: `${requesterName} vuole entrare in ${team.name}.`,
          link: `/teams/${teamId}`,
        })),
      });
    }

    return NextResponse.json(joinRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating join request:", error);
    return NextResponse.json({ error: "Errore nell'invio della richiesta" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const captain = await prisma.teamMember.findFirst({
      where: {
        teamId: params.id,
        userId: session.user.id,
        role: { in: ["CAPTAIN", "CO_CAPTAIN"] },
      },
    });

    if (!captain) {
      return NextResponse.json({ error: "Non sei un capitano di questo team" }, { status: 403 });
    }

    const requests = await prisma.teamJoinRequest.findMany({
      where: { teamId: params.id, status: "PENDING" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        message: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            discordTag: true,
            minecraftUsername: true,
            elo: true,
          },
        },
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching join requests:", error);
    return NextResponse.json({ error: "Errore nel recupero delle richieste" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    await prisma.teamJoinRequest.deleteMany({
      where: { teamId: params.id, userId: session.user.id, status: "PENDING" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting join request:", error);
    return NextResponse.json({ error: "Errore nell'annullamento" }, { status: 500 });
  }
}
