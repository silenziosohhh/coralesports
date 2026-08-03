import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { CompetitionPageShell } from "@/components/competition/competition-page-shell";
import { Trophy, Users, Calendar, ShoppingBag, Shield, Settings } from "lucide-react";
import Link from "next/link";

const PANEL = "relative overflow-hidden rounded-[28px] border-2 border-white/20 bg-[#061b3b]/68 shadow-[0_26px_70px_rgba(0,20,65,0.34)] backdrop-blur-2xl";

const adminActions = [
  {
    icon: Trophy,
    title: "Gestisci tornei",
    description: "Crea e amministra i tornei della piattaforma",
    href: "/admin/tournaments",
    label: "Apri",
    variant: "cyan" as const,
  },
  {
    icon: Shield,
    title: "Gestisci team",
    description: "Supervisiona le registrazioni dei team",
    href: "/admin/teams",
    label: "Apri",
    variant: "outline" as const,
  },
  {
    icon: Users,
    title: "Gestisci utenti",
    description: "Consulta e modera i giocatori registrati",
    href: "/admin/users",
    label: "Apri",
    variant: "outline" as const,
  },
  {
    icon: ShoppingBag,
    title: "Gestisci store",
    description: "Gestisci prodotti e ordini dello store",
    href: "/admin/store",
    label: "Apri",
    variant: "outline" as const,
  },
  {
    icon: Calendar,
    title: "Calendario match",
    description: "Consulta e modifica la programmazione",
    href: "/admin/matches",
    label: "Apri",
    variant: "outline" as const,
  },
  {
    icon: Settings,
    title: "Impostazioni piattaforma",
    description: "Configura i parametri generali del sito",
    href: "/admin/settings",
    label: "Apri",
    variant: "outline" as const,
  },
];

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";

  if (!isAdmin) {
    redirect("/profile");
  }

  const [totalUsers, activeTournaments, totalTeams, todayMatches] = await Promise.all([
    prisma.user.count(),
    prisma.tournament.count({ where: { status: "LIVE" } }),
    prisma.team.count(),
    prisma.match.count({
      where: {
        scheduledAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    }),
  ]);

  const stats = [
    { icon: Users, value: totalUsers, title: "Utenti totali", hint: "Giocatori registrati" },
    { icon: Trophy, value: activeTournaments, title: "Tornei attivi", hint: "Attualmente in corso" },
    { icon: Users, value: totalTeams, title: "Team totali", hint: "Team registrati" },
    { icon: Calendar, value: todayMatches, title: "Match di oggi", hint: "Partite in programma" },
  ];

  return (
    <CompetitionPageShell
      eyebrow="Pannello di controllo CoralMC"
      title="Dashboard"
      accent="admin"
      description="Il quadro generale della piattaforma: numeri aggiornati, scorciatoie alle sezioni di gestione e attività recente."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ icon: StatIcon, value, title, hint }) => (
          <article
            key={title}
            className="min-w-0 rounded-2xl border border-white/14 bg-white/[0.075] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.13em] text-white/62">{title}</span>
              <StatIcon className="h-4 w-4 shrink-0 text-[#57ffff]" />
            </div>
            <div className="mt-3 truncate text-4xl font-black tracking-[-0.04em] text-white">{value}</div>
            <p className="mt-1 truncate text-xs text-white/48">{hint}</p>
          </article>
        ))}
      </div>

      <h2
        data-reveal="left"
        className="mt-12 text-3xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-4xl"
      >
        Azioni rapide
      </h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {adminActions.map(({ icon: ActionIcon, title, description, href, label, variant }) => (
          <article key={href} className={`${PANEL} flex flex-col p-6`}>
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,157,255,0.14),transparent_52%)]"
            />
            <div className="relative flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-[#57ffff]">
                <ActionIcon className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-black tracking-[-0.02em] text-white">{title}</h3>
            </div>
            <p className="relative mt-3 text-sm leading-relaxed text-white/68">{description}</p>
            <Button asChild variant={variant} className="relative mt-6 w-full rounded-xl font-black">
              <Link href={href}>{label}</Link>
            </Button>
          </article>
        ))}
      </div>

      <h2
        data-reveal="left"
        className="mt-12 text-3xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-4xl"
      >
        Attività recente
      </h2>
      <article className={`${PANEL} mt-6 px-6 py-16 text-center`}>
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,157,255,0.14),transparent_52%)]"
        />
        <Calendar className="relative mx-auto h-10 w-10 text-cyan-300/60" />
        <h3 className="relative mt-5 text-2xl font-black text-white">Nessuna attività recente</h3>
        <p className="relative mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/45">
          Le azioni compiute dallo staff compariranno qui.
        </p>
      </article>
    </CompetitionPageShell>
  );
}
