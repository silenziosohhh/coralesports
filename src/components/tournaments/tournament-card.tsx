import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Check, Clock3, Trophy, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface TournamentCardProps {
  featured?: boolean;
  tournament: {
    id: string;
    name: string;
    description: string | null;
    banner: string | null;
    status: string;
    startDate: Date;
    maxTeams: number;
    prizePool: string | null;
    format: string;
    teamMode: "SOLO" | "DUO" | "TRIO";
    _count: { teams: number };
  };
}

function statusDetails(status: string) {
  if (status === "LIVE") return { label: "Live ora", accent: "#57ffff", badge: "border-[#57ffff]/45 bg-[#57ffff]/15 text-[#baffff]" };
  if (status === "REGISTRATION_OPEN") return { label: "Iscrizioni aperte", accent: "#57ffff", badge: "border-[#57ffff]/45 bg-[#57ffff]/15 text-[#baffff]" };
  if (status === "UPCOMING") return { label: "In arrivo", accent: "#ffd63d", badge: "border-[#ffd63d]/45 bg-[#ffd63d]/15 text-[#ffe982]" };
  if (status === "FINISHED") return { label: "Concluso", accent: "#b9d7ff", badge: "border-white/25 bg-white/10 text-white/75" };
  return { label: status.replaceAll("_", " "), accent: "#57ffff", badge: "border-white/25 bg-white/10 text-white/75" };
}

function readableFormat(format: string) {
  return format
    .toLocaleLowerCase("it-IT")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toLocaleUpperCase("it-IT"));
}

export function TournamentCard({ tournament, featured = false }: TournamentCardProps) {
  const status = statusDetails(tournament.status);
  const date = new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(tournament.startDate);

  const details = [
    { icon: Users, label: `${tournament._count.teams}/${tournament.maxTeams > 0 ? tournament.maxTeams : "∞"} team iscritti` },
    { icon: Clock3, label: `${readableFormat(tournament.format)} · ${tournament.teamMode}` },
    { icon: CalendarDays, label: date },
  ];

  return (
    <article
      className={cn(
        "group relative flex min-h-[560px] flex-col overflow-hidden rounded-[28px] border-2 border-white/20 bg-[#061b3b]/72 shadow-[0_26px_70px_rgba(0,20,65,0.34)] backdrop-blur-2xl transition-transform duration-500 hover:-translate-y-2",
        featured && "md:col-span-2 md:grid md:min-h-[430px] md:grid-cols-[1.08fr_0.92fr]",
      )}
    >
      <div className={cn("relative h-60 overflow-hidden", featured && "md:h-full")}>
        <Image
          src={tournament.banner || "/default_tournament_banner.jpeg"}
          alt={tournament.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes={featured ? "(max-width: 768px) 100vw, 58vw" : "(max-width: 768px) 100vw, 50vw"}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,8,18,0.02),rgba(6,27,59,0.9))] md:bg-[linear-gradient(90deg,rgba(1,8,18,0.02),rgba(6,27,59,0.58))]" />
        <div className="absolute inset-x-5 top-5 flex items-start justify-between gap-3">
          <span className={cn("rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.13em] backdrop-blur-md", status.badge)}>
            {status.label}
          </span>
          <span className="rounded-full border border-white/25 bg-[#061b3b]/68 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white backdrop-blur-md">
            {tournament.teamMode}
          </span>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col p-6 sm:p-7">
        <div aria-hidden className="absolute -right-20 -top-20 h-52 w-52 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-35" style={{ backgroundColor: status.accent }} />
        <div className="relative">
          <h2 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">{tournament.name}</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/68 sm:text-base">
            {tournament.description || "Preparati a competere nell'arena CoralMC."}
          </p>
        </div>

        <ul className="relative mt-6 space-y-3">
          {details.map(({ icon: DetailIcon, label }) => (
            <li key={label} className="flex items-center gap-3 text-sm font-semibold text-white/86">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[0.08]" style={{ color: status.accent }}>
                <DetailIcon className="h-4 w-4" />
              </span>
              <span>{label}</span>
              <Check className="ml-auto h-4 w-4 text-white/30" />
            </li>
          ))}
          {tournament.prizePool ? (
            <li className="flex items-center gap-3 text-sm font-semibold text-white/86">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#ffd63d]/10 text-[#ffd63d]">
                <Trophy className="h-4 w-4" />
              </span>
              <span>Montepremi</span>
              <span className="ml-auto text-lg font-black text-[#ffd63d]">{tournament.prizePool}</span>
            </li>
          ) : null}
        </ul>

        <Link
          href={`/tournaments/${tournament.id}`}
          className="relative mt-auto inline-flex min-h-[4rem] items-center justify-center gap-3 rounded-[14px] border-[5px] border-[#007fda] bg-[#0bb5ff] px-5 pt-0.5 text-base font-black text-[#00152b] shadow-[0_10px_0_rgba(0,66,132,0.45),0_18px_30px_rgba(0,20,65,0.24)] transition-transform hover:scale-[1.015]"
        >
          Vedi il torneo
          <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  );
}
