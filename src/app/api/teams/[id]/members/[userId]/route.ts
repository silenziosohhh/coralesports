import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  props: { params: Promise<{ id: string; userId: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const teamId = params.id;
    const targetUserId = params.userId;

    const captain = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
        role: "CAPTAIN",
      },
      select: { id: true },
    });

    if (!captain) {
      return NextResponse.json(
        { error: "Solo il capitano può rimuovere membri" },
        { status: 403 }
      );
    }

    const targetMembership = await prisma.teamMember.findFirst({
      where: { teamId, userId: targetUserId },
      select: { id: true, role: true },
    });

    if (!targetMembership) {
      return NextResponse.json(
        { error: "Membro non trovato" },
        { status: 404 }
      );
    }

    if (targetMembership.role === "CAPTAIN") {
      return NextResponse.json(
        { error: "Impossibile rimuovere il capitano" },
        { status: 400 }
      );
    }

    await prisma.teamMember.delete({ where: { id: targetMembership.id } });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "TEAM_UPDATED",
        entityType: "Team",
        entityId: teamId,
        changes: { removedUserId: targetUserId },
      },
    });

    const stillCaptain = await prisma.teamMember.findFirst({
      where: { userId: targetUserId, role: "CAPTAIN" },
      select: { id: true },
    });

    if (!stillCaptain) {
      await prisma.user.update({
        where: { id: targetUserId },
        data: { role: "USER" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing team member:", error);
    return NextResponse.json(
      { error: "Errore nella rimozione del membro" },
      { status: 500 }
    );
  }
}

