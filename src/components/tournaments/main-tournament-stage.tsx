"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Crown,
  Flame,
  Layers,
  Radio,
  Star,
  Swords,
  Trophy,
  Users,
} from "lucide-react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { pickMainTournament } from "@/lib/tournament-priority";
import { cn } from "@/lib/utils";

export type StageTournament = {
  id: string;
  name: string;
  description: string | null;
  banner: string | null;
  status: string;
  startDate: string;
  maxTeams: number;
  prizePool: string | null;
  format: string;
  teamMode: "SOLO" | "DUO" | "TRIO";
  registeredTeams: number;
};

function statusDetails(status: string) {
  if (status === "LIVE")
    return { label: "Live ora", accent: "#4ade80", pulse: true };
  if (status === "REGISTRATION_OPEN")
    return { label: "Iscrizioni aperte", accent: "#57ffff", pulse: true };
  if (status === "UPCOMING") return { label: "In arrivo", accent: "#ffd63d", pulse: false };
  if (status === "FINISHED") return { label: "Concluso", accent: "#b9d7ff", pulse: false };
  return { label: status.replaceAll("_", " "), accent: "#57ffff", pulse: false };
}

function readableFormat(format: string) {
  return format
    .toLocaleLowerCase("it-IT")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toLocaleUpperCase("it-IT"));
}

function useCountdown(target: string, active: boolean) {
  const compute = useCallback(() => {
    const diff = new Date(target).getTime() - Date.now();
    if (!Number.isFinite(diff) || diff <= 0) return null;
    return {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff / 3_600_000) % 24),
      minutes: Math.floor((diff / 60_000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }, [target]);

  const [left, setLeft] = useState<ReturnType<typeof compute>>(null);

  useEffect(() => {
    if (!active) {
      setLeft(null);
      return;
    }
    setLeft(compute());
    const timer = window.setInterval(() => setLeft(compute()), 1000);
    return () => window.clearInterval(timer);
  }, [active, compute]);

  return left;
}

export function MainTournamentStage({
  tournaments,
  initialFocusId,
}: {
  tournaments: StageTournament[];
  initialFocusId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const fallbackId = useMemo(() => pickMainTournament(tournaments)?.id ?? "", [tournaments]);
  const [focusId, setFocusId] = useState(
    initialFocusId && tournaments.some((t) => t.id === initialFocusId)
      ? initialFocusId
      : fallbackId,
  );

  const focusIndex = Math.max(
    0,
    tournaments.findIndex((tournament) => tournament.id === focusId),
  );
  const focused = tournaments[focusIndex] ?? tournaments[0];
  const isDefaultMain = focused?.id === fallbackId;

  const select = useCallback(
    (id: string) => {
      setFocusId(id);
      const query = id === fallbackId ? "" : `?focus=${encodeURIComponent(id)}`;
      router.replace(`${pathname}${query}`, { scroll: false });
    },
    [fallbackId, pathname, router],
  );

  const step = useCallback(
    (direction: 1 | -1) => {
      const next = (focusIndex + direction + tournaments.length) % tournaments.length;
      select(tournaments[next].id);
    },
    [focusIndex, select, tournaments],
  );

  if (!focused) return null;

  return (
    <section aria-label="Torneo principale" className="mb-8">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={focused.id}
            initial={{ opacity: 0, y: 24, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.99 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <MainCard tournament={focused} isDefaultMain={isDefaultMain} />
          </motion.div>
        </AnimatePresence>

        <TournamentSwitcher
          tournaments={tournaments}
          focusId={focused.id}
          mainId={fallbackId}
          onSelect={select}
          onStep={step}
        />
      </div>
    </section>
  );
}

function MainCard({
  tournament,
  isDefaultMain,
}: {
  tournament: StageTournament;
  isDefaultMain: boolean;
}) {
  const status = statusDetails(tournament.status);
  const countdown = useCountdown(
    tournament.startDate,
    tournament.status !== "FINISHED" && tournament.status !== "LIVE",
  );
  const slots = tournament.maxTeams > 0 ? tournament.maxTeams : null;
  const fillPercent = slots
    ? Math.min(100, Math.round((tournament.registeredTeams / slots) * 100))
    : 0;
  const dateLabel = new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(tournament.startDate));

  return (
    <article className="group relative h-full overflow-hidden rounded-[30px] border-2 border-white/20 bg-[#061b3b]/78 shadow-[0_30px_84px_rgba(0,20,65,0.42)] backdrop-blur-2xl">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 rounded-[28px] opacity-70"
        style={{ boxShadow: `inset 0 0 0 1px ${status.accent}44, inset 0 0 60px ${status.accent}12` }}
      />

      <div className="relative h-[300px] overflow-hidden sm:h-[360px]">
        <Image
          src={tournament.banner || "/default_tournament_banner.jpeg"}
          alt={tournament.name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 62vw"
          className="scale-[1.03] object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.08]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,10,26,0.34)_0%,rgba(4,17,40,0.72)_52%,rgba(6,27,59,0.98)_100%)]" />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[2px]"
          style={{ background: `linear-gradient(90deg,transparent,${status.accent},transparent)` }}
        />

        <div className="absolute inset-x-5 top-5 flex flex-wrap items-start justify-between gap-3 sm:inset-x-7">
          <div className="flex flex-wrap items-center gap-2">
            {isDefaultMain ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ffd63d]/50 bg-[#ffd63d]/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#ffe982] backdrop-blur-md">
                <Crown className="h-3.5 w-3.5" />
                Torneo principale
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-[#03162f]/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white/80 backdrop-blur-md">
                <Star className="h-3.5 w-3.5" />
                In anteprima
              </span>
            )}
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] backdrop-blur-md"
              style={{
                borderColor: `${status.accent}77`,
                backgroundColor: `${status.accent}22`,
                color: status.accent,
              }}
            >
              {status.pulse ? (
                <span className="relative flex h-2 w-2">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                    style={{ backgroundColor: status.accent }}
                  />
                  <span
                    className="relative inline-flex h-2 w-2 rounded-full"
                    style={{ backgroundColor: status.accent }}
                  />
                </span>
              ) : null}
              {status.label}
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-[#03162f]/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white backdrop-blur-md">
            <Swords className="h-3.5 w-3.5 text-[#57ffff]" />
            {tournament.teamMode}
          </span>
        </div>

        <div className="absolute inset-x-5 bottom-5 sm:inset-x-7 sm:bottom-6">
          <div
            aria-hidden
            className="mb-3 h-1 w-16 rounded-full"
            style={{ background: `linear-gradient(90deg,${status.accent},transparent)` }}
          />
          <h2 className="text-balance text-[clamp(1.9rem,4.2vw,3.2rem)] font-black leading-[0.95] tracking-[-0.045em] text-white [text-shadow:0_4px_18px_rgba(0,0,0,0.5)]">
            {tournament.name}
          </h2>
          <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-white/72 sm:text-base">
            {tournament.description || "Preparati a competere nell'arena CoralMC."}
          </p>
        </div>
      </div>

      <div className="relative space-y-5 p-5 sm:p-7">
        {countdown ? (
          <div className="rounded-2xl border border-white/16 bg-[#03142b]/55 p-4">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/45">
              Si parte tra
            </p>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {[
                { value: countdown.days, label: "Giorni" },
                { value: countdown.hours, label: "Ore" },
                { value: countdown.minutes, label: "Min" },
                { value: countdown.seconds, label: "Sec" },
              ].map((unit) => (
                <div
                  key={unit.label}
                  className="rounded-xl border border-white/14 bg-white/[0.06] py-2.5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.09)]"
                >
                  <div className="text-2xl font-black tabular-nums tracking-[-0.04em] text-white sm:text-3xl">
                    {String(unit.value).padStart(2, "0")}
                  </div>
                  <div className="mt-0.5 text-[9px] font-black uppercase tracking-[0.14em] text-white/45">
                    {unit.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : tournament.status === "LIVE" ? (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/35 bg-emerald-400/10 px-4 py-3.5">
            <Flame className="h-5 w-5 shrink-0 text-emerald-300" />
            <p className="text-sm font-black text-emerald-200">
              Il torneo è in corso — segui i match in tempo reale.
            </p>
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/14 bg-white/[0.05] p-4">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.12em]">
              <span className="inline-flex items-center gap-2 text-white/55">
                <Users className="h-4 w-4 text-[#57ffff]" />
                Team iscritti
              </span>
              <span className="text-white">
                <AnimatedNumber value={tournament.registeredTeams} />
                <span className="text-white/40">/{slots ?? "∞"}</span>
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.09]">
              <motion.div
                className="h-full rounded-full bg-[linear-gradient(90deg,#009dff,#57ffff)]"
                initial={{ width: 0 }}
                animate={{ width: `${slots ? fillPercent : 100}%` }}
                transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <p className="mt-2 text-[11px] font-semibold text-white/40">
              {slots
                ? fillPercent >= 100
                  ? "Posti esauriti"
                  : `${slots - tournament.registeredTeams} posti ancora liberi`
                : "Posti illimitati"}
            </p>
          </div>

          <div className="rounded-2xl border border-[#ffd63d]/25 bg-[#ffd63d]/[0.07] p-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#ffd63d]/80">
              <Trophy className="h-4 w-4" />
              Montepremi
            </div>
            <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#ffe982]">
              {tournament.prizePool ? `${tournament.prizePool}€` : "Gloria eterna"}
            </p>
            <p className="mt-1 text-[11px] font-semibold text-white/40">
              {readableFormat(tournament.format)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-white/60">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[#57ffff]" />
            {dateLabel}
          </span>
          <span className="inline-flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#57ffff]" />
            {readableFormat(tournament.format)}
          </span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/tournaments/${tournament.id}`}
            className="inline-flex min-h-[3.6rem] flex-1 items-center justify-center gap-3 rounded-[14px] border-[5px] border-[#007fda] bg-[#0bb5ff] px-5 text-base font-black text-[#00152b] shadow-[0_10px_0_rgba(0,66,132,0.45),0_18px_30px_rgba(0,20,65,0.24)] transition-transform hover:scale-[1.015] active:translate-y-0.5"
          >
            <Swords className="h-5 w-5" />
            Entra nel torneo
          </Link>
          <Link
            href={`/leaderboard?tournament=${encodeURIComponent(tournament.id)}`}
            className="inline-flex min-h-[3.6rem] items-center justify-center gap-2 rounded-[14px] border-2 border-white/25 bg-white/[0.07] px-5 text-sm font-black text-white transition-colors hover:border-[#57ffff]/60 hover:text-[#57ffff]"
          >
            <BarChart3 className="h-4 w-4" />
            Classifica
          </Link>
        </div>
      </div>
    </article>
  );
}

function TournamentSwitcher({
  tournaments,
  focusId,
  mainId,
  onSelect,
  onStep,
}: {
  tournaments: StageTournament[];
  focusId: string;
  mainId: string;
  onSelect: (id: string) => void;
  onStep: (direction: 1 | -1) => void;
}) {
  return (
    <aside className="flex h-full flex-col rounded-[26px] border-2 border-white/20 bg-[#061b3b]/68 p-4 shadow-[0_22px_60px_rgba(0,20,65,0.28)] backdrop-blur-2xl">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-black text-white">Altri tornei</p>
          <p className="mt-0.5 text-[11px] font-semibold text-white/40">
            {tournaments.length} in calendario
          </p>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onStep(-1)}
            aria-label="Torneo precedente"
            disabled={tournaments.length < 2}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/20 bg-white/[0.06] text-white transition-colors hover:border-[#57ffff]/60 hover:text-[#57ffff] disabled:opacity-35"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onStep(1)}
            aria-label="Torneo successivo"
            disabled={tournaments.length < 2}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/20 bg-white/[0.06] text-white transition-colors hover:border-[#57ffff]/60 hover:text-[#57ffff] disabled:opacity-35"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <ul className="flex max-h-[520px] flex-col gap-2 overflow-y-auto pr-1">
        {tournaments.map((tournament) => {
          const status = statusDetails(tournament.status);
          const active = tournament.id === focusId;
          return (
            <li key={tournament.id}>
              <button
                type="button"
                onClick={() => onSelect(tournament.id)}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border-2 p-2.5 text-left transition-all duration-300",
                  active
                    ? "border-[#57ffff]/60 bg-[#57ffff]/[0.09] shadow-[0_10px_28px_rgba(87,255,255,0.14)]"
                    : "border-white/14 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.07]",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-y-0 left-0 w-[3px] bg-[#57ffff] transition-opacity duration-300",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
                <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-xl border border-white/15">
                  <Image
                    src={tournament.banner || "/default_tournament_banner.jpeg"}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-white">{tournament.name}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 truncate text-[10px] font-black uppercase tracking-[0.1em]">
                    <span style={{ color: status.accent }}>{status.label}</span>
                    <span className="text-white/25">·</span>
                    <span className="text-white/40">{tournament.teamMode}</span>
                  </p>
                </div>
                {tournament.id === mainId ? (
                  <Crown className="h-4 w-4 shrink-0 text-[#ffd63d]" />
                ) : (
                  <Radio className="h-3.5 w-3.5 shrink-0 text-white/15" />
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 border-t border-white/12 pt-3 text-[11px] leading-relaxed text-white/35">
        Il torneo con la corona è quello principale in questo momento. Seleziona un altro evento
        per vederne i dettagli.
      </p>
    </aside>
  );
}
