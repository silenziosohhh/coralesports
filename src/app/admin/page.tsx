import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {
  ArrowRight,
  BarChart3,
  Settings,
  ShoppingBag,
  Sparkles,
  Swords,
  Trophy,
  Users,
} from "lucide-react";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { getDemoPlayerLeaderboardRows, getDemoTeams, getDemoTournaments } from "@/lib/demo-content";
import { PREVIEW_ADMIN_WITHOUT_LOGIN } from "@/lib/preview-mode";

const sections = [
  {
    href: "/admin/users",
    title: "Utenti",
    description: "Ruoli, ban, overview",
    icon: Users,
    accent: "#57ffff",
  },
  {
    href: "/admin/tournaments",
    title: "Tornei",
    description: "Creazione e gestione",
    icon: Trophy,
    accent: "#ffd63d",
  },
  {
    href: "/admin/matches",
    title: "Match",
    description: "Schedule, risultati, dispute",
    icon: Swords,
    accent: "#009dff",
  },
  {
    href: "/admin/analytics",
    title: "Analytics",
    description: "Statistiche piattaforma",
    icon: BarChart3,
    accent: "#4ade80",
  },
  {
    href: "/admin/store",
    title: "Shop",
    description: "Prodotti, categorie, ordini",
    icon: ShoppingBag,
    accent: "#ff9d6b",
  },
  {
    href: "/admin/settings",
    title: "Impostazioni",
    description: "Configurazioni piattaforma",
    icon: Settings,
    accent: "#c39bff",
  },
] as const;

export default async function AdminIndexPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";
  const previewOnly = !isAdmin;
  if (previewOnly && !PREVIEW_ADMIN_WITHOUT_LOGIN) {
    redirect(session ? "/dashboard" : "/auth/signin");
  }

  const counters = [
    { label: "Tornei", value: getDemoTournaments().length },
    { label: "Team", value: getDemoTeams().length },
    { label: "Giocatori", value: getDemoPlayerLeaderboardRows().length },
    {
      label: "Tornei attivi",
      value: getDemoTournaments().filter(
        (tournament) => tournament.status === "LIVE" || tournament.status === "REGISTRATION_OPEN"
      ).length,
    },
  ];

  return (
    <main className="admin-page-shell min-h-screen px-4 pb-32 pt-28 sm:pt-32">
      <div className="admin-page-content mx-auto w-full max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#57ffff]/70">
              Pannello di controllo
            </p>
            <h1 className="text-4xl font-black tracking-[-0.04em] text-white">
              Admin <span className="text-[var(--color-accent)]">Panel</span>
            </h1>
            <p className="mt-2 text-white/55">Gestione piattaforma, tornei e shop.</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard">← Dashboard</Link>
          </Button>
        </div>

        {previewOnly ? (
          <div className="mb-8 flex items-start gap-3 rounded-xl border border-[#ffd63d]/30 bg-[#ffd63d]/[0.07] px-4 py-3">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#ffd63d]" />
            <p className="text-sm font-semibold leading-relaxed text-[#ffe982]">
              Anteprima con dati demo: il login non è ancora collegato, quindi il pannello è
              visibile ma le sezioni interne richiederanno un account amministratore.
            </p>
          </div>
        ) : null}

        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {counters.map((counter) => (
            <div
              key={counter.label}
              className="rounded-xl border border-white/10 bg-[#0a1f3d]/70 px-4 py-3.5"
            >
              <div className="text-2xl font-black tabular-nums tracking-[-0.04em] text-white">
                {counter.value}
              </div>
              <div className="mt-0.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/40">
                {counter.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a1f3d]/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-[#0c2549]/80"
              style={{ ["--card-accent" as string]: section.accent }}
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(90deg,transparent,${section.accent},transparent)`,
                }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                style={{ backgroundColor: `${section.accent}2b` }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ boxShadow: `inset 0 0 0 1px ${section.accent}59` }}
              />

              <div className="relative flex items-start gap-4">
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition-transform duration-300 group-hover:scale-105"
                  style={{
                    borderColor: `${section.accent}40`,
                    backgroundColor: `${section.accent}14`,
                  }}
                >
                  <section.icon className="h-5 w-5" style={{ color: section.accent }} />
                </span>
                <span className="min-w-0">
                  <span className="block text-lg font-black tracking-[-0.02em] text-white">
                    {section.title}
                  </span>
                  <span className="mt-0.5 block text-sm text-white/45">{section.description}</span>
                </span>
              </div>

              <div className="relative mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/35 transition-colors duration-300 group-hover:text-white/60">
                  Apri sezione
                </span>
                <span
                  className="grid h-8 w-8 place-items-center rounded-lg border transition-all duration-300 group-hover:translate-x-0.5"
                  style={{
                    borderColor: `${section.accent}33`,
                    backgroundColor: `${section.accent}12`,
                    color: section.accent,
                  }}
                >
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
