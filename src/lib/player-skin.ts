
export const AVYRA_SKIN_API = "https://avyra-skin-api.vercel.app";

export const SHOWCASE_EMOTES = ["clap", "flex", "headball", "wave"] as const;

export type ShowcaseEmote = (typeof SHOWCASE_EMOTES)[number];

export function showcaseEmoteFor(index: number): ShowcaseEmote {
  return SHOWCASE_EMOTES[index % SHOWCASE_EMOTES.length];
}

export function playerBodyUrl(
  username: string,
  { size = 768, emote = "clap" as ShowcaseEmote } = {},
) {
  const params = new URLSearchParams({
    size: String(size),
    emote,
    format: "gif",
    quality: "ultra",
    yaw: "0",
  });
  return `${AVYRA_SKIN_API}/api/body/${encodeURIComponent(username)}?${params}`;
}

export function playerHeadUrl(username: string, size = 128) {
  return `${AVYRA_SKIN_API}/api/avatar/${encodeURIComponent(username)}?size=${size}`;
}
