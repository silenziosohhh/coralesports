"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Crown, Medal } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { cn } from "@/lib/utils";
import type { TournamentPlayerLeaderboardRow } from "../lib/tournament-leaderboard";

type Props = {
  rows: TournamentPlayerLeaderboardRow[];
  rankOffset: number;
};

function playerLabel(player: TournamentPlayerLeaderboardRow) {
  return player.minecraftUsername || player.discordTag || player.name || player.id;
}

function rankStyle(rank: number) {
  if (rank === 1) {
    return {
      accent: "#ffd84d",
      badge: "border-[#ffd84d]/45 bg-[#ffd84d]/12 text-[#ffe477]",
      metric: "border-[#ffd84d]/30 bg-[#ffd84d]/[0.08] text-[#ffe477]",
      row: "bg-[linear-gradient(90deg,rgba(255,216,77,0.09),rgba(0,157,255,0.05)_52%,transparent)]",
      bar: "linear-gradient(90deg,#ffd84d,#ffb03a)",
    };
  }
  if (rank === 2) {
    return {
      accent: "#bad4e5",
      badge: "border-[#bad4e5]/35 bg-[#bad4e5]/[0.08] text-[#dbeaf3]",
      metric: "border-white/12 bg-white/[0.03] text-[#55ceff]",
      row: "bg-[linear-gradient(90deg,rgba(186,212,229,0.06),transparent_58%)]",
      bar: "linear-gradient(90deg,#dbeaf3,#8fb2c9)",
    };
  }
  if (rank === 3) {
    return {
      accent: "#e78b49",
      badge: "border-[#e78b49]/35 bg-[#e78b49]/[0.08] text-[#f2ad77]",
      metric: "border-white/12 bg-white/[0.03] text-[#55ceff]",
      row: "bg-[linear-gradient(90deg,rgba(231,139,73,0.06),transparent_58%)]",
      bar: "linear-gradient(90deg,#f2ad77,#c96f2e)",
    };
  }
  return {
    accent: "#009dff",
    badge: "border-white/12 bg-white/[0.03] text-white/45",
    metric: "border-white/[0.1] bg-white/[0.02] text-[#55ceff]",
    row: "",
    bar: "linear-gradient(90deg,#009dff,#57ffff)",
  };
}

export function TournamentPlayersLeaderboardTable({ rows, rankOffset }: Props) {
  if (rows.length === 0) {
    return <p className="px-3 py-10 text-center text-sm text-white/50">Nessun giocatore trovato.</p>;
  }

  const topElo = Math.max(...rows.map((row) => row.elo), 1);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-[#03101c]/[0.5]">
      <div className="hidden grid-cols-[62px_minmax(240px,1fr)_90px_90px_120px_112px] gap-3 border-b border-white/[0.1] bg-white/[0.03] px-4 py-3 text-[11px] font-black uppercase tracking-[0.1em] text-white/40 md:grid">
        <span>Pos.</span>
        <span>Giocatore</span>
        <span className="text-center">Vittorie</span>
        <span className="text-center">Sconfitte</span>
        <span className="text-center">Win rate</span>
        <span className="text-right">ELO</span>
      </div>

      {rows.map((player, index) => {
        const rank = rankOffset + index + 1;
        const games = player.wins + player.losses;
        const winRate = games > 0 ? Math.round((player.wins / games) * 100) : 0;
        const label = playerLabel(player);
        const style = rankStyle(rank);
        const share = Math.max(6, Math.round((player.elo / topElo) * 100));
        const delay = Math.min(index, 12) * 0.045;

        return (
          <motion.div
            key={player.id}
            data-leaderboard-row
            initial={{ opacity: 0, x: -22 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "group relative grid min-h-[80px] items-center gap-3 border-b border-white/[0.07] px-4 py-3.5 transition-colors duration-300 last:border-b-0 hover:bg-white/[0.055] md:grid-cols-[62px_minmax(240px,1fr)_90px_90px_120px_112px]",
              style.row,
            )}
          >
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
                {player.image ? (
                  <Image
                    src={player.image}
                    alt={label}
                    fill
                    sizes="48px"
                    className="object-cover [image-rendering:pixelated]"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-white/35">
                    {label.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-black text-white">{label}</p>
                  {rank === 1 ? (
                    <Crown className="h-3.5 w-3.5 shrink-0 text-[#ffd84d]" fill="#ffd84d" />
                  ) : null}
                </div>
                <p className="mt-0.5 truncate text-xs text-white/[0.42]">
                  {player.name && player.name !== label ? player.name : `${games} partite giocate`}
                </p>
              </div>
              <div className="ml-auto text-right md:hidden">
                <p className={cn("text-lg font-black", rank === 1 ? "text-[#ffe477]" : "text-[#55ceff]")}>
                  <AnimatedNumber value={player.elo} delay={delay} format />
                </p>
                <p className="text-[10px] text-white/[0.35]">ELO</p>
              </div>
            </div>

            <div className="relative hidden text-center text-sm font-bold text-emerald-300 md:block">
              {player.wins}
            </div>
            <div className="relative hidden text-center text-sm font-bold text-rose-300 md:block">
              {player.losses}
            </div>
            <div className="relative hidden md:block">
              <div className="mx-auto w-[86px]">
                <div className="flex items-baseline justify-between text-[11px] font-bold">
                  <span className="text-white/[0.65]">{winRate}%</span>
                  <span className="text-white/25">{games}g</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: style.bar }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${winRate}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: delay + 0.15, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            </div>
            <div className="relative hidden justify-end md:flex">
              <div
                className={cn(
                  "min-w-[96px] rounded-xl border px-3 py-1.5 text-right transition-transform duration-300 group-hover:scale-105",
                  style.metric,
                )}
              >
                <AnimatedNumber
                  value={player.elo}
                  delay={delay}
                  format
                  className="text-lg font-black tracking-[-0.035em]"
                />
                <span className="ml-1 text-[10px] opacity-50">ELO</span>
              </div>
            </div>

            <div className="relative ml-12 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:hidden">
              <span className="text-emerald-300">{player.wins} vittorie</span>
              <span className="text-rose-300">{player.losses} sconfitte</span>
              <span className="text-white/[0.45]">{winRate}% win rate</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
