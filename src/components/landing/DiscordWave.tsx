import { cn } from "@/lib/utils";

type DiscordWaveProps = {
  position: "top" | "bottom";
  className?: string;
};

export function DiscordWave({ position, className }: DiscordWaveProps) {
  const suffix = position === "top" ? "top" : "bottom";

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute left-0 right-0 z-30 h-[clamp(92px,7vw,132px)] leading-none",
        position === "top" ? "-top-px" : "-bottom-px scale-y-[-1]",
        className,
      )}
    >
      <svg className="block h-full w-full" viewBox="0 0 1909 132" preserveAspectRatio="none">
        <defs>
          <path
            id={`discord-wave-${suffix}`}
            d="M0 40 C20 57 32 70 52 70 C75 70 78 57 112 56 C150 55 171 24 217 22 C260 20 286 52 335 52 C378 52 399 30 440 31 C486 32 512 54 557 54 C595 54 617 32 655 30 C703 28 728 83 780 84 C830 85 849 41 898 40 C944 39 960 62 1001 62 C1043 62 1062 38 1105 38 C1153 38 1173 91 1227 91 C1277 91 1289 44 1338 44 C1387 44 1408 86 1455 86 C1504 86 1517 48 1567 48 C1615 48 1629 87 1675 87 C1721 87 1747 37 1806 37 C1846 37 1870 54 1909 58 L1909 132 L0 132 Z"
          />
          <linearGradient id={`discord-wave-deep-${suffix}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0f3a6b" />
            <stop offset=".48" stopColor="#174b80" />
            <stop offset="1" stopColor="#0b315d" />
          </linearGradient>
          <linearGradient id={`discord-wave-mid-${suffix}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#2b68a6" />
            <stop offset=".5" stopColor="#3b82c4" />
            <stop offset="1" stopColor="#245b94" />
          </linearGradient>
          <mask id={`discord-wave-cutout-${suffix}`} maskUnits="userSpaceOnUse">
            <rect width="1909" height="132" fill="white" />
            <use href={`#discord-wave-${suffix}`} y="36" fill="black" />
          </mask>
        </defs>
        <g mask={`url(#discord-wave-cutout-${suffix})`}>
          <rect width="1909" height="132" fill="var(--bg-primary)" />
          <use href={`#discord-wave-${suffix}`} fill={`url(#discord-wave-deep-${suffix})`} />
          <use href={`#discord-wave-${suffix}`} y="18" fill={`url(#discord-wave-mid-${suffix})`} />
        </g>
      </svg>
    </div>
  );
}
