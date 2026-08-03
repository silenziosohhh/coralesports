"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Medal } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { WavyPanel } from "@/components/ui/wavy-panel";
import { teamRenderUrl } from "@/lib/team-render";
import { cn } from "@/lib/utils";

export type PodiumEntry = {
  id: string;
  rank: 1 | 2 | 3;
  label: string;
  detail: string;
  metric: number;
  metricLabel: string;
  kind: "player" | "team";
  username: string | null;
  squad: string[];
  image: string | null;
  initials: string;
};

const EMOTE_BY_RANK = { 1: "clap", 2: "flex", 3: "headball" } as const;

const RANK_THEME = {
  1: {
    accent: "#ffd63d",
    soft: "rgba(255,214,61,0.28)",
    ring: "rgba(255,214,61,0.6)",
    label: "Campione",
    fillTop: "rgba(48,40,14,0.94)",
    fillBottom: "rgba(4,16,38,0.95)",
    innerStroke: "rgba(255,214,61,0.22)",
    skin: "h-[280px] w-[220px] sm:h-[400px] sm:w-[310px]",
    squad: "h-[300px] w-[300px] sm:h-[420px] sm:w-[420px]",
  },
  2: {
    accent: "#d7ecff",
    soft: "rgba(215,236,255,0.2)",
    ring: "rgba(215,236,255,0.5)",
    label: "Secondo",
    fillTop: "rgba(28,44,62,0.94)",
    fillBottom: "rgba(4,16,38,0.95)",
    innerStroke: "rgba(215,236,255,0.16)",
    skin: "h-[230px] w-[180px] sm:h-[330px] sm:w-[255px]",
    squad: "h-[250px] w-[250px] sm:h-[350px] sm:w-[350px]",
  },
  3: {
    accent: "#ffad6b",
    soft: "rgba(255,173,107,0.2)",
    ring: "rgba(255,173,107,0.5)",
    label: "Terzo",
    fillTop: "rgba(52,32,20,0.94)",
    fillBottom: "rgba(4,16,38,0.95)",
    innerStroke: "rgba(255,173,107,0.16)",
    skin: "h-[230px] w-[180px] sm:h-[330px] sm:w-[255px]",
    squad: "h-[250px] w-[250px] sm:h-[350px] sm:w-[350px]",
  },
} as const;

function skinBodyUrl(username: string, rank: 1 | 2 | 3) {
  const params = new URLSearchParams({
    size: "1024",
    emote: EMOTE_BY_RANK[rank],
    format: "gif",
    quality: "ultra",
    yaw: "0",
  });
  return `https://avyra-skin-api.vercel.app/api/body/${encodeURIComponent(username)}?${params}`;
}

export function PodiumStage({
  entries,
  viewLabel,
}: {
  entries: PodiumEntry[];
  viewLabel: string;
}) {
  const byRank = new Map(entries.map((entry) => [entry.rank, entry]));
  const stageOrder: Array<1 | 2 | 3> = [2, 1, 3];

  return (
    <section aria-label={`Podio ${viewLabel}`} className="relative isolate mt-4">
      <StageBackdrop />

      <div className="relative z-10 grid grid-cols-1 items-end gap-8 pb-4 pt-8 md:grid-cols-3 md:gap-5 md:pt-14">
        {stageOrder.map((rank, index) => {
          const entry = byRank.get(rank);
          if (!entry) return null;
          return (
            <PodiumColumn
              key={entry.id}
              entry={entry}
              order={rank === 3 ? 0 : rank === 2 ? 1 : 2}
              className={cn(
                index === 1 && "md:-mt-10",
                rank === 1 ? "order-1" : rank === 2 ? "order-2" : "order-3",
                "md:order-none",
              )}
            />
          );
        })}
      </div>
    </section>
  );
}

function PodiumColumn({
  entry,
  order,
  className,
}: {
  entry: PodiumEntry;
  order: number;
  className?: string;
}) {
  const theme = RANK_THEME[entry.rank];
  const [skinFailed, setSkinFailed] = useState(false);
  const delay = 0.18 + order * 0.22;

  const squadSrc =
    entry.kind === "team"
      ? teamRenderUrl(entry.squad, { size: 768, variant: entry.rank })
      : null;
  const playerSrc =
    entry.kind === "player" && entry.username
      ? skinBodyUrl(entry.username, entry.rank)
      : null;
  const characterSrc = squadSrc ?? playerSrc;
  const showCharacter = Boolean(characterSrc) && !skinFailed;
  const frameClass = entry.kind === "team" ? theme.squad : theme.skin;

  return (
    <motion.div
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative flex flex-col items-center", className)}
    >
      {entry.rank === 1 ? (
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 h-[300px] w-[190px] -translate-y-10 bg-[linear-gradient(180deg,rgba(255,214,61,0.28),transparent_72%)] blur-2xl"
        />
      ) : null}

      <div className="relative flex flex-col items-center">
        <motion.div
          animate={{ y: [0, -9, 0] }}
          transition={{
            duration: 4 + entry.rank * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: order * 0.4,
          }}
          className={cn("relative z-10", frameClass)}
        >
          {showCharacter ? (
            <Image
              src={characterSrc as string}
              alt={
                entry.kind === "team"
                  ? `Formazione di ${entry.label}`
                  : `Skin di ${entry.label}`
              }
              fill
              unoptimized
              sizes="(max-width: 640px) 300px, 420px"
              className={cn(
                "object-contain object-bottom drop-shadow-[0_24px_36px_rgba(0,10,30,0.62)]",
                entry.kind === "team" ? "translate-y-[11%]" : "translate-y-[4%]",
              )}
              onError={() => setSkinFailed(true)}
            />
          ) : (
            <div className="flex h-full w-full items-end justify-center pb-2">
              <div
                className="relative grid h-24 w-24 place-items-center overflow-hidden rounded-3xl border-[3px] bg-[#06162c] text-2xl font-black text-white sm:h-32 sm:w-32"
                style={{ borderColor: theme.ring, boxShadow: `0 18px 40px ${theme.soft}` }}
              >
                {entry.image ? (
                  <Image
                    src={entry.image}
                    alt={entry.label}
                    fill
                    sizes="128px"
                    className="object-cover [image-rendering:pixelated]"
                  />
                ) : (
                  entry.initials.toUpperCase()
                )}
              </div>
            </div>
          )}
        </motion.div>

        <div
          aria-hidden
          className="relative z-0 h-2.5 w-24 -translate-y-4 rounded-[50%] blur-md sm:w-36"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        />
      </div>

      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 240, damping: 20 }}
        className={cn(
          "-mt-4 w-full",
          entry.rank === 1 ? "max-w-[330px]" : "max-w-[290px]",
        )}
      >
        <WavyPanel
          className="w-full"
          contentClassName={cn("text-center", entry.rank === 1 ? "px-7 py-7" : "px-6 py-6")}
          fillGradient={[theme.fillTop, theme.fillBottom]}
          stroke={theme.ring}
          strokeWidth={2.5}
          innerStroke={theme.innerStroke}
          innerInset={8}
          amplitude={7}
          wavelength={44}
          glow={theme.soft}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[140px] font-black leading-none tracking-[-0.08em] opacity-[0.09] sm:text-[160px]"
            style={{ color: theme.accent }}
          >
            {entry.rank}
          </span>

          <div className="relative">
            <div
              className="mx-auto inline-flex items-center gap-1.5 rounded-full border px-3 py-1"
              style={{
                backgroundColor: `${theme.accent}1a`,
                borderColor: `${theme.accent}40`,
                color: theme.accent,
              }}
            >
              <Medal className="h-3.5 w-3.5" />
              <span className="text-[10px] font-black uppercase tracking-[0.16em]">
                {theme.label}
              </span>
            </div>

            <p
              className={cn(
                "mt-3 truncate font-black tracking-[-0.02em] text-white",
                entry.rank === 1 ? "text-xl sm:text-2xl" : "text-lg sm:text-xl",
              )}
              title={entry.label}
              style={entry.rank === 1 ? { textShadow: `0 4px 22px ${theme.soft}` } : undefined}
            >
              {entry.label}
            </p>
            <p className="mt-1 truncate text-[11px] font-semibold uppercase tracking-[0.1em] text-white/45">
              {entry.detail}
            </p>

            <svg
              aria-hidden
              viewBox="0 0 72 8"
              className="mx-auto my-3 h-2 w-20"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0 4 Q 9 0 18 4 T 36 4 T 54 4 T 72 4"
                stroke={theme.ring}
                strokeWidth={1.6}
                strokeLinecap="round"
              />
            </svg>

            <div
              className="flex items-baseline justify-center gap-2 rounded-2xl border px-4 py-2.5"
              style={{
                borderColor: `${theme.accent}26`,
                backgroundColor: "rgba(2,10,26,0.3)",
                boxShadow: `inset 0 1px 0 ${theme.accent}1a`,
              }}
            >
              <AnimatedNumber
                value={entry.metric}
                delay={delay + 0.25}
                format
                className="text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl"
              />
              <span
                className="text-[10px] font-black uppercase tracking-[0.14em]"
                style={{ color: `${theme.accent}b0` }}
              >
                {entry.metricLabel}
              </span>
            </div>
          </div>
        </WavyPanel>
      </motion.div>
    </motion.div>
  );
}

function StageBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_5%,rgba(87,255,255,0.14),transparent_62%)]" />
      {SPARKS.map((spark, index) => (
        <motion.span
          key={index}
          className="absolute h-1 w-1 rounded-full bg-[#57ffff]"
          style={{ left: spark.left, top: spark.top, opacity: 0.5 }}
          animate={{ y: [0, -26, 0], opacity: [0.15, 0.75, 0.15] }}
          transition={{
            duration: spark.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: spark.delay,
          }}
        />
      ))}
    </div>
  );
}

const SPARKS = [
  { left: "8%", top: "32%", duration: 4.2, delay: 0 },
  { left: "18%", top: "62%", duration: 5.1, delay: 0.6 },
  { left: "34%", top: "22%", duration: 4.8, delay: 1.2 },
  { left: "52%", top: "48%", duration: 5.6, delay: 0.3 },
  { left: "68%", top: "26%", duration: 4.4, delay: 1.6 },
  { left: "82%", top: "58%", duration: 5.2, delay: 0.9 },
  { left: "92%", top: "36%", duration: 4.9, delay: 2 },
];
