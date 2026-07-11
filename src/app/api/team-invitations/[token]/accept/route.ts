import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyTurnstileToken } from "@/lib/turnstile";

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
    const userId = session.user.id;

    const body = await req.json().catch(() => ({}));
    const captchaToken = typeof body?.captchaToken === "string" ? body.captchaToken : "";
    const requestedTeamId = typeof body?.teamId === "string" ? body.teamId : "";
    const verification = await verifyTurnstileToken({
      token: captchaToken,
      ip: req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for"),
    });

    if (!verification.ok) {
      return NextResponse.json(
        { error: "Captcha non valido" },
        { status: 400 }
      );
    }

    const invitation = await prisma.teamInvitation.findUnique({
      where: { token },
      include: {
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invito non trovato" }, { status: 404 });
    }

    if (requestedTeamId && requestedTeamId !== invitation.teamId) {
      return NextResponse.json({ error: "Invito non valido" }, { status: 400 });
    }

    if (invitation.status !== "PENDING" || invitation.usedAt) {
      return NextResponse.json({ error: "Invito non valido" }, { status: 400 });
    }

    if (invitation.expiresAt <= new Date()) {
      return NextResponse.json({ error: "Invito scaduto" }, { status: 400 });
    }

    const existing = await prisma.teamMember.findFirst({
      where: { teamId: invitation.teamId, userId },
      select: { id: true },
    });

    if (!existing) {
      await prisma.teamMember.create({
        data: {
          teamId: invitation.teamId,
          userId,
          role: "MEMBER",
        },
      });
    }

    await prisma.teamInvitation.update({
      where: { id: invitation.id },
      data: {
        status: "ACCEPTED",
        usedAt: new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "TEAM_UPDATED",
        entityType: "Team",
        entityId: invitation.teamId,
        changes: { invitationAccepted: true },
      },
    });

    return NextResponse.json({ success: true, teamId: invitation.teamId });
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return NextResponse.json(
      { error: "Errore durante l'accettazione dell'invito" },
      { status: 500 }
    );
  }
}
