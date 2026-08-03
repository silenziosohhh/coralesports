import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export async function GET() {
  try {
    const [players, tournaments, tournamentsWithPrize] = await Promise.all([
      prisma.user.count(),
      prisma.tournament.count({
        where: { status: { in: ["LIVE", "FINISHED"] } },
      }),
      prisma.tournament.findMany({
        where: { prizePool: { not: null } },
        select: { prizePool: true },
      }),
    ]);

    const prizePool = tournamentsWithPrize.reduce((sum, tournament) => {
      const value = parseFloat((tournament.prizePool ?? "").replace(/[^\d.]/g, ""));
      return sum + (Number.isFinite(value) ? value : 0);
    }, 0);

    return NextResponse.json({ players, tournaments, prizePool });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Errore nel recupero delle statistiche" }, { status: 500 });
  }
}
