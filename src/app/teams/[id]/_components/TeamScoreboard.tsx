"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Crown, Info, MapPin, Skull, Swords, Trophy, X } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { WavyPanel } from "@/components/ui/wavy-panel";
import { StatRadarChart, type RadarAxis } from "@/components/stats/StatRadarChart";
import { playerBodyUrl, showcaseEmoteFor } from "@/lib/player-skin";
import { contributionScore, type ScoreboardPlayer, type TeamScoreboard } from "@/lib/team-scoreboard";
import { cn } from "@/lib/utils";
import { INTL_LOCALE, useI18n, type Locale } from "@/lib/i18n";

const SQUAD_COLOR = {
  Rosa: "#ff86b3",
  Aqua: "#57ffff",
  Rossi: "#ff7a7a",
  Verdi: "#6ee7a0",
  Blu: "#7aa8ff",
} as const;

const SQUAD_LABEL_KEY = {
  Rosa: "team.score.squad.pink",
  Aqua: "team.score.squad.aqua",
  Rossi: "team.score.squad.red",
  Verdi: "team.score.squad.green",
  Blu: "team.score.squad.blue",
} as const;

function relativeDate(iso: string, locale: Locale) {
  const days = Math.round((Date.now() - new Date(iso).getTime()) / 86_400_000);
  const formatter = new Intl.RelativeTimeFormat(INTL_LOCALE[locale], { numeric: "auto" });
  if (days < 30) return formatter.format(-days, "day");
  if (days < 365) return formatter.format(-Math.round(days / 30), "month");
  return formatter.format(-Math.round(days / 365), "year");
}

export function TeamScoreboardPanel({ teamId }: { teamId: string }) {
  const { t, locale } = useI18n();
  const [data, setData] = useState<TeamScoreboard | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/teams/${teamId}/scoreboard`)
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json();
      })
      .then((payload: TeamScoreboard) => {
        if (!cancelled) setData(payload);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [teamId]);

  if (failed) return null;

  if (!data) {
    return (
      <div className="mb-6 grid animate-pulse gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <div key={index} className="h-24 rounded-2xl border border-white/10 bg-white/[0.04]" />
        ))}
      </div>
    );
  }

  const mvp = data.players.find((player) => player.id === data.mvpPlayerId) ?? null;
  const wins = data.matches.filter((match) => match.won).length;
  const bestPoints = Math.max(...data.matches.map((match) => match.points), 1);

  return (
    <div className="mb-8 space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: t("team.score.points"), value: data.totals.points, accent: "#57ffff" },
          { label: t("team.score.matches"), value: data.totals.matches, accent: "#7aa8ff" },
          { label: t("team.score.average"), value: data.totals.average, accent: "#ffd63d" },
        ].map((tile) => (
          <WavyPanel
            key={tile.label}
            contentClassName="px-5 py-5 text-center"
            fillGradient={["rgba(10,32,64,0.92)", "rgba(4,16,38,0.95)"]}
            stroke={`${tile.accent}66`}
            strokeWidth={2.5}
            innerStroke={`${tile.accent}26`}
            innerInset={8}
            amplitude={6}
            wavelength={42}
            glow={`${tile.accent}26`}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
              {tile.label}
            </p>
            <p
              className="mt-1.5 text-4xl font-black tracking-[-0.05em]"
              style={{ color: tile.accent }}
            >
              <AnimatedNumber value={tile.value} />
            </p>
          </WavyPanel>
        ))}
      </div>

      {data.placeholder ? (
        <div className="flex items-start gap-3 rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#57ffff]" />
          <p className="text-xs leading-relaxed text-white/45">
            {t("team.score.placeholder")}
          </p>
        </div>
      ) : null}

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-xl font-black tracking-[-0.02em] text-white">
            <Swords className="h-5 w-5 text-[#57ffff]" />
            {t("team.score.performance")}
          </h2>
          {mvp ? (
            <p className="hidden text-xs font-semibold text-white/45 sm:block">
              {t("team.score.topImpact")}{" "}
              <span className="font-black text-[#ffd63d]">{mvp.displayName}</span>
            </p>
          ) : null}
        </div>

        <div
          className={cn(
            "grid gap-5",
            data.players.length > 2 ? "md:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-2",
          )}
        >
          {data.players.map((player, index) => (
            <PlayerCard
              key={player.id}
              player={player}
              index={index}
              isMvp={player.id === data.mvpPlayerId}
              roster={data.players}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-xl font-black tracking-[-0.02em] text-white">
            <Trophy className="h-5 w-5 text-[#57ffff]" />
            {t("team.score.history")}
          </h2>
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.12em]">
            <span className="rounded-full border border-emerald-400/35 bg-emerald-400/10 px-2.5 py-1 text-emerald-300">
              {wins} {t("team.score.winShort")}
            </span>
            <span className="rounded-full border border-rose-400/35 bg-rose-400/10 px-2.5 py-1 text-rose-300">
              {data.matches.length - wins} {t("team.score.lossShort")}
            </span>
          </div>
        </div>

        <ul className="space-y-2.5">
          {data.matches.map((match, index) => {
            const squad = SQUAD_COLOR[match.winner as keyof typeof SQUAD_COLOR] ?? "#7aa8ff";
            const squadLabelKey =
              SQUAD_LABEL_KEY[match.winner as keyof typeof SQUAD_LABEL_KEY];
            const result = match.won ? "#4ade80" : "#ff6b6b";
            const share = Math.round((match.points / bestPoints) * 100);

            return (
              <motion.li
                key={match.id}
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.4,
                  delay: Math.min(index, 8) * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative overflow-hidden rounded-2xl border border-white/12 bg-[#081f3e]/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-[#0b2751]/80"
              >
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-[3px]"
                  style={{ background: `linear-gradient(180deg, ${result}, ${result}00)` }}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/2 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: `linear-gradient(90deg, ${result}1a, transparent)` }}
                />

                <div className="relative flex flex-col gap-3 py-3.5 pl-5 pr-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3.5">
                    <span
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition-transform duration-300 group-hover:scale-105"
                      style={{
                        borderColor: `${result}59`,
                        backgroundColor: `${result}1a`,
                        color: result,
                      }}
                      aria-hidden
                    >
                      {match.won ? <Trophy className="h-5 w-5" /> : <X className="h-5 w-5" />}
                    </span>

                    <div className="min-w-0">
                      <p className="flex items-center gap-2 truncate text-[15px] font-black tracking-[-0.01em] text-white">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-white/30" />
                        {match.map}
                      </p>
                      <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold text-white/40">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-black"
                          style={{ backgroundColor: `${squad}1f`, color: squad }}
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: squad }}
                          />
                          {squadLabelKey ? t(squadLabelKey) : match.winner}
                        </span>
                        <span className="text-white/20">·</span>
                        {relativeDate(match.playedAt, locale)}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-4 pl-[3.6rem] sm:pl-0">
                    <div className="hidden w-28 sm:block" aria-hidden>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <motion.span
                          className="block h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${result}80, ${result})` }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${share}%` }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{
                            duration: 0.7,
                            delay: 0.15 + Math.min(index, 8) * 0.04,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        />
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-black leading-none tabular-nums tracking-[-0.03em] text-white">
                        {match.points}
                        <span className="ml-1 text-[10px] font-bold text-white/30">pt</span>
                      </p>
                      <p
                        className="mt-1 text-[10px] font-black uppercase tracking-[0.12em]"
                        style={{ color: result }}
                      >
                        {match.won ? t("team.score.victory") : t("team.score.defeat")}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function PlayerCard({
  player,
  index,
  isMvp,
  roster,
}: {
  player: ScoreboardPlayer;
  index: number;
  isMvp: boolean;
  roster: ScoreboardPlayer[];
}) {
  const { t } = useI18n();
  const [skinFailed, setSkinFailed] = useState(false);
  const accent = isMvp ? "#ffd63d" : "#57ffff";

  const max = (pick: (entry: ScoreboardPlayer) => number) =>
    Math.max(...roster.map(pick), 1);

  const ratio = (entry: ScoreboardPlayer) =>
    Number((entry.kills / Math.max(1, entry.deaths)).toFixed(1));

  const axes: RadarAxis[] = [
    { label: t("team.score.kills"), value: player.kills, max: max((entry) => entry.kills) },
    { label: t("team.score.finalKills"), value: player.finalKills, max: max((entry) => entry.finalKills) },
    { label: t("team.score.beds"), value: player.bedsDestroyed, max: max((entry) => entry.bedsDestroyed) },
    { label: t("team.score.wins"), value: player.wins, max: max((entry) => entry.wins) },
    { label: t("team.score.points"), value: player.points, max: max((entry) => entry.points) },
    { label: t("team.score.ratio"), value: ratio(player), max: max(ratio) },
  ].map((axis) => ({ ...axis, inactive: axis.value <= 0 }));

  const skinSrc =
    player.username && !skinFailed
      ? playerBodyUrl(player.username, { size: 768, emote: showcaseEmoteFor(index) })
      : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-[26px] border-2 border-white/15 bg-[#061b3b]/72 p-5 backdrop-blur-2xl"
      style={isMvp ? { borderColor: "rgba(255,214,61,0.45)" } : undefined}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${accent}1f, transparent 62%)`,
        }}
      />

      {isMvp ? (
        <span className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-[#ffd63d]/45 bg-[#ffd63d]/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#ffe982]">
          <Crown className="h-3.5 w-3.5" />
          {t("team.score.mvp")}
        </span>
      ) : null}

      <div className="relative">
        <div className="relative mx-auto h-[320px] w-[250px] max-w-full">
          {skinSrc ? (
            <Image
              src={skinSrc}
              alt={t("team.score.skinAlt", { name: player.displayName })}
              fill
              unoptimized
              sizes="260px"
              className="object-contain object-bottom drop-shadow-[0_22px_38px_rgba(0,10,30,0.65)]"
              onError={() => setSkinFailed(true)}
            />
          ) : (
            <div className="grid h-full w-full place-items-center">
              <span className="grid h-28 w-28 place-items-center rounded-3xl border-2 border-white/15 bg-[#03142b] text-3xl font-black text-white/40">
                {player.displayName.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="mt-1 text-center">
          <p className="truncate text-lg font-black tracking-[-0.02em] text-white">
            {player.displayName}
          </p>
          <p className="mt-0.5 text-[11px] font-black uppercase tracking-[0.14em] text-white/35">
            {player.role === "CAPTAIN" ? t("team.detail.captain") : t("team.detail.member")} ·{" "}
            {player.elo} ELO
          </p>
        </div>

        <div className="mx-auto mt-3 w-full max-w-[260px]">
          <StatRadarChart axes={axes} accent={accent} />
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { label: t("team.score.kills"), value: player.kills, icon: Swords },
            { label: t("team.score.finalKills"), value: player.finalKills, icon: Crown },
            { label: t("team.score.beds"), value: player.bedsDestroyed, icon: Skull },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/12 bg-white/[0.04] px-2 py-2.5 text-center"
            >
              <stat.icon className="mx-auto mb-1 h-3.5 w-3.5 text-white/30" aria-hidden />
              <div className="text-lg font-black tabular-nums tracking-[-0.03em] text-white">
                {stat.value}
              </div>
              <div className="text-[9px] font-black uppercase tracking-[0.12em] text-white/35">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-center text-[11px] font-semibold text-white/30">
          {t("team.score.contribution", { score: contributionScore(player) })}
        </p>
      </div>
    </motion.article>
  );
}
