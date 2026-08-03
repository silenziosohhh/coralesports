import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string; requestId: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const action = body?.action === "decline" ? "decline" : "accept";

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

    const joinRequest = await prisma.teamJoinRequest.findFirst({
      where: { id: params.requestId, teamId: params.id, status: "PENDING" },
      include: { team: { select: { id: true, name: true } } },
    });

    if (!joinRequest) {
      return NextResponse.json({ error: "Richiesta non trovata" }, { status: 404 });
    }

    if (action === "decline") {
      await prisma.teamJoinRequest.update({
        where: { id: joinRequest.id },
        data: { status: "DECLINED", resolvedAt: new Date() },
      });
      await prisma.notification.create({
        data: {
          userId: joinRequest.userId,
          type: "TEAM_INVITATION",
          title: "Richiesta rifiutata",
          message: `La tua richiesta di ingresso in ${joinRequest.team.name} è stata rifiutata.`,
          link: "/teams",
        },
      });
      return NextResponse.json({ success: true, status: "DECLINED" });
    }

    await prisma.$transaction([
      prisma.teamMember.create({
        data: { teamId: params.id, userId: joinRequest.userId, role: "MEMBER" },
      }),
      prisma.teamJoinRequest.update({
        where: { id: joinRequest.id },
        data: { status: "ACCEPTED", resolvedAt: new Date() },
      }),
      prisma.notification.create({
        data: {
          userId: joinRequest.userId,
          type: "TEAM_INVITATION",
          title: "Benvenuto nel team!",
          message: `Sei entrato in ${joinRequest.team.name}.`,
          link: `/teams/${params.id}`,
        },
      }),
    ]);

    return NextResponse.json({ success: true, status: "ACCEPTED" });
  } catch (error) {
    console.error("Error resolving join request:", error);
    return NextResponse.json({ error: "Errore nella gestione della richiesta" }, { status: 500 });
  }
}
