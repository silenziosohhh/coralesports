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

    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      select: { id: true },
    });

    if (!tournament) {
      return NextResponse.json({ error: "Torneo non trovato" }, { status: 404 });
    }

    const alreadyInTournament = await prisma.tournamentTeamPlayer.findMany({
      where: { tournamentTeam: { tournamentId } },
      select: { userId: true },
    });
    const blockedUserIds = new Set(alreadyInTournament.map((r) => r.userId));
    blockedUserIds.add(session.user.id);

    const users = await prisma.user.findMany({
      where: {
        status: "ACTIVE",
        minecraftUsername: { not: null },
        id: { notIn: Array.from(blockedUserIds) },
      },
      select: {
        id: true,
        name: true,
        image: true,
        discordTag: true,
        minecraftUsername: true,
      },
      orderBy: [{ minecraftUsername: "asc" }, { discordTag: "asc" }, { id: "asc" }],
      take: 200,
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching eligible users:", error);
    return NextResponse.json(
      { error: "Errore nel recupero utenti" },
      { status: 500 }
    );
  }
}

