import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const tournamentId = params.id;

    const entry = await prisma.tournamentTeam.findFirst({
      where: {
        tournamentId,
        players: { some: { userId: session.user.id } },
      },
      select: {
        id: true,
        status: true,
        team: { select: { id: true, name: true, tag: true, createdById: true } },
        players: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                discordTag: true,
                image: true,
                minecraftUsername: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        invites: {
          select: {
            token: true,
            status: true,
            expiresAt: true,
            createdAt: true,
            invitedUser: {
              select: {
                id: true,
                name: true,
                discordTag: true,
                image: true,
                minecraftUsername: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        tournament: {
          select: {
            id: true,
            teamMode: true,
            status: true,
            startDate: true,
          },
        },
      },
      orderBy: { registeredAt: "desc" },
    });

    return NextResponse.json({ entry });
  } catch (error) {
    console.error("Error fetching my entry:", error);
    return NextResponse.json(
      { error: "Errore nel recupero iscrizione" },
      { status: 500 }
    );
  }
}

