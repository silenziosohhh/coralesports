
export type ScoreboardPlayer = {
  id: string;
  username: string | null;
  displayName: string;
  role: string;
  elo: number;
  kills: number;
  finalKills: number;
  bedsDestroyed: number;
  deaths: number;
  wins: number;
  points: number;
};

export type ScoreboardMatch = {
  id: string;
  map: string;
  winner: string;
  won: boolean;
  playedAt: string;
  points: number;
};

export type TeamScoreboard = {
  teamId: string;
  edition: number | null;
  totals: { points: number; matches: number; average: number };
  players: ScoreboardPlayer[];
  matches: ScoreboardMatch[];
  mvpPlayerId: string | null;
  placeholder: boolean;
};

export type ScoreboardRosterInput = {
  id: string;
  name: string;
  minecraftUsername: string | null;
  role: string;
  elo: number;
};

const MAPS = [
  "Urban Plaza",
  "Harvest",
  "Silver Birch",
  "Pavilion",
  "Arid",
  "Rooted",
  "Dragon Light",
  "Sanctum",
];

const SQUAD_COLORS = ["Rosa", "Aqua", "Rossi", "Verdi", "Blu"];

export function contributionScore(player: ScoreboardPlayer) {
  return player.kills + player.finalKills * 2 + player.bedsDestroyed * 3 + player.wins;
}

function seedFrom(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pseudoRandom(seed: number, step: number) {
  const x = Math.sin(seed + step * 137.13) * 10000;
  return x - Math.floor(x);
}

function between(seed: number, step: number, min: number, max: number) {
  return Math.round(min + pseudoRandom(seed, step) * (max - min));
}

function buildPlaceholderPlayers(roster: ScoreboardRosterInput[], matches: number) {
  return roster.map((member) => {
    const seed = seedFrom(member.minecraftUsername || member.name || member.id);
    const kills = between(seed, 1, matches * 2, matches * 6);
    const finalKills = between(seed, 2, Math.round(kills * 0.2), Math.round(kills * 0.45));
    const bedsDestroyed = between(seed, 3, 1, Math.max(2, Math.round(matches * 0.8)));
    const deaths = between(seed, 4, Math.round(kills * 0.4), Math.round(kills * 0.9));
    const wins = between(seed, 5, Math.round(matches * 0.35), matches);

    return {
      id: member.id,
      username: member.minecraftUsername,
      displayName: member.minecraftUsername || member.name,
      role: member.role,
      elo: member.elo,
      kills,
      finalKills,
      bedsDestroyed,
      deaths,
      wins,
      points: kills + finalKills * 2 + bedsDestroyed * 3,
    } satisfies ScoreboardPlayer;
  });
}

function buildPlaceholderMatches(teamId: string, count: number) {
  const seed = seedFrom(teamId);
  const now = Date.now();

  return Array.from({ length: count }, (_, index) => {
    const won = pseudoRandom(seed, index + 11) > 0.34;
    return {
      id: `${teamId}-match-${index + 1}`,
      map: MAPS[index % MAPS.length],
      winner: SQUAD_COLORS[between(seed, index + 21, 0, SQUAD_COLORS.length - 1)],
      won,
      playedAt: new Date(now - (index + 1) * 3 * 86_400_000).toISOString(),
      points: won ? between(seed, index + 31, 22, 38) : between(seed, index + 41, 8, 20),
    } satisfies ScoreboardMatch;
  });
}

export function buildTeamScoreboard({
  teamId,
  roster,
  edition = null,
  matchCount = 8,
}: {
  teamId: string;
  roster: ScoreboardRosterInput[];
  edition?: number | null;
  matchCount?: number;
}): TeamScoreboard {
  const matches = buildPlaceholderMatches(teamId, matchCount);
  const players = buildPlaceholderPlayers(roster, matchCount);
  const points = matches.reduce((total, match) => total + match.points, 0);
  const best = players.reduce<ScoreboardPlayer | null>(
    (leader, player) =>
      !leader || contributionScore(player) > contributionScore(leader) ? player : leader,
    null,
  );

  return {
    teamId,
    edition,
    totals: {
      points,
      matches: matches.length,
      average: matches.length ? Number((points / matches.length).toFixed(1)) : 0,
    },
    players,
    matches,
    mvpPlayerId: best?.id ?? null,
    placeholder: true,
  };
}

export async function fetchTeamScoreboard(input: {
  teamId: string;
  roster: ScoreboardRosterInput[];
  edition?: number | null;
}): Promise<TeamScoreboard> {
  const endpoint = process.env.TEAM_STATS_API_URL;

  if (endpoint) {
    try {
      const token = process.env.TEAM_STATS_API_TOKEN;
      const response = await fetch(
        `${endpoint.replace(/\/$/, "")}/teams/${encodeURIComponent(input.teamId)}`,
        {
          headers: {
            accept: "application/json",
            ...(token ? { authorization: `Bearer ${token}` } : {}),
          },
          signal: AbortSignal.timeout(6_000),
          next: { revalidate: 60 },
        },
      );
      if (response.ok) {
        const data = (await response.json()) as TeamScoreboard;
        if (!Array.isArray(data.players) || !Array.isArray(data.matches) || !data.totals) {
          throw new Error("Payload statistiche non valido");
        }
        return { ...data, placeholder: false };
      }
      console.warn("Team stats API risponde", response.status);
    } catch (error) {
      console.warn("Team stats API non raggiungibile; uso i dati demo.", error);
    }
  }

  return buildTeamScoreboard(input);
}
