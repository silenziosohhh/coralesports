import { NextResponse } from "next/server";

export type Clip = {
  id: string;
  url: string;
  author: string | null;
};

const placeholderClips: Clip[] = [
  { id: "demo-1", url: "/bg/pvp-background.mp4", author: "Itors" },
  { id: "demo-2", url: "/bg/pvp-background.mp4", author: "endighrd" },
  { id: "demo-3", url: "/bg/pvp-background.mp4", author: "NutSardina" },
  { id: "demo-4", url: "/bg/pvp-background.mp4", author: "kvnyewest" },
  { id: "demo-5", url: "/bg/pvp-background.mp4", author: "P0RC00" },
  { id: "demo-6", url: "/bg/pvp-background.mp4", author: "Toccamy" },
];

function normalize(payload: unknown): Clip[] {
  const container = isRecord(payload) ? payload : null;
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(container?.clips)
      ? container.clips
      : Array.isArray(container?.data)
        ? container.data
        : [];

  return list
    .map((item: unknown, index: number): Clip | null => {
      if (!isRecord(item)) return null;
      const url = firstString(item.url, item.video, item.videoUrl, item.link);
      if (!url) return null;

      return {
        id: String(item.id ?? item.messageId ?? `clip-${index}`),
        url,
        author: firstString(item.author, item.username, item.user),
      };
    })
    .filter((clip): clip is Clip => clip !== null);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function firstString(...values: unknown[]) {
  return (
    values.find((value): value is string => typeof value === "string" && value.length > 0) ?? null
  );
}

export const revalidate = 300;

export async function GET() {
  const apiUrl = process.env.CLIPS_API_URL;

  if (!apiUrl) {
    return NextResponse.json({ clips: placeholderClips, placeholder: true });
  }

  try {
    const res = await fetch(apiUrl, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`Clips API responded ${res.status}`);

    const clips = normalize(await res.json());
    if (clips.length === 0) {
      return NextResponse.json({ clips: placeholderClips, placeholder: true });
    }

    return NextResponse.json({ clips, placeholder: false });
  } catch (error) {
    console.error("Error fetching clips:", error);
    return NextResponse.json({ clips: placeholderClips, placeholder: true });
  }
}
