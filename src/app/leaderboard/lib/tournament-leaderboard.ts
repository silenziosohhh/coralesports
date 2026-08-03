import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { findTeamLeader } from "@/lib/team-avatar";
import { normalizeSquad } from "@/lib/team-render";
import {
  DEMO_CONTENT_ENABLED,
  getDemoPlayerLeaderboardRows,
  getDemoTeamLeaderboardRows,
  getDemoTeams,
  getDemoTournament,
  getDemoTournaments,
} from "@/lib/demo-content";

export type LeaderboardTournament = {
  id: string;
  name: string;
  slug: string;
  banner: string | null;
  status: string;
  startDate: Date;
  endDate: Date | null;
  teamMode: "SOLO" | "DUO" | "TRIO";
};

export type TeamLeaderRef = {
  id: string;
  name: string | null;
  minecraftUsername: string | null;
  image: string | null;
};

export type TournamentLeaderboardRow = {
  teamId: string;
  teamName: string;
  teamTag: string;
  teamLogo: string | null;
  teamElo: number;
  seed: number | null;
  played: number;
  wins: number;
  losses: number;
  points: number;
  scoreFor: number;
  scoreAgainst: number;
  scoreDiff: number;
  leader: TeamLeaderRef | null;
  squad: string[];
};

export type TournamentPlayerLeaderboardRow = {
  id: string;
  image: string | null;
  discordTag: string | null;
  minecraftUsername: string | null;
  name: string | null;
  elo: number;
  wins: number;
  losses: number;
};

const shouldUseDemoLeaderboard = cache(async () => {
  if (!DEMO_CONTENT_ENABLED) return false;
  try {
    await prisma.tournament.findFirst({ select: { id: true } });
    return false;
  } catch (error) {
    console.warn("Leaderboard API unavailable; using demo rankings.", error);
    return true;
  }
});

export async function listLeaderboardTournaments(): Promise<LeaderboardTournament[]> {
  if (await shouldUseDemoLeaderboard()) {
    return getDemoTournaments().map((tournament) => ({
      id: tournament.id,
      name: tournament.name,
      slug: tournament.slug,
      banner: tournament.banner,
      status: tournament.status,
      startDate: new Date(tournament.startDate),
      endDate: tournament.endDate ? new Date(tournament.endDate) : null,
      teamMode: tournament.teamMode,
    }));
  }

  return prisma.tournament.findMany({
    where: { status: { not: "DRAFT" } },
    orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      banner: true,
      status: true,
      startDate: true,
      endDate: true,
      teamMode: true,
    },
    take: 50,
  });
}

export type TournamentLeaderboardQuery = {
  tournamentId: string;
  q?: string;
  page: number;
  pageSize: number;
};

function normalizePage(n: number) {
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}

function normalizePageSize(n: number) {
  const size = Number.isFinite(n) && n > 0 ? Math.floor(n) : 50;
  return Math.min(100, Math.max(10, size));
}

function safeIncludes(haystack: string, needle: string) {
  return haystack.toLocaleLowerCase().includes(needle.toLocaleLowerCase());
}

function squadFromMembers(
  members: Array<{ role?: string | null; user: { minecraftUsername?: string | null } }>,
  leaderUsername: string | null,
) {
  const names = members
    .map((member) => member.user.minecraftUsername)
    .filter((name): name is string => Boolean(name));

  if (!leaderUsername) return normalizeSquad(names);
  return normalizeSquad([leaderUsername, ...names]);
}

function demoTeamLeader(teamId: string): TeamLeaderRef | null {
  const team = getDemoTeams().find((candidate) => candidate.id === teamId);
  const leader = findTeamLeader({
    tag: team?.tag ?? "",
    logo: team?.logo ?? null,
    createdById: team?.createdById ?? null,
    members: team?.members ?? [],
  });
  if (!leader) return null;
  return {
    id: leader.id,
    name: leader.name ?? null,
    minecraftUsername: leader.minecraftUsername ?? null,
    image: leader.image ?? null,
  };
}

function demoTeamSquad(teamId: string): string[] {
  const team = getDemoTeams().find((candidate) => candidate.id === teamId);
  if (!team) return [];
  return squadFromMembers(team.members, demoTeamLeader(teamId)?.minecraftUsername ?? null);
}

export async function getTournamentTeamLeaderboard(query: TournamentLeaderboardQuery) {
  const page = normalizePage(query.page);
  const pageSize = normalizePageSize(query.pageSize);
  const q = query.q?.trim() || undefined;

  if (await shouldUseDemoLeaderboard()) {
    const demoTournament = getDemoTournament(query.tournamentId);
    if (!demoTournament) {
      return { tournament: null, q, page, pageSize, total: 0, rows: [] as TournamentLeaderboardRow[] };
    }

    let rows = getDemoTeamLeaderboardRows().map((row) => ({
      ...row,
      leader: demoTeamLeader(row.teamId),
      squad: demoTeamSquad(row.teamId),
    })) as TournamentLeaderboardRow[];
    if (q) rows = rows.filter((row) => safeIncludes(row.teamName, q) || safeIncludes(row.teamTag, q));
    const total = rows.length;
    const start = (page - 1) * pageSize;
    return {
      tournament: {
        id: demoTournament.id,
        name: demoTournament.name,
        slug: demoTournament.slug,
        status: demoTournament.status,
        startDate: new Date(demoTournament.startDate),
        endDate: demoTournament.endDate ? new Date(demoTournament.endDate) : null,
        teamMode: demoTournament.teamMode,
      },
      q,
      page,
      pageSize,
      total,
      rows: rows.slice(start, start + pageSize),
    };
  }

  const tournament = await prisma.tournament.findUnique({
    where: { id: query.tournamentId },
    select: { id: true, name: true, slug: true, status: true, startDate: true, endDate: true, teamMode: true },
  });

  if (!tournament) {
    return { tournament: null, q, page, pageSize, total: 0, rows: [] as TournamentLeaderboardRow[] };
  }

  const tournamentTeams = await prisma.tournamentTeam.findMany({
    where: { tournamentId: tournament.id, status: { in: ["REGISTERED", "CHECKED_IN"] } },
    include: {
      team: {
        select: {
          id: true,
          name: true,
          tag: true,
          logo: true,
          elo: true,
          createdById: true,
          members: {
            select: {
              role: true,
              user: { select: { id: true, name: true, minecraftUsername: true, image: true } },
            },
          },
        },
      },
    },
  });

  const matches = await prisma.match.findMany({
    where: { tournamentId: tournament.id, status: "COMPLETED" },
    select: {
      team1Id: true,
      team2Id: true,
      team1Score: true,
      team2Score: true,
      winnerId: true,
    },
  });

  const byTeamId = new Map<string, TournamentLeaderboardRow>();

  for (const tt of tournamentTeams) {
    const leader = findTeamLeader(tt.team);
    byTeamId.set(tt.teamId, {
      teamId: tt.teamId,
      teamName: tt.team.name,
      teamTag: tt.team.tag,
      teamLogo: tt.team.logo,
      teamElo: tt.team.elo,
      seed: tt.seed ?? null,
      played: 0,
      wins: 0,
      losses: 0,
      points: 0,
      scoreFor: 0,
      scoreAgainst: 0,
      scoreDiff: 0,
      leader: leader
        ? {
            id: leader.id,
            name: leader.name ?? null,
            minecraftUsername: leader.minecraftUsername ?? null,
            image: leader.image ?? null,
          }
        : null,
      squad: squadFromMembers(tt.team.members, leader?.minecraftUsername ?? null),
    });
  }

  for (const match of matches) {
    const team2Id = match.team2Id;
    if (!team2Id) continue;

    const a = byTeamId.get(match.team1Id);
    const b = byTeamId.get(team2Id);
    if (!a || !b) continue;

    const winnerId =
      match.winnerId && (match.winnerId === match.team1Id || match.winnerId === team2Id)
        ? match.winnerId
        : match.team1Score === match.team2Score
          ? null
          : match.team1Score > match.team2Score
            ? match.team1Id
            : team2Id;

    if (!winnerId) continue;

    a.played += 1;
    b.played += 1;

    a.scoreFor += match.team1Score;
    a.scoreAgainst += match.team2Score;
    b.scoreFor += match.team2Score;
    b.scoreAgainst += match.team1Score;

    if (winnerId === match.team1Id) {
      a.wins += 1;
      b.losses += 1;
      a.points += 3;
    } else {
      b.wins += 1;
      a.losses += 1;
      b.points += 3;
    }
  }

  for (const row of byTeamId.values()) {
    row.scoreDiff = row.scoreFor - row.scoreAgainst;
  }

  let rows = Array.from(byTeamId.values());
  if (q) {
    rows = rows.filter((r) => safeIncludes(r.teamName, q) || safeIncludes(r.teamTag, q));
  }

  rows.sort((l, r) => {
    if (r.points !== l.points) return r.points - l.points;
    if (r.scoreDiff !== l.scoreDiff) return r.scoreDiff - l.scoreDiff;
    if (r.wins !== l.wins) return r.wins - l.wins;
    if (r.scoreFor !== l.scoreFor) return r.scoreFor - l.scoreFor;
    if (r.teamElo !== l.teamElo) return r.teamElo - l.teamElo;
    return l.teamName.localeCompare(r.teamName);
  });

  const total = rows.length;
  const start = (page - 1) * pageSize;
  const paged = rows.slice(start, start + pageSize);

  return {
    tournament,
    q,
    page,
    pageSize,
    total,
    rows: paged,
  };
}

export async function getTournamentPlayersLeaderboard(query: TournamentLeaderboardQuery) {
  const page = normalizePage(query.page);
  const pageSize = normalizePageSize(query.pageSize);
  const q = query.q?.trim() || undefined;

  if (await shouldUseDemoLeaderboard()) {
    const demoTournament = getDemoTournament(query.tournamentId);
    if (!demoTournament) {
      return { tournament: null, q, page, pageSize, total: 0, rows: [] as TournamentPlayerLeaderboardRow[] };
    }

    let rows = getDemoPlayerLeaderboardRows().map((row) => ({ ...row })) as TournamentPlayerLeaderboardRow[];
    if (q) {
      rows = rows.filter((row) =>
        [row.minecraftUsername, row.discordTag, row.name].some((value) => value && safeIncludes(value, q)),
      );
    }
    const total = rows.length;
    const start = (page - 1) * pageSize;
    return {
      tournament: {
        id: demoTournament.id,
        name: demoTournament.name,
        slug: demoTournament.slug,
        status: demoTournament.status,
        startDate: new Date(demoTournament.startDate),
        endDate: demoTournament.endDate ? new Date(demoTournament.endDate) : null,
        teamMode: demoTournament.teamMode,
      },
      q,
      page,
      pageSize,
      total,
      rows: rows.slice(start, start + pageSize),
    };
  }

  const tournament = await prisma.tournament.findUnique({
    where: { id: query.tournamentId },
    select: { id: true, name: true, slug: true, status: true, startDate: true, endDate: true, teamMode: true },
  });

  if (!tournament) {
    return { tournament: null, q, page, pageSize, total: 0, rows: [] as TournamentPlayerLeaderboardRow[] };
  }

  const where = {
    status: "ACTIVE" as const,
    tournamentTeamPlayers: {
      some: {
        tournamentTeam: {
          tournamentId: tournament.id,
        },
      },
    },
    ...(q
      ? {
          OR: [
            { discordTag: { contains: q, mode: "insensitive" as const } },
            { minecraftUsername: { contains: q, mode: "insensitive" as const } },
            { name: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const skip = (page - 1) * pageSize;
  const [total, rows] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: [{ elo: "desc" }, { wins: "desc" }, { losses: "asc" }, { createdAt: "asc" }],
      skip,
      take: pageSize,
      select: {
        id: true,
        image: true,
        discordTag: true,
        minecraftUsername: true,
        name: true,
        elo: true,
        wins: true,
        losses: true,
      },
    }),
  ]);

  return {
    tournament,
    q,
    page,
    pageSize,
    total,
    rows: rows satisfies TournamentPlayerLeaderboardRow[],
  };
}
