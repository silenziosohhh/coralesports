import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export type Champion = {
  username: string | null;
  displayName: string;
  elo: number;
  wins: number;
  tournamentName: string;
};

const placeholderChampion: Champion = {
  username: "MrJak3s",
  displayName: "MrJak3s",
  elo: 1842,
  wins: 37,
  tournamentName: "Torneo principale",
};

async function findMainTournament() {
  const live = await prisma.tournament.findFirst({
    where: { status: "LIVE" },
    orderBy: { startDate: "desc" },
    select: { id: true, name: true },
  });
  if (live) return live;

  return prisma.tournament.findFirst({
    where: { status: { notIn: ["DRAFT", "CANCELLED"] } },
    orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
    select: { id: true, name: true },
  });
}

export const revalidate = 60;

export async function GET() {
  try {
    const tournament = await findMainTournament();
    if (!tournament) {
      return NextResponse.json({ champion: placeholderChampion, placeholder: true });
    }

    const top = await prisma.user.findFirst({
      where: {
        status: "ACTIVE",
        tournamentTeamPlayers: { some: { tournamentTeam: { tournamentId: tournament.id } } },
      },
      orderBy: [{ elo: "desc" }, { wins: "desc" }, { losses: "asc" }, { createdAt: "asc" }],
      select: { minecraftUsername: true, name: true, discordTag: true, elo: true, wins: true },
    });

    if (!top) {
      return NextResponse.json({ champion: placeholderChampion, placeholder: true });
    }

    return NextResponse.json({
      champion: {
        username: top.minecraftUsername,
        displayName: top.minecraftUsername ?? top.name ?? top.discordTag ?? "Campione",
        elo: top.elo,
        wins: top.wins,
        tournamentName: tournament.name,
      } satisfies Champion,
      placeholder: false,
    });
  } catch (error) {
    console.error("Error fetching champion:", error);
    return NextResponse.json({ champion: placeholderChampion, placeholder: true });
  }
}
