"use client";

function MatchCard({
  color,
  winner,
  loser,
  scoreW,
  scoreL,
}: {
  color: string;
  winner: string;
  loser: string;
  scoreW: number;
  scoreL: number;
}) {
  return (
    <div
      className="w-[92px] overflow-hidden rounded-md border"
      style={{ borderColor: "rgba(255,255,255,0.12)" }}
    >
      <div
        className="flex items-center justify-between px-2 py-1"
        style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
      >
        <span className="truncate text-[9px] font-semibold text-white">{winner}</span>
        <span className="text-[9px] font-bold" style={{ color }}>
          {scoreW}
        </span>
      </div>
      <div
        className="flex items-center justify-between px-2 py-1"
        style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
      >
        <span className="truncate text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>
          {loser}
        </span>
        <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>
          {scoreL}
        </span>
      </div>
    </div>
  );
}

export function MiniBracket({ color }: { color: string }) {
  return (
    <div className="relative flex items-center" style={{ width: 262, height: 164 }}>
      <svg
        className="absolute inset-0"
        width={262}
        height={164}
        viewBox="0 0 262 164"
        fill="none"
      >
        <path
          d="M92,32 H132 M92,132 H132 M132,32 V132 M132,82 H170"
          stroke={color}
          strokeOpacity={0.35}
          strokeWidth={1.5}
        />
      </svg>

      <div className="absolute left-0 top-[10px]">
        <MatchCard color={color} winner="Team A" loser="Team B" scoreW={2} scoreL={0} />
      </div>
      <div className="absolute left-0 top-[110px]">
        <MatchCard color={color} winner="Team C" loser="Team D" scoreW={2} scoreL={1} />
      </div>
      <div className="absolute left-[170px] top-[60px]">
        <MatchCard color={color} winner="Team A" loser="Team C" scoreW={2} scoreL={1} />
      </div>
    </div>
  );
}
