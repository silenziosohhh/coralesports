
const SKIN_HEAD_ENDPOINT = "https://avyra-skin-api.vercel.app/api/avatar";

export type TeamAvatarSource = "logo" | "leader-head" | "leader-avatar" | "initials";

export type TeamAvatarUser = {
  id: string;
  name?: string | null;
  image?: string | null;
  minecraftUsername?: string | null;
  discordTag?: string | null;
};

export type TeamAvatarMember = {
  role?: string | null;
  user: TeamAvatarUser;
};

export type TeamAvatarInput = {
  tag: string;
  logo?: string | null;
  createdById?: string | null;
  members?: TeamAvatarMember[] | null;
};

export type TeamAvatar = {
  src: string | null;
  source: TeamAvatarSource;
  initials: string;
  leaderName: string | null;
  pixelated: boolean;
};

export function minecraftHeadUrl(username: string, size = 256) {
  return `${SKIN_HEAD_ENDPOINT}/${encodeURIComponent(username)}?size=${size}`;
}

export function findTeamLeader(team: TeamAvatarInput): TeamAvatarUser | null {
  const members = team.members ?? [];
  if (!members.length) return null;

  const captain = members.find((member) => member.role === "CAPTAIN");
  if (captain) return captain.user;

  const founder = team.createdById
    ? members.find((member) => member.user.id === team.createdById)
    : undefined;
  if (founder) return founder.user;

  return members[0]?.user ?? null;
}

export function getTeamAvatar(team: TeamAvatarInput, size = 256): TeamAvatar {
  const leader = findTeamLeader(team);
  const leaderName =
    leader?.minecraftUsername || leader?.name || leader?.discordTag || null;
  const initials = team.tag.slice(0, 2).toUpperCase();

  if (team.logo) {
    return { src: team.logo, source: "logo", initials, leaderName, pixelated: false };
  }

  if (leader?.minecraftUsername) {
    return {
      src: minecraftHeadUrl(leader.minecraftUsername, size),
      source: "leader-head",
      initials,
      leaderName,
      pixelated: true,
    };
  }

  if (leader?.image) {
    return { src: leader.image, source: "leader-avatar", initials, leaderName, pixelated: false };
  }

  return { src: null, source: "initials", initials, leaderName, pixelated: false };
}
