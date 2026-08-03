
export const AVYRA_RENDER_ENDPOINT = "https://avyra-skin-api.vercel.app/api/render";

export const MAX_SQUAD_SIZE = 3;

type Vec3 = [number, number, number];

type SceneCharacter = {
  skin: string;
  pose: string;
  position: Vec3;
  rotation: Vec3;
  scale: number;
};

export type RenderScene = {
  characters: SceneCharacter[];
  camera: { yaw: number; pitch: number; distance: number; target: Vec3 };
  size: number;
  background: string;
};

const SQUAD_CAMERA = { yaw: 16, pitch: 6, target: [0, 16.5, 0] as Vec3 };

const SQUAD_LAYOUTS: Record<1 | 2 | 3, { positions: Vec3[]; distance: number }> = {
  1: { positions: [[0, 0, 0]], distance: 52 },
  2: {
    positions: [
      [9, 0, 1],
      [-13, 0, -2],
    ],
    distance: 82,
  },
  3: {
    positions: [
      [0, 0, 0.5],
      [-16, 0, -2],
      [18, 0, -1.5],
    ],
    distance: 92,
  },
};

export const SQUAD_VARIANTS = {
  1: ["sword_raised", "jumping", "wave"],
  2: ["fighting", "attack", "pointing"],
  3: ["idle", "running", "stomp"],
} as const;

export type SquadVariant = keyof typeof SQUAD_VARIANTS;

export function isSquadVariant(value: unknown): value is SquadVariant {
  return value === 1 || value === 2 || value === 3;
}

export function isValidSkinName(value: string) {
  return /^[A-Za-z0-9_]{1,16}$/.test(value);
}

export function normalizeSquad(skins: Array<string | null | undefined>) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const skin of skins) {
    const name = skin?.trim();
    if (!name || !isValidSkinName(name)) continue;
    const key = name.toLocaleLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(name);
    if (result.length === MAX_SQUAD_SIZE) break;
  }

  return result;
}

export function buildSquadScene(
  skins: string[],
  size = 512,
  variant: SquadVariant = 1,
): RenderScene | null {
  const squad = normalizeSquad(skins);
  if (!squad.length) return null;

  const layout = SQUAD_LAYOUTS[squad.length as 1 | 2 | 3];
  const poses = SQUAD_VARIANTS[variant];

  return {
    characters: squad.map((skin, index) => ({
      skin,
      pose: poses[index],
      position: layout.positions[index],
      rotation: [0, 0, 0],
      scale: 1,
    })),
    camera: {
      yaw: SQUAD_CAMERA.yaw,
      pitch: SQUAD_CAMERA.pitch,
      distance: layout.distance,
      target: SQUAD_CAMERA.target,
    },
    size,
    background: "",
  };
}

export function teamRenderUrl(
  skins: Array<string | null | undefined>,
  { size = 512, variant = 1 as SquadVariant } = {},
) {
  const squad = normalizeSquad(skins);
  if (!squad.length) return null;
  const params = new URLSearchParams({
    skins: squad.join(","),
    size: String(size),
    variant: String(variant),
  });
  return `/api/team-render?${params}`;
}
