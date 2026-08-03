"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Crown, Medal } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { getTeamAvatar } from "@/lib/team-avatar";
import { cn } from "@/lib/utils";
import type { TournamentLeaderboardRow } from "../lib/tournament-leaderboard";

type Props = {
  rows: TournamentLeaderboardRow[];
  rankOffset: number;
};

function rankStyle(rank: number) {
  if (rank === 1) {
    return {
      accent: "#ffd84d",
      badge: "border-[#ffd84d]/45 bg-[#ffd84d]/12 text-[#ffe477]",
      points: "border-[#ffd84d]/30 bg-[#ffd84d]/[0.08] text-[#ffe477]",
      row: "bg-[linear-gradient(90deg,rgba(255,216,77,0.09),rgba(0,157,255,0.05)_52%,transparent)]",
      bar: "linear-gradient(90deg,#ffd84d,#ffb03a)",
    };
  }
  if (rank === 2) {
    return {
      accent: "#bad4e5",
      badge: "border-[#bad4e5]/35 bg-[#bad4e5]/[0.08] text-[#dbeaf3]",
      points: "border-white/12 bg-white/[0.03] text-[#55ceff]",
      row: "bg-[linear-gradient(90deg,rgba(186,212,229,0.06),transparent_58%)]",
      bar: "linear-gradient(90deg,#dbeaf3,#8fb2c9)",
    };
  }
  if (rank === 3) {
    return {
      accent: "#e78b49",
      badge: "border-[#e78b49]/35 bg-[#e78b49]/[0.08] text-[#f2ad77]",
      points: "border-white/12 bg-white/[0.03] text-[#55ceff]",
      row: "bg-[linear-gradient(90deg,rgba(231,139,73,0.06),transparent_58%)]",
      bar: "linear-gradient(90deg,#f2ad77,#c96f2e)",
    };
  }
  return {
    accent: "#009dff",
    badge: "border-white/12 bg-white/[0.03] text-white/45",
    points: "border-white/[0.1] bg-white/[0.02] text-[#55ceff]",
    row: "",
    bar: "linear-gradient(90deg,#009dff,#57ffff)",
  };
}

export function TournamentLeaderboardTable({ rows, rankOffset }: Props) {
  if (rows.length === 0) {
    return <p className="px-3 py-10 text-center text-sm text-white/50">Nessun team trovato.</p>;
  }

  const topPoints = Math.max(...rows.map((row) => row.points), 1);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-[#03101c]/[0.5]">
      <div className="hidden grid-cols-[62px_minmax(220px,1fr)_76px_110px_96px_104px] gap-3 border-b border-white/[0.1] bg-white/[0.03] px-4 py-3 text-[11px] font-black uppercase tracking-[0.1em] text-white/40 md:grid">
        <span>Pos.</span>
        <span>Team</span>
        <span className="text-center">Giocate</span>
        <span className="text-center">V / S</span>
        <span className="text-center">Diff.</span>
        <span className="text-right">Punti</span>
      </div>

      {rows.map((row, index) => {
        const rank = rankOffset + index + 1;
        const style = rankStyle(rank);
        const avatar = getTeamAvatar({
          tag: row.teamTag,
          logo: row.teamLogo,
          members: row.leader
            ? [{ role: "CAPTAIN", user: { ...row.leader, discordTag: null } }]
            : [],
        });
        const share = Math.max(6, Math.round((row.points / topPoints) * 100));
        const delay = Math.min(index, 12) * 0.045;

        return (
          <motion.div
            key={row.teamId}
            data-leaderboard-row
            initial={{ opacity: 0, x: -22 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "group relative grid min-h-[80px] items-center gap-3 border-b border-white/[0.07] px-4 py-3.5 transition-colors duration-300 last:border-b-0 hover:bg-white/[0.055] md:grid-cols-[62px_minmax(220px,1fr)_76px_110px_96px_104px]",
              style.row,
            )}
          >
            <Link
              href={`/teams/${row.teamId}`}
              aria-label={`Apri la scheda di ${row.teamName}`}
              className="absolute inset-0 z-20 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#57ffff]"
            />

            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 -z-0 opacity-[0.09] transition-opacity duration-500 group-hover:opacity-[0.18]"
              style={{ width: `${share}%`, background: style.bar }}
            />
            <span
              aria-hidden
              className={cn(
                "absolute inset-y-3 left-0 w-[3px] rounded-full transition-all duration-300 group-hover:scale-y-100 group-hover:opacity-100",
                rank <= 3 ? "scale-y-100 opacity-100" : "scale-y-50 opacity-0",
              )}
              style={{ backgroundColor: style.accent, boxShadow: `0 0 14px ${style.accent}` }}
            />

            <div className="relative hidden md:block">
              <div
                className={cn(
                  "flex h-10 w-12 items-center justify-center gap-1 rounded-lg border font-mono text-sm font-black transition-transform duration-300 group-hover:scale-105",
                  style.badge,
                )}
              >
                {rank <= 3 ? (
                  <Medal className="h-3.5 w-3.5" style={{ color: style.accent }} />
                ) : null}
                {String(rank).padStart(2, "0")}
              </div>
            </div>

            <div className="relative flex min-w-0 items-center gap-3">
              <div
                className={cn(
                  "flex h-8 w-9 shrink-0 items-center justify-center rounded-lg border font-mono text-xs font-black md:hidden",
                  style.badge,
                )}
              >
                {String(rank).padStart(2, "0")}
              </div>
              <div
                className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border-2 bg-white/5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-3deg]"
                style={{
                  borderColor: rank <= 3 ? `${style.accent}66` : "rgba(255,255,255,0.12)",
                  boxShadow: rank <= 3 ? `0 8px 22px ${style.accent}33` : undefined,
                }}
              >
                {avatar.src ? (
                  <Image
                    src={avatar.src}
                    alt={row.teamName}
                    fill
                    sizes="48px"
                    className={cn("object-cover", avatar.pixelated && "[image-rendering:pixelated]")}
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-white/35">
                    {avatar.initials}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate font-black text-white transition-colors group-hover:text-[#57ffff]">
                    {row.teamName}
                  </span>
                  {rank === 1 ? (
                    <Crown className="h-3.5 w-3.5 shrink-0 text-[#ffd84d]" fill="#ffd84d" />
                  ) : null}
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-white/0 transition-all duration-300 group-hover:text-[#57ffff]" />
                </div>
                <p className="mt-0.5 truncate text-xs text-white/[0.42]">
                  <span className="font-semibold text-white/60">{row.teamTag}</span> · ELO{" "}
                  {row.teamElo} · Seed {row.seed ?? "—"}
                </p>
              </div>
              <div className="ml-auto text-right md:hidden">
                <p className={cn("text-lg font-black", rank === 1 ? "text-[#ffe477]" : "text-[#55ceff]")}>
                  <AnimatedNumber value={row.points} delay={delay} />
                </p>
                <p className="text-[10px] text-white/[0.35]">punti</p>
              </div>
            </div>

            <div className="relative hidden text-center text-sm font-semibold text-white/[0.65] md:block">
              {row.played}
            </div>
            <div className="relative hidden text-center text-sm font-bold md:block">
              <span className="text-emerald-300">{row.wins}</span>
              <span className="px-2 text-white/20">/</span>
              <span className="text-rose-300">{row.losses}</span>
            </div>
            <div className="relative hidden text-center text-sm md:block">
              <span className={row.scoreDiff >= 0 ? "font-bold text-cyan-300" : "font-bold text-rose-300"}>
                {row.scoreDiff >= 0 ? "+" : ""}
                {row.scoreDiff}
              </span>
              <span className="ml-2 text-[11px] text-white/30">
                {row.scoreFor}:{row.scoreAgainst}
              </span>
            </div>
            <div className="relative hidden justify-end md:flex">
              <div
                className={cn(
                  "min-w-[80px] rounded-xl border px-3 py-1.5 text-right transition-transform duration-300 group-hover:scale-105",
                  style.points,
                )}
              >
                <AnimatedNumber
                  value={row.points}
                  delay={delay}
                  className="text-xl font-black tracking-[-0.04em]"
                />
                <span className="ml-1 text-[10px] opacity-50">pt</span>
              </div>
            </div>

            <div className="relative ml-12 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/[0.45] md:hidden">
              <span>{row.played} giocate</span>
              <span className="text-emerald-300">{row.wins} vittorie</span>
              <span className="text-rose-300">{row.losses} sconfitte</span>
              <span className={row.scoreDiff >= 0 ? "text-cyan-300" : "text-rose-300"}>
                Diff. {row.scoreDiff >= 0 ? "+" : ""}
                {row.scoreDiff}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
