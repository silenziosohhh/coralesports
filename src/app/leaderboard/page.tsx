import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { CalendarDays, Radio, Trophy, UserRound, Users } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { CreateTournamentDialog } from "@/components/tournaments/create-tournament-dialog";
import { TournamentLeaderboardFilter } from "@/components/leaderboard/tournament-leaderboard-filter";
import { CompetitionPageShell } from "@/components/competition/competition-page-shell";
import { cn } from "@/lib/utils";
import { PodiumStage, type PodiumEntry } from "./_components/PodiumStage";
import { TournamentLeaderboardPagination } from "./_components/TournamentLeaderboardPagination";
import { TournamentLeaderboardSearch } from "./_components/TournamentLeaderboardSearch";
import { TournamentLeaderboardTable } from "./_components/TournamentLeaderboardTable";
import { TournamentPlayersLeaderboardTable } from "./_components/TournamentPlayersLeaderboardTable";
import {
  getTournamentPlayersLeaderboard,
  getTournamentTeamLeaderboard,
  listLeaderboardTournaments,
  type TournamentLeaderboardRow,
  type TournamentPlayerLeaderboardRow,
} from "./lib/tournament-leaderboard";

type SearchParams = Record<string, string | string[] | undefined>;

function getParam(params: SearchParams, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function parsePage(value: string | undefined) {
  const parsed = value ? Number.parseInt(value, 10) : 1;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function parseView(value: string | undefined): "teams" | "players" {
  return value === "players" ? "players" : "teams";
}

function statusLabel(status: string) {
  if (status === "LIVE") return "In corso";
  if (status === "UPCOMING") return "In arrivo";
  if (status === "FINISHED") return "Concluso";
  if (status === "REGISTRATION_OPEN") return "Iscrizioni aperte";
  return status.replaceAll("_", " ");
}

export default async function LeaderboardPage(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  const [session, tournaments] = await Promise.all([
    getServerSession(authOptions),
    listLeaderboardTournaments(),
  ]);
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";
  const legacySlug = getParam(searchParams, "t");
  const selectedTournamentId =
    getParam(searchParams, "tournament") ||
    getParam(searchParams, "tournamentId") ||
    (legacySlug ? tournaments.find((tournament) => tournament.slug === legacySlug)?.id : undefined) ||
    tournaments[0]?.id ||
    "";
  const selectedTournament =
    tournaments.find((tournament) => tournament.id === selectedTournamentId) ?? null;
  const q = getParam(searchParams, "q")?.trim() || undefined;
  const page = parsePage(getParam(searchParams, "page"));
  const view = parseView(getParam(searchParams, "view"));
  const pageSize = 50;

  const data = selectedTournament
    ? view === "players"
      ? await getTournamentPlayersLeaderboard({ tournamentId: selectedTournament.id, q, page, pageSize })
      : await getTournamentTeamLeaderboard({ tournamentId: selectedTournament.id, q, page, pageSize })
    : {
        tournament: null,
        q,
        page,
        pageSize,
        total: 0,
        rows: [] as TournamentLeaderboardRow[] | TournamentPlayerLeaderboardRow[],
      };

  const rankOffset = (data.page - 1) * data.pageSize;
  const isPlayersView = view === "players";
  const teamRows = isPlayersView ? [] : (data.rows as TournamentLeaderboardRow[]);
  const playerRows = isPlayersView ? (data.rows as TournamentPlayerLeaderboardRow[]) : [];
  const dateLabel = selectedTournament
    ? new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "long", year: "numeric" }).format(
        selectedTournament.startDate,
      )
    : null;
  const activeTournaments = tournaments.filter(
    (tournament) => tournament.status === "LIVE" || tournament.status === "REGISTRATION_OPEN",
  ).length;
  const showPodium = data.page === 1 && !data.q;
  const podiumEntries: PodiumEntry[] = !showPodium
    ? []
    : isPlayersView
      ? playerRows.slice(0, 3).map((row, index) => ({
          id: row.id,
          rank: (index + 1) as 1 | 2 | 3,
          label: row.minecraftUsername || row.discordTag || row.name || row.id,
          detail: `${row.wins}V · ${row.losses}S`,
          metric: row.elo,
          metricLabel: "ELO",
          kind: "player" as const,
          username: row.minecraftUsername,
          squad: [],
          image: row.image,
          initials: (row.minecraftUsername || row.name || "PL").slice(0, 2),
        }))
      : teamRows.slice(0, 3).map((row, index) => ({
          id: row.teamId,
          rank: (index + 1) as 1 | 2 | 3,
          label: row.teamName,
          detail: `${row.teamTag} · ${row.wins}V · ${row.losses}S`,
          metric: row.points,
          metricLabel: "punti",
          kind: "team" as const,
          username: null,
          squad: row.squad,
          image: row.teamLogo || row.leader?.image || null,
          initials: row.teamTag.slice(0, 2),
        }));

  return (
    <CompetitionPageShell
      eyebrow="Ranking CoralMC"
      title="Classifica"
      accent="competitiva"
      description="Segui l'andamento di team e giocatori, confronta i risultati e scopri chi sta dominando ogni torneo."
      metrics={[
        { value: tournaments.length, label: "Tornei" },
        { value: activeTournaments, label: "Attivi ora" },
        { value: data.total, label: isPlayersView ? "Giocatori" : "Team in classifica" },
      ]}
      contentTitle="La vetta si conquista una partita alla volta"
      contentDescription="Cambia torneo o vista, cerca un nome e confronta risultati, differenza punti ed ELO in un colpo d'occhio."
    >
        {!tournaments.length ? (
          <section
            className="rounded-[28px] border-2 border-white/20 bg-[#061b3b]/68 px-6 py-20 text-center shadow-[0_26px_70px_rgba(0,20,65,0.34)] backdrop-blur-2xl"
          >
            <Trophy className="mx-auto h-10 w-10 text-cyan-300/50" />
            <h2 className="mt-4 text-xl font-bold text-white">Nessun torneo trovato</h2>
            <p className="mt-2 text-sm text-white/50">Crea un torneo per iniziare a vedere la classifica.</p>
            {isAdmin ? (
              <CreateTournamentDialog>
                <Button variant="cyan" className="mt-6">
                  Crea torneo
                </Button>
              </CreateTournamentDialog>
            ) : null}
          </section>
        ) : !selectedTournament ? (
          <section
            className="rounded-[28px] border-2 border-white/20 bg-[#061b3b]/68 px-6 py-20 text-center shadow-[0_26px_70px_rgba(0,20,65,0.34)] backdrop-blur-2xl"
          >
            <Trophy className="mx-auto h-10 w-10 text-cyan-300/50" />
            <h2 className="mt-4 text-xl font-bold text-white">Seleziona un torneo</h2>
          </section>
        ) : (
          <div>
            <section
              data-reveal="left"
              className="rounded-[24px] border-2 border-white/20 bg-[#061b3b]/68 p-5 shadow-[0_22px_60px_rgba(0,20,65,0.26)] backdrop-blur-2xl sm:p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="w-full max-w-2xl">
                  <label className="mb-2 block text-sm font-semibold text-white">Torneo</label>
                  <TournamentLeaderboardFilter
                    tournaments={tournaments}
                    selectedTournamentId={selectedTournamentId}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/76">
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 font-semibold",
                      selectedTournament.status === "LIVE" ? "text-emerald-300" : "text-cyan-300",
                    )}
                  >
                    {selectedTournament.status === "LIVE" ? <Radio className="h-4 w-4" /> : null}
                    {statusLabel(selectedTournament.status)}
                  </span>
                  {dateLabel ? (
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-white/30" />
                      {dateLabel}
                    </span>
                  ) : null}
                </div>
              </div>
            </section>

            {podiumEntries.length ? (
              <PodiumStage
                entries={podiumEntries}
                viewLabel={isPlayersView ? "giocatori" : "team"}
              />
            ) : null}

            <section
              data-reveal="right"
              data-reveal-delay="0.1"
              className="group/scoreboard mt-7 overflow-hidden rounded-[28px] border-2 border-white/20 bg-[#061b3b]/78 shadow-[0_26px_70px_rgba(0,20,65,0.34)] backdrop-blur-2xl"
            >
              <div className="relative h-[220px] overflow-hidden border-b border-cyan-300/[0.12] sm:h-[260px]">
                {selectedTournament.banner ? (
                  <Image
                    src={selectedTournament.banner}
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    className="scale-[1.02] object-cover transition-transform duration-700 ease-out group-hover/scoreboard:scale-[1.055]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(120deg,#07182a,#063258)]" />
                )}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,9,32,0.94)_0%,rgba(6,27,59,0.64)_50%,rgba(6,27,59,0.18)_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_30%,rgba(6,27,59,0.95)_100%)]" />
                <div className="absolute top-0 right-[8%] h-px w-64 bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent shadow-[0_0_18px_rgba(57,196,255,0.7)]" />

                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <div className="mb-3 h-1 w-12 rounded-full bg-gradient-to-r from-[#009dff] to-[#63f4ff] shadow-[0_0_14px_rgba(0,157,255,0.7)]" />
                      <h2 className="text-3xl font-black tracking-[-0.035em] text-white sm:text-4xl">
                        {selectedTournament.name}
                      </h2>
                      <p className="mt-2 text-sm text-white/60">
                        {selectedTournament.teamMode} · {data.total}{" "}
                        {isPlayersView ? "giocatori classificati" : "team classificati"}
                      </p>
                    </div>
                    <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/25 bg-[#03111f]/70 px-3 py-2 text-sm font-semibold text-white/75 backdrop-blur-md">
                      {isPlayersView ? (
                        <UserRound className="h-4 w-4 text-[#39c4ff]" />
                      ) : (
                        <Users className="h-4 w-4 text-[#39c4ff]" />
                      )}
                      Vista <span className="text-white">{isPlayersView ? "Giocatori" : "Team"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 border-b border-white/15 bg-[#061b3b]/92 px-4 py-4 lg:flex-row lg:items-center lg:justify-between sm:px-6">
                <nav
                  aria-label="Vista classifica"
                  className="flex w-fit items-center rounded-xl border border-white/20 bg-[#020c17]/60 p-1"
                >
                  <Link
                    href={`/leaderboard?tournament=${encodeURIComponent(selectedTournamentId)}&view=teams`}
                    className={cn(
                      "relative inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-all duration-200",
                      view === "teams"
                        ? "bg-[#57ffff] text-[#00204a] shadow-[0_4px_14px_rgba(87,255,255,0.18)]"
                        : "text-white/65 hover:bg-white/[0.08] hover:text-white",
                    )}
                  >
                    <Users className="h-4 w-4" />
                    Team
                  </Link>
                  <Link
                    href={`/leaderboard?tournament=${encodeURIComponent(selectedTournamentId)}&view=players`}
                    className={cn(
                      "relative inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-all duration-200",
                      view === "players"
                        ? "bg-[#57ffff] text-[#00204a] shadow-[0_4px_14px_rgba(87,255,255,0.18)]"
                        : "text-white/65 hover:bg-white/[0.08] hover:text-white",
                    )}
                  >
                    <UserRound className="h-4 w-4" />
                    Giocatori
                  </Link>
                </nav>

                <div className="w-full max-w-xl">
                  <TournamentLeaderboardSearch
                    tournamentId={selectedTournamentId}
                    view={view}
                    q={data.q}
                  />
                </div>
              </div>

              <div className="bg-[#061b3b]/72 px-3 py-4 sm:px-5">
                {isPlayersView ? (
                  <TournamentPlayersLeaderboardTable rows={playerRows} rankOffset={rankOffset} />
                ) : (
                  <TournamentLeaderboardTable rows={teamRows} rankOffset={rankOffset} />
                )}

                <TournamentLeaderboardPagination
                  tournamentId={selectedTournamentId}
                  view={view}
                  q={data.q}
                  page={data.page}
                  pageSize={data.pageSize}
                  total={data.total}
                />
              </div>
            </section>
          </div>
        )}
    </CompetitionPageShell>
  );
}
