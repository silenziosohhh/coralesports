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

    const body = await req.json().catch(() => ({}));
    const targetUserId = typeof body?.userId === "string" ? body.userId : null;
    if (!targetUserId) {
      return NextResponse.json({ error: "Giocatore non specificato" }, { status: 400 });
    }

    const captain = await prisma.teamMember.findFirst({
      where: {
        teamId: params.id,
        userId: session.user.id,
        role: { in: ["CAPTAIN", "CO_CAPTAIN"] },
      },
    });

    if (!captain) {
      return NextResponse.json({ error: "Solo un capitano può invitare" }, { status: 403 });
    }

    const [team, alreadyMember] = await Promise.all([
      prisma.team.findUnique({ where: { id: params.id }, select: { id: true, name: true } }),
      prisma.teamMember.findFirst({ where: { teamId: params.id, userId: targetUserId } }),
    ]);

    if (!team) {
      return NextResponse.json({ error: "Team non trovato" }, { status: 404 });
    }
    if (alreadyMember) {
      return NextResponse.json({ error: "È già nel team" }, { status: 400 });
    }

    const pending = await prisma.teamInvitation.findFirst({
      where: {
        teamId: params.id,
        userId: targetUserId,
        status: "PENDING",
        expiresAt: { gt: new Date() },
      },
    });
    if (pending) {
      return NextResponse.json({ error: "Invito già inviato" }, { status: 400 });
    }

    const invitation = await prisma.teamInvitation.create({
      data: {
        teamId: params.id,
        userId: targetUserId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const inviterName = session.user.minecraftUsername || session.user.name || "Un capitano";
    await prisma.notification.create({
      data: {
        userId: targetUserId,
        type: "TEAM_INVITATION",
        title: `Invito da ${team.name}`,
        message: `${inviterName} ti ha invitato a entrare in ${team.name}.`,
        link: `/teams/invite/${team.id}/${invitation.token}`,
      },
    });

    return NextResponse.json(invitation, { status: 201 });
  } catch (error) {
    console.error("Error inviting user:", error);
    return NextResponse.json({ error: "Errore nell'invio dell'invito" }, { status: 500 });
  }
}
