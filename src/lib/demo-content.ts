import demoSiteJson from "@/data/demo-site.json";

export type DemoTeamMode = "SOLO" | "DUO" | "TRIO";
export type DemoEntryStatus = "REGISTERED" | "PENDING";

export type DemoTournament = {
  id: string;
  slug: string;
  name: string;
  description: string;
  banner: string | null;
  status: string;
  startDate: string;
  endDate: string | null;
  registrationStart: string | null;
  registrationEnd: string | null;
  maxTeams: number;
  prizePool: string | null;
  format: string;
  teamMode: DemoTeamMode;
  playersPerTeam: number;
  rules: string | null;
  createdAt: string;
  teamIds: string[];
};

export type DemoTeamMember = {
  id: string;
  role: string;
  user: {
    id: string;
    name: string;
    minecraftUsername: string | null;
    discordTag: string | null;
    image: string | null;
    elo: number;
  };
};

export type DemoTeam = {
  id: string;
  name: string;
  tag: string;
  description: string | null;
  logo: string | null;
  createdById: string;
  createdAt: string;
  elo: number;
  members: DemoTeamMember[];
};

export type DemoTournamentEntry = {
  id: string;
  tournamentId: string;
  teamId: string;
  status: DemoEntryStatus;
  seed: number | null;
  registeredAt: string;
};

export type DemoProfile = typeof demoSiteJson.profile;
export type DemoTeamLeaderboardRow = (typeof demoSiteJson.teamLeaderboard)[number];
export type DemoPlayerLeaderboardRow = (typeof demoSiteJson.playerLeaderboard)[number];

type DemoSite = {
  profile: DemoProfile;
  tournaments: DemoTournament[];
  teams: DemoTeam[];
  tournamentEntries: DemoTournamentEntry[];
  teamLeaderboard: DemoTeamLeaderboardRow[];
  playerLeaderboard: DemoPlayerLeaderboardRow[];
};

const demoSite = demoSiteJson as DemoSite;

export const DEMO_CONTENT_ENABLED = process.env.DEMO_CONTENT_FALLBACK !== "false";

export function getDemoProfile() {
  return demoSite.profile;
}

export function getDemoTournaments() {
  return demoSite.tournaments;
}

export function getDemoTournament(id: string) {
  return demoSite.tournaments.find((tournament) => tournament.id === id) ?? null;
}

export function getDemoTeams() {
  return demoSite.teams;
}

export function getDemoTeam(id: string) {
  return demoSite.teams.find((team) => team.id === id) ?? null;
}

export function getDemoTournamentEntries(tournamentId: string) {
  return demoSite.tournamentEntries.filter((entry) => entry.tournamentId === tournamentId);
}

export function getDemoTeamLeaderboardRows() {
  return demoSite.teamLeaderboard;
}

export function getDemoPlayerLeaderboardRows() {
  return demoSite.playerLeaderboard;
}

export function toDemoTournamentApi(tournament: DemoTournament) {
  const teams = tournament.teamIds
    .map((teamId, index) => {
      const team = getDemoTeam(teamId);
      if (!team) return null;
      return {
        id: `demo-registration-${tournament.id}-${team.id}`,
        team: {
          id: team.id,
          name: team.name,
          tag: team.tag,
          logo: team.logo,
          _count: {
            members: team.members.length,
          },
        },
        seed: index + 1,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  return {
    ...tournament,
    teams,
    _count: {
      teams: teams.length,
    },
  };
}

export function toDemoTeamApi(team: DemoTeam) {
  const tournamentCount = demoSite.tournaments.filter((tournament) => tournament.teamIds.includes(team.id)).length;

  return {
    ...team,
    members: team.members.map((member) => ({
      ...member,
      user: {
        id: member.user.id,
        name: member.user.name,
        image: member.user.image,
        minecraftUsername: member.user.minecraftUsername,
        discordTag: member.user.discordTag,
        elo: member.user.elo,
      },
    })),
    _count: {
      tournamentTeams: tournamentCount,
    },
  };
}
