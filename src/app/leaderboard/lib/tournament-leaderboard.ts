import { prisma } from "@/lib/prisma";

export type LeaderboardTournament = {
  id: string;
  name: string;
  slug: string;
  status: string;
  startDate: Date;
  endDate: Date | null;
  teamMode: "SOLO" | "DUO" | "TRIO";
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
  draws: number;
  points: number;
  scoreFor: number;
  scoreAgainst: number;
  scoreDiff: number;
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

export async function listLeaderboardTournaments(): Promise<LeaderboardTournament[]> {
  return prisma.tournament.findMany({
    where: { status: { not: "DRAFT" } },
    orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      slug: true,
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

export async function getTournamentTeamLeaderboard(query: TournamentLeaderboardQuery) {
  const page = normalizePage(query.page);
  const pageSize = normalizePageSize(query.pageSize);
  const q = query.q?.trim() || undefined;

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
      team: { select: { id: true, name: true, tag: true, logo: true, elo: true } },
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
      draws: 0,
      points: 0,
      scoreFor: 0,
      scoreAgainst: 0,
      scoreDiff: 0,
    });
  }

  for (const match of matches) {
    const team2Id = match.team2Id;
    if (!team2Id) continue;

    const a = byTeamId.get(match.team1Id);
    const b = byTeamId.get(team2Id);
    if (!a || !b) continue;

    a.played += 1;
    b.played += 1;

    a.scoreFor += match.team1Score;
    a.scoreAgainst += match.team2Score;
    b.scoreFor += match.team2Score;
    b.scoreAgainst += match.team1Score;

    const winnerId =
      match.winnerId && (match.winnerId === match.team1Id || match.winnerId === team2Id)
        ? match.winnerId
        : match.team1Score === match.team2Score
          ? null
          : match.team1Score > match.team2Score
            ? match.team1Id
            : team2Id;

    if (!winnerId) {
      a.draws += 1;
      b.draws += 1;
      a.points += 1;
      b.points += 1;
    } else if (winnerId === match.team1Id) {
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
