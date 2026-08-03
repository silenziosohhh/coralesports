"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Radio,
  Trophy,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type TournamentShowcaseItem = {
  id: string;
  name: string;
  description: string | null;
  banner: string | null;
  status: string;
  startDateIso: string;
  maxTeams: number;
  registeredTeams: number;
  prizePool: string | null;
  format: string;
  teamMode: "SOLO" | "DUO" | "TRIO";
};

type Props = {
  tournaments: TournamentShowcaseItem[];
  initialTournamentId: string;
};

const statusMap: Record<string, { label: string; tone: string }> = {
  LIVE: { label: "Live ora", tone: "text-[#57ffff]" },
  REGISTRATION_OPEN: { label: "Iscrizioni aperte", tone: "text-[#57ffff]" },
  UPCOMING: { label: "In arrivo", tone: "text-[#ffe173]" },
  REGISTRATION_CLOSED: { label: "Iscrizioni chiuse", tone: "text-white/70" },
  FINISHED: { label: "Concluso", tone: "text-white/62" },
};

function readableFormat(value: string) {
  return value
    .toLocaleLowerCase("it-IT")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toLocaleUpperCase("it-IT"));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function TournamentShowcase({ tournaments, initialTournamentId }: Props) {
  const root = useRef<HTMLElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeId, setActiveId] = useState(
    tournaments.some((tournament) => tournament.id === initialTournamentId)
      ? initialTournamentId
      : tournaments[0]?.id ?? "",
  );

  const activeTournament = useMemo(
    () => tournaments.find((tournament) => tournament.id === activeId) ?? tournaments[0],
    [activeId, tournaments],
  );

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        "[data-tournament-main-content]",
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 0.62, ease: "power3.out", stagger: 0.07 },
      );
      gsap.fromTo(
        "[data-tournament-main-image]",
        { scale: 1.08, opacity: 0.55 },
        { scale: 1, opacity: 1, duration: 0.9, ease: "power3.out" },
      );
    },
    { scope: root, dependencies: [activeId], revertOnUpdate: true },
  );

  if (!activeTournament) return null;

  const status = statusMap[activeTournament.status] ?? {
    label: activeTournament.status.replaceAll("_", " "),
    tone: "text-white/70",
  };

  const selectTournament = (id: string) => {
    if (id === activeId) return;
    setActiveId(id);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tournament", id);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <section ref={root} aria-label="Tornei disponibili" className="grid grid-flow-dense gap-4 lg:grid-cols-12">
      <article
        key={activeTournament.id}
        data-card-stack
        data-competition-media
        className="group relative min-h-[650px] overflow-hidden rounded-[34px] border-2 border-white/25 bg-[#041a3b] shadow-[0_34px_90px_rgba(0,20,65,0.38)] lg:col-span-8"
      >
        <Image
          data-tournament-main-image
          src={activeTournament.banner || "/default_tournament_banner.jpeg"}
          alt={activeTournament.name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,8,25,0.08)_0%,rgba(3,18,48,0.34)_35%,rgba(3,16,42,0.97)_85%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_15%,rgba(87,255,255,0.22),transparent_32%)]" />

        <div className="relative flex min-h-[650px] flex-col justify-between p-6 sm:p-8 lg:p-10">
          <div data-tournament-main-content className="flex items-start justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-[#03152f]/65 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white backdrop-blur-xl">
              {activeTournament.status === "LIVE" ? <Radio className="h-3.5 w-3.5 text-[#57ffff]" /> : null}
              <span className={status.tone}>{status.label}</span>
            </div>
            <span className="rounded-full border border-white/25 bg-[#03152f]/65 px-4 py-2 text-xs font-black text-white backdrop-blur-xl">
              {activeTournament.teamMode}
            </span>
          </div>

          <div className="max-w-3xl">
            <p data-tournament-main-content className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[#57ffff]">
              Torneo principale
            </p>
            <h2 data-tournament-main-content className="max-w-3xl text-balance text-4xl font-black leading-[0.92] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
              {activeTournament.name}
            </h2>
            <p data-tournament-main-content className="mt-5 max-w-2xl text-base leading-relaxed text-white/76 sm:text-lg">
              {activeTournament.description || "Preparati a competere nell'arena CoralMC."}
            </p>

            <div data-tournament-main-content className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/18 bg-white/[0.09] p-4 backdrop-blur-xl">
                <Users className="h-5 w-5 text-[#57ffff]" />
                <p className="mt-3 text-xl font-black text-white">
                  {activeTournament.registeredTeams}/{activeTournament.maxTeams || "∞"}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-white/52">Team iscritti</p>
              </div>
              <div className="rounded-2xl border border-white/18 bg-white/[0.09] p-4 backdrop-blur-xl">
                <Clock3 className="h-5 w-5 text-[#57ffff]" />
                <p className="mt-3 truncate text-lg font-black text-white">{readableFormat(activeTournament.format)}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-white/52">Formato</p>
              </div>
              <div className="rounded-2xl border border-white/18 bg-white/[0.09] p-4 backdrop-blur-xl">
                <Trophy className="h-5 w-5 text-[#ffe173]" />
                <p className="mt-3 truncate text-xl font-black text-[#ffe173]">{activeTournament.prizePool || "Gloria"}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-white/52">Montepremi</p>
              </div>
            </div>

            <div data-tournament-main-content className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={`/tournaments/${activeTournament.id}`}
                className="inline-flex min-h-16 items-center justify-center gap-3 rounded-2xl border-[5px] border-[#007fda] bg-[#19bcff] px-7 text-base font-black text-[#00152b] shadow-[0_9px_0_rgba(0,66,132,0.48),0_18px_36px_rgba(0,20,65,0.32)] transition-transform hover:scale-[1.025]"
              >
                Entra nel torneo
                <ArrowUpRight className="h-5 w-5" />
              </Link>
              <div className="inline-flex min-h-14 items-center gap-3 rounded-2xl border border-white/18 bg-[#03152f]/62 px-5 text-sm font-bold text-white/82 backdrop-blur-xl">
                <CalendarDays className="h-4 w-4 text-[#57ffff]" />
                {formatDate(activeTournament.startDateIso)}
              </div>
            </div>
          </div>
        </div>
      </article>

      <aside
        data-card-stack
        className="relative min-h-[650px] overflow-hidden rounded-[34px] border-2 border-white/25 bg-[#031733]/72 p-4 shadow-[0_30px_80px_rgba(0,20,65,0.3)] backdrop-blur-2xl lg:col-span-4"
      >
        <div className="mb-4 flex items-center justify-between px-2 pt-2">
          <div>
            <h2 className="text-2xl font-black text-white">Cambia arena</h2>
            <p className="mt-1 text-sm text-white/55">Scorri gli altri tornei</p>
          </div>
          <span className="text-sm font-black text-[#57ffff]">
            {tournaments.findIndex((item) => item.id === activeTournament.id) + 1}/{tournaments.length}
          </span>
        </div>

        <div className="flex min-h-[552px] gap-2 overflow-x-auto pb-1 lg:overflow-hidden">
          {tournaments.map((tournament) => {
            const selected = tournament.id === activeTournament.id;
            const itemStatus = statusMap[tournament.status] ?? { label: tournament.status, tone: "text-white/70" };
            return (
              <button
                key={tournament.id}
                type="button"
                aria-pressed={selected}
                onClick={() => selectTournament(tournament.id)}
                className={cn(
                  "group/slice relative min-w-[78px] overflow-hidden rounded-[24px] border text-left transition-[flex,border-color,transform] duration-700 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#57ffff]/55 lg:min-w-0",
                  selected
                    ? "flex-[3.2] border-[#57ffff]/70 shadow-[0_18px_42px_rgba(0,20,65,0.3)]"
                    : "flex-1 border-white/18 hover:flex-[1.35] hover:border-white/40",
                )}
              >
                <Image
                  src={tournament.banner || "/default_tournament_banner.jpeg"}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 180px, 180px"
                  className="object-cover transition-transform duration-700 group-hover/slice:scale-110"
                />
                <div className={cn("absolute inset-0 transition-colors duration-500", selected ? "bg-[linear-gradient(180deg,rgba(1,8,25,0.08),rgba(3,17,45,0.96))]" : "bg-[#03152f]/72 group-hover/slice:bg-[#03152f]/55")} />

                {selected ? (
                  <div className="absolute inset-0 flex flex-col justify-between p-5">
                    <span className={cn("text-[10px] font-black uppercase tracking-[0.14em]", itemStatus.tone)}>
                      {itemStatus.label}
                    </span>
                    <div>
                      <h3 className="text-balance text-2xl font-black leading-[0.95] text-white">{tournament.name}</h3>
                      <p className="mt-3 text-xs font-semibold text-white/62">{formatDate(tournament.startDateIso)}</p>
                      <div className="mt-4 flex items-center gap-2 text-xs font-black text-[#57ffff]">
                        In primo piano <Check className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-between py-5">
                    <span className="text-[10px] font-black text-white/65">{tournament.teamMode}</span>
                    <span className="max-h-[360px] text-nowrap text-sm font-black uppercase tracking-[0.12em] text-white [writing-mode:vertical-rl] rotate-180">
                      {tournament.name}
                    </span>
                    <ChevronRight className="h-4 w-4 text-[#57ffff]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </aside>
    </section>
  );
}
