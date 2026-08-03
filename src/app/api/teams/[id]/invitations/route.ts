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
    const body = await req.json();
    const { email, discordId } = body;

    const teamMember = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
        role: "CAPTAIN",
      },
    });

    if (!teamMember) {
      return NextResponse.json(
        { error: "Solo il capitano può inviare inviti" },
        { status: 403 }
      );
    }

    const invitation = await prisma.teamInvitation.create({
      data: {
        teamId,
        email,
        discordId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
      },
      include: {
        team: {
          select: {
            name: true,
            tag: true,
          },
        },
      },
    });


    return NextResponse.json(invitation, { status: 201 });
  } catch (error) {
    console.error("Error creating invitation:", error);
    return NextResponse.json(
      { error: "Errore nella creazione dell'invito" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const teamId = params.id;

    const teamMember = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
      },
    });

    if (!teamMember) {
      return NextResponse.json(
        { error: "Non sei membro di questo team" },
        { status: 403 }
      );
    }

    const invitations = await prisma.teamInvitation.findMany({
      where: {
        teamId,
        status: "PENDING",
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(invitations);
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return NextResponse.json(
      { error: "Errore nel recupero degli inviti" },
      { status: 500 }
    );
  }
}
