import { getServerSession } from "next-auth";
import { CalendarClock, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateTournamentDialog } from "@/components/tournaments/create-tournament-dialog";
import {
  MainTournamentStage,
  type StageTournament,
} from "@/components/tournaments/main-tournament-stage";
import { CompetitionPageShell } from "@/components/competition/competition-page-shell";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { DEMO_CONTENT_ENABLED, getDemoTournaments } from "@/lib/demo-content";

export default async function TournamentsPage(
  props: {
    searchParams?: Promise<{ focus?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const [session, tournaments] = await Promise.all([
    getServerSession(authOptions),
    prisma.tournament
      .findMany({
        include: { _count: { select: { teams: true } } },
        orderBy: { startDate: "desc" },
      })
      .catch((error) => {
        if (!DEMO_CONTENT_ENABLED) throw error;
        console.warn("Tournament API unavailable; using demo calendar.", error);
        return getDemoTournaments().map((tournament) => ({
          ...tournament,
          startDate: new Date(tournament.startDate),
          endDate: tournament.endDate ? new Date(tournament.endDate) : null,
          registrationStart: tournament.registrationStart
            ? new Date(tournament.registrationStart)
            : null,
          registrationEnd: tournament.registrationEnd
            ? new Date(tournament.registrationEnd)
            : null,
          createdAt: new Date(tournament.createdAt),
          updatedAt: new Date(tournament.createdAt),
          checkInStart: null,
          checkInEnd: null,
          minTeams: 2,
          createdById: "demo",
          _count: { teams: tournament.teamIds.length },
        }));
      }),
  ]);
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";

  const stageTournaments: StageTournament[] = tournaments.map((tournament) => ({
    id: tournament.id,
    name: tournament.name,
    description: tournament.description,
    banner: tournament.banner,
    status: tournament.status,
    startDate: tournament.startDate.toISOString(),
    maxTeams: tournament.maxTeams,
    prizePool: tournament.prizePool,
    format: tournament.format,
    teamMode: tournament.teamMode,
    registeredTeams: tournament._count.teams,
  }));
  const activeCount = tournaments.filter(
    (tournament) => tournament.status === "LIVE" || tournament.status === "REGISTRATION_OPEN",
  ).length;
  const registeredTeams = tournaments.reduce(
    (total, tournament) => total + tournament._count.teams,
    0,
  );

  return (
    <CompetitionPageShell
      eyebrow="L'arena competitiva CoralMC"
      title="Tornei"
      accent="ufficiali"
      description="Scopri le prossime sfide, iscrivi il tuo team e vivi ogni match in un'arena costruita per la competizione."
      metrics={[
        { value: tournaments.length, label: "Tornei" },
        { value: activeCount, label: "Attivi ora" },
        { value: registeredTeams, label: "Team iscritti" },
      ]}
      contentTitle="Scegli la tua prossima sfida"
      contentDescription="L'evento principale è in evidenza: dalla barra laterale passi agli altri tornei in calendario e ne vedi formato, premi, data e posti disponibili."
      action={
        isAdmin ? (
          <CreateTournamentDialog>
            <Button variant="cyan" size="lg" className="h-12 rounded-xl px-6 font-black">
              Crea torneo
            </Button>
          </CreateTournamentDialog>
        ) : null
      }
    >
      {stageTournaments.length ? (
        <div data-reveal="zoom">
          <MainTournamentStage
            tournaments={stageTournaments}
            initialFocusId={searchParams?.focus}
          />
        </div>
      ) : (
        <section data-reveal="zoom" className="relative overflow-hidden rounded-[28px] border-2 border-white/20 bg-[#061b3b]/68 px-6 py-16 text-center shadow-[0_26px_70px_rgba(0,20,65,0.34)] backdrop-blur-2xl">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,157,255,0.14),transparent_52%)]"
          />
          <Trophy className="relative mx-auto h-10 w-10 text-cyan-300/60" />
          <h2 className="relative mt-5 text-2xl font-black text-white">
            Il prossimo torneo parte da qui
          </h2>
          <p className="relative mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/45">
            Appena verrà pubblicato un nuovo evento troverai qui iscrizioni, formato e dettagli.
          </p>
          {isAdmin ? (
            <CreateTournamentDialog>
              <Button variant="cyan" className="relative mt-7">
                <Sparkles className="mr-2 h-4 w-4" />
                Crea il primo torneo
              </Button>
            </CreateTournamentDialog>
          ) : null}
        </section>
      )}

      <div
        data-reveal="left"
        className="mt-6 flex items-center gap-3 rounded-2xl border border-white/20 bg-[#061b3b]/48 px-5 py-4 text-sm font-semibold text-white/72 backdrop-blur-xl"
      >
        <CalendarClock className="h-4 w-4 shrink-0 text-[#57ffff]" />
        Le date sono mostrate nel tuo fuso orario locale.
      </div>
    </CompetitionPageShell>
  );
}
