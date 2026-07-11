import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const teamId = params.id;
    const userId = session.user.id;

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: {
        id: true,
        name: true,
        createdById: true,
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Team non trovato" }, { status: 404 });
    }

    const membership = await prisma.teamMember.findFirst({
      where: { teamId, userId },
      select: { id: true, role: true },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Non fai parte di questo team" },
        { status: 400 }
      );
    }

    const isOwner = team.createdById === userId;

    if (isOwner) {
      const hasMatches = await prisma.match.findFirst({
        where: {
          OR: [{ team1Id: teamId }, { team2Id: teamId }],
        },
        select: { id: true },
      });

      if (hasMatches) {
        return NextResponse.json(
          { error: "Impossibile sciogliere il team: esistono match associati" },
          { status: 400 }
        );
      }

      await prisma.team.delete({ where: { id: teamId } });

      await prisma.auditLog.create({
        data: {
          userId,
          action: "TEAM_DELETED",
          entityType: "Team",
          entityId: teamId,
          changes: { name: team.name, reason: "OWNER_LEFT" },
        },
      });
    } else {
      if (membership.role === "CAPTAIN") {
        return NextResponse.json(
          { error: "Non puoi uscire: sei capitano del team" },
          { status: 400 }
        );
      }

      await prisma.teamMember.delete({ where: { id: membership.id } });

      await prisma.auditLog.create({
        data: {
          userId,
          action: "TEAM_UPDATED",
          entityType: "Team",
          entityId: teamId,
          changes: { left: true },
        },
      });
    }

    const stillCaptain = await prisma.teamMember.findFirst({
      where: { userId, role: "CAPTAIN" },
      select: { id: true },
    });

    if (!stillCaptain) {
      await prisma.user.update({
        where: { id: userId },
        data: { role: "USER" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error leaving team:", error);
    return NextResponse.json(
      { error: "Errore durante l'uscita dal team" },
      { status: 500 }
    );
  }
}

