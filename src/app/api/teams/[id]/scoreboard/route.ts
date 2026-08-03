import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEMO_CONTENT_ENABLED, getDemoTeam } from "@/lib/demo-content";
import { fetchTeamScoreboard, type ScoreboardRosterInput } from "@/lib/team-scoreboard";

export async function GET(_request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    let roster: ScoreboardRosterInput[] | null = null;

    try {
      const team = await prisma.team.findUnique({
        where: { id: params.id },
        select: {
          members: {
            select: {
              role: true,
              user: {
                select: { id: true, name: true, minecraftUsername: true, elo: true },
              },
            },
          },
        },
      });

      if (team) {
        roster = team.members.map((member) => ({
          id: member.user.id,
          name: member.user.name ?? member.user.id,
          minecraftUsername: member.user.minecraftUsername,
          role: member.role,
          elo: member.user.elo,
        }));
      }
    } catch (error) {
      console.warn("Team roster API unavailable; trying demo data.", error);
    }

    if (!roster && DEMO_CONTENT_ENABLED) {
      const demoTeam = getDemoTeam(params.id);
      if (demoTeam) {
        roster = demoTeam.members.map((member) => ({
          id: member.user.id,
          name: member.user.name,
          minecraftUsername: member.user.minecraftUsername,
          role: member.role,
          elo: member.user.elo,
        }));
      }
    }

    if (!roster) return NextResponse.json({ error: "Team not found" }, { status: 404 });

    const scoreboard = await fetchTeamScoreboard({ teamId: params.id, roster });
    return NextResponse.json(scoreboard, {
      headers: { "X-Coral-Data-Source": scoreboard.placeholder ? "demo" : "api" },
    });
  } catch (error) {
    console.error("Error fetching team scoreboard:", error);
    return NextResponse.json({ error: "Failed to fetch scoreboard" }, { status: 500 });
  }
}
