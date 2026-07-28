import { NextResponse } from "next/server";

export type Clip = {
  id: string;
  url: string;
  author: string | null;
};

// Finché CLIPS_API_URL non è configurata (es. https://bot.ttcm.it/api/clips)
// la sezione mostra queste clip segnaposto.
const placeholderClips: Clip[] = [
  { id: "demo-1", url: "/bg/pvp-background.mp4", author: "Itors" },
  { id: "demo-2", url: "/bg/pvp-background.mp4", author: "endighrd" },
  { id: "demo-3", url: "/bg/pvp-background.mp4", author: "NutSardina" },
  { id: "demo-4", url: "/bg/pvp-background.mp4", author: "kvnyewest" },
  { id: "demo-5", url: "/bg/pvp-background.mp4", author: "P0RC00" },
  { id: "demo-6", url: "/bg/pvp-background.mp4", author: "Toccamy" },
];

/**
 * Normalizza la risposta dell'API esterna: la forma esatta non è ancora nota,
 * quindi accettiamo sia un array che un oggetto con `clips`/`data`, e i nomi
 * di campo più comuni per url e autore.
 */
function normalize(payload: unknown): Clip[] {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as any)?.clips)
      ? (payload as any).clips
      : Array.isArray((payload as any)?.data)
        ? (payload as any).data
        : [];

  return list
    .map((item: any, index: number): Clip | null => {
      const url = item?.url ?? item?.video ?? item?.videoUrl ?? item?.link ?? null;
      if (typeof url !== "string" || !url) return null;

      return {
        id: String(item?.id ?? item?.messageId ?? `clip-${index}`),
        url,
        author: item?.author ?? item?.username ?? item?.user ?? null,
      };
    })
    .filter((clip): clip is Clip => clip !== null);
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
