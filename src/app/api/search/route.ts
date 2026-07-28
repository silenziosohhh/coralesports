import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ tournaments: [], teams: [], users: [] });
  }

  try {
    const [tournaments, teams, users] = await Promise.all([
      prisma.tournament.findMany({
        where: { name: { contains: q, mode: "insensitive" } },
        select: { id: true, name: true, status: true, banner: true },
        take: 5,
      }),
      prisma.team.findMany({
        where: { name: { contains: q, mode: "insensitive" } },
        select: { id: true, name: true, tag: true, logo: true },
        take: 5,
      }),
      prisma.user.findMany({
        where: { name: { contains: q, mode: "insensitive" } },
        select: { id: true, name: true, image: true, elo: true },
        take: 5,
      }),
    ]);

    return NextResponse.json({ tournaments, teams, users });
  } catch (error) {
    console.error("Error searching:", error);
    return NextResponse.json({ error: "Errore nella ricerca" }, { status: 500 });
  }
}
