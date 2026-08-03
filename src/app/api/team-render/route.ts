import { NextRequest, NextResponse } from "next/server";
import {
  AVYRA_RENDER_ENDPOINT,
  buildSquadScene,
  isSquadVariant,
  MAX_SQUAD_SIZE,
  normalizeSquad,
  type SquadVariant,
} from "@/lib/team-render";


const ALLOWED_SIZES = new Set([256, 384, 512, 768]);
const UPSTREAM_TIMEOUT_MS = 20_000;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const squad = normalizeSquad((searchParams.get("skins") ?? "").split(","));
  if (!squad.length) {
    return NextResponse.json(
      { error: "Nessuna skin valida: usa ?skins=Nome1,Nome2,Nome3" },
      { status: 400 },
    );
  }

  const requestedSize = Number.parseInt(searchParams.get("size") ?? "512", 10);
  const size = ALLOWED_SIZES.has(requestedSize) ? requestedSize : 512;

  const requestedVariant = Number.parseInt(searchParams.get("variant") ?? "1", 10);
  const variant: SquadVariant = isSquadVariant(requestedVariant) ? requestedVariant : 1;

  const scene = buildSquadScene(squad, size, variant);
  if (!scene) {
    return NextResponse.json({ error: "Scena non costruibile" }, { status: 400 });
  }

  try {
    const upstream = await fetch(AVYRA_RENDER_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(scene),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => "");
      console.error("Team render upstream error:", upstream.status, detail.slice(0, 200));
      return NextResponse.json(
        { error: "Render non disponibile" },
        { status: upstream.status === 404 ? 404 : 502 },
      );
    }

    const png = await upstream.arrayBuffer();

    return new NextResponse(png, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Length": String(png.byteLength),
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
        "X-Squad-Size": String(Math.min(squad.length, MAX_SQUAD_SIZE)),
      },
    });
  } catch (error) {
    console.error("Error rendering team squad:", error);
    return NextResponse.json({ error: "Render non disponibile" }, { status: 502 });
  }
}
