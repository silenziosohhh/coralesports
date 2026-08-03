"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Users, Trophy, Target } from "lucide-react";
import { CompetitionPageShell } from "@/components/competition/competition-page-shell";
import { TournamentSignupDialog } from "@/components/tournaments/tournament-signup-dialog";
import { TournamentRegistrationsCard } from "@/components/tournaments/tournament-registrations-card";
import { CoralLoadingScreen } from "@/components/ui/coral-loading-screen";

const PANEL =
  "relative overflow-hidden rounded-[28px] border-2 border-white/20 bg-[#061b3b]/68 shadow-[0_26px_70px_rgba(0,20,65,0.34)] backdrop-blur-2xl";

interface Tournament {
  id: string;
  name: string;
  description: string | null;
  format: string;
  teamMode: "SOLO" | "DUO" | "TRIO";
  playersPerTeam: number;
  maxTeams: number;
  prizePool: string | null;
  startDate: string;
  endDate: string | null;
  registrationStart?: string | null;
  registrationEnd?: string | null;
  status: string;
  rules: string | null;
  banner: string | null;
  createdAt: string;
  _count: {
    teams: number;
  };
  teams: Array<{
    id: string;
    team: {
      id: string;
      name: string;
      tag: string;
      logo: string | null;
      _count: {
        members: number;
      };
    };
  }>;
}

export default function TournamentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const tournamentId = String(params.id);

  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";

  const fetchTournament = useCallback(async () => {
    try {
      const response = await fetch(`/api/tournaments/${tournamentId}`);
      if (response.ok) {
        const data = await response.json();
        setTournament(data);
      }
    } catch (error) {
      console.error("Error fetching tournament:", error);
    } finally {
      setLoading(false);
    }
  }, [tournamentId]);

  useEffect(() => {
    void fetchTournament();
  }, [fetchTournament]);

  if (loading) {
    return <CoralLoadingScreen messageKey="loading.tournament" />;
  }

  if (!tournament) {
    return (
      <CompetitionPageShell
        eyebrow="Scheda torneo"
        title="Torneo"
        accent="non trovato"
        description="Il torneo che cerchi non esiste più oppure il link non è corretto."
        action={
          <Button
            variant="cyan"
            size="lg"
            className="h-12 rounded-xl px-6 font-black"
            onClick={() => router.push("/tournaments")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna ai tornei
          </Button>
        }
      >
        <article className={`${PANEL} px-6 py-16 text-center`}>
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,157,255,0.14),transparent_52%)]"
          />
          <Trophy className="text-cyan-300/60 relative mx-auto h-10 w-10" />
          <h2 className="relative mt-5 text-2xl font-black text-white">
            Nessun torneo a questo indirizzo
          </h2>
          <p className="relative mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/45">
            Controlla il link oppure sfoglia il calendario completo degli eventi.
          </p>
        </article>
      </CompetitionPageShell>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "border-blue-400/35 bg-blue-400/12 text-blue-300";
      case "LIVE":
        return "border-green-400/35 bg-green-400/12 text-green-300";
      case "FINISHED":
        return "border-white/20 bg-white/10 text-white/70";
      default:
        return "border-white/20 bg-white/10 text-white/70";
    }
  };

  return (
    <CompetitionPageShell
      eyebrow="Scheda torneo"
      title={tournament.name}
      description={
        tournament.description ??
        "Iscrizioni, formato, montepremi e regolamento completo di questo evento."
      }
      action={
        <Button
          variant="outline"
          size="lg"
          className="h-12 rounded-xl px-6 font-black"
          onClick={() => router.push("/tournaments")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna ai tornei
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div data-reveal="left" className="space-y-6 lg:col-span-2">
          <TournamentRegistrationsCard
            name={tournament.name}
            bannerUrl={tournament.banner || "/default_tournament_banner.jpeg"}
            teamCount={tournament.teams.length}
            maxTeams={tournament.maxTeams}
            teams={tournament.teams}
            onTeamClick={(teamId) => router.push(`/teams/${teamId}`)}
          />
        </div>

        <div data-reveal="right" data-reveal-delay="0.12" className="space-y-6">
          <article className={`${PANEL} p-6 sm:p-7`}>
            <div
              aria-hidden
              className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#57ffff]/16 blur-3xl"
            />

            <div className="relative flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-[#57ffff]">
                  <Trophy className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-black tracking-[-0.02em] text-white">Info torneo</h2>
              </div>
              <Badge className={`border font-black ${getStatusColor(tournament.status)}`}>
                {tournament.status}
              </Badge>
            </div>

            <div className="relative mt-5 space-y-2">
              {[
                {
                  icon: Calendar,
                  label: "Data",
                  value: new Date(tournament.startDate).toLocaleDateString("it-IT"),
                },
                {
                  icon: Calendar,
                  label: "Ora",
                  value: new Date(tournament.startDate).toLocaleTimeString("it-IT", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                },
                ...(tournament.prizePool
                  ? [
                      {
                        icon: Trophy,
                        label: "Montepremi",
                        value: `${tournament.prizePool}€`,
                        accent: true,
                      },
                    ]
                  : []),
                { icon: Target, label: "Formato", value: tournament.teamMode },
                {
                  icon: Users,
                  label: "Team",
                  value: tournament.maxTeams > 0 ? tournament.maxTeams : "∞",
                },
                { icon: Users, label: "Giocatori/team", value: tournament.playersPerTeam },
              ].map(({ icon: RowIcon, label, value, accent }) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-white/14 bg-white/[0.05] px-4 py-3"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-white/58">
                    <RowIcon className="h-4 w-4 text-[#57ffff]" />
                    {label}
                  </span>
                  <span className={`font-black ${accent ? "text-[#ffd63d]" : "text-white"}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {tournament.rules && (
              <div className="relative mt-5 rounded-2xl border border-white/14 bg-white/[0.05] p-4">
                <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-white/52">
                  <Trophy className="h-4 w-4 text-[#57ffff]" />
                  Regolamento
                </h3>
                <div className="mt-3 space-y-1 break-words text-xs leading-relaxed text-white/62 [overflow-wrap:anywhere]">
                  {tournament.rules.split("\n").map((line, i) => (
                    <p key={i} className="break-words [overflow-wrap:anywhere]">
                      {line || "\u00A0"}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="relative mt-6 space-y-2">
              {session?.user?.id && (
                <TournamentSignupDialog tournamentId={tournament.id} teamMode={tournament.teamMode}>
                  <Button variant="cyan" size="lg" className="w-full rounded-xl font-black">
                    Iscriviti
                  </Button>
                </TournamentSignupDialog>
              )}
              <Button variant="outline" className="w-full rounded-xl font-black">
                Condividi
              </Button>
            </div>
          </article>
        </div>
      </div>
    </CompetitionPageShell>
  );
}
