import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { ArrowUpRight, CheckCircle2, Clock3, Shield, Trophy, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { TournamentRosterFilter } from "@/components/teams/tournament-roster-filter";
import { CompetitionPageShell } from "@/components/competition/competition-page-shell";
import { CreateTeamDialog } from "@/components/teams/create-team-dialog";
import { TeamAvatar } from "@/components/teams/team-avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DEMO_CONTENT_ENABLED,
  getDemoTeams,
  getDemoTournamentEntries,
  getDemoTournaments,
} from "@/lib/demo-content";
import { MyTeamPanel } from "./_components/MyTeamPanel";
import { TeamDirectory, type DirectoryTeam } from "./_components/TeamDirectory";

export const dynamic = "force-dynamic";

const views = [
  { value: "roster", label: "Team", icon: Users },
  { value: "tournaments", label: "Iscrizioni ai tornei", icon: Trophy },
] as const;

type ViewValue = (typeof views)[number]["value"];

function labelUser(user: {
  minecraftUsername: string | null;
  discordTag: string | null;
  name: string | null;
  id: string;
}) {
  return user.minecraftUsername || user.discordTag || user.name || user.id;
}

function demoTournamentOptions() {
  return getDemoTournaments().map(({ id, name, startDate, status, teamMode }) => ({
    id,
    name,
    startDate: new Date(startDate),
    status,
    teamMode,
  }));
}

function demoDirectoryTeams() {
  return getDemoTeams().map((team) => ({
    id: team.id,
    name: team.name,
    tag: team.tag,
    description: team.description,
    logo: team.logo,
    createdById: team.createdById,
    elo: team.elo,
    wins: 0,
    losses: 0,
    tournaments: getDemoTournaments().filter((tournament) =>
      tournament.teamIds.includes(team.id),
    ).length,
    members: team.members.map((member) => ({
      id: member.id,
      role: member.role,
      user: {
        id: member.user.id,
        name: member.user.name,
        image: member.user.image,
        minecraftUsername: member.user.minecraftUsername,
        discordTag: member.user.discordTag,
        elo: member.user.elo,
      },
    })),
  }));
}

function demoEntries(tournamentId: string) {
  return getDemoTournamentEntries(tournamentId).flatMap((entry) => {
    const team = getDemoTeams().find((candidate) => candidate.id === entry.teamId);
    if (!team) return [];
    return [
      {
        id: entry.id,
        status: entry.status,
        registeredAt: new Date(entry.registeredAt),
        team: { id: team.id, name: team.name, tag: team.tag, logo: team.logo },
        players: team.members.map((member) => ({
          user: {
            id: member.user.id,
            name: member.user.name,
            discordTag: member.user.discordTag,
            minecraftUsername: member.user.minecraftUsername,
            image: member.user.image,
          },
        })),
      },
    ];
  });
}

export default async function TeamsPage(
  props: {
    searchParams?: Promise<{ tournament?: string; tournamentId?: string; view?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const view: ViewValue = searchParams?.view === "tournaments" ? "tournaments" : "roster";

  const [session, tournaments, teams] = await Promise.all([
    getServerSession(authOptions),
    prisma.tournament
      .findMany({
          select: { id: true, name: true, startDate: true, status: true, teamMode: true },
          orderBy: { startDate: "desc" },
          take: 100,
        })
      .catch((error) => {
        if (!DEMO_CONTENT_ENABLED) throw error;
        console.warn("Tournament API unavailable; using demo options.", error);
        return demoTournamentOptions();
      }),
    prisma.team
      .findMany({
            orderBy: { elo: "desc" },
            take: 60,
            select: {
              id: true,
              name: true,
              tag: true,
              description: true,
              logo: true,
              createdById: true,
              elo: true,
              wins: true,
              losses: true,
              _count: { select: { tournamentTeams: true } },
              members: {
                select: {
                  id: true,
                  role: true,
                  user: {
                    select: {
                      id: true,
                      name: true,
                      image: true,
                      minecraftUsername: true,
                      discordTag: true,
                      elo: true,
                    },
                  },
                },
              },
            },
          })
      .then((rows) =>
        rows.map(({ _count, ...team }) => ({
          ...team,
          tournaments: _count.tournamentTeams,
        })),
      )
      .catch((error) => {
        if (!DEMO_CONTENT_ENABLED) throw error;
        console.warn("Team API unavailable; using demo directory.", error);
        return demoDirectoryTeams();
      }),
  ]);

  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";
  const currentUserId = session?.user?.id ?? null;
  const directoryTeams = teams as DirectoryTeam[];
  const myTeam = currentUserId
    ? directoryTeams.find((team) =>
        team.members.some((member) => member.user.id === currentUserId),
      ) ?? null
    : null;
  const isCaptain = Boolean(
    myTeam?.members.some(
      (member) =>
        member.user.id === currentUserId &&
        (member.role === "CAPTAIN" || member.role === "CO_CAPTAIN"),
    ),
  );

  const selectedTournamentId =
    searchParams?.tournament || searchParams?.tournamentId || tournaments[0]?.id || "";
  const selectedTournament = selectedTournamentId
    ? tournaments.find((tournament) => tournament.id === selectedTournamentId) ?? null
    : null;

  const entries =
    view === "tournaments" && selectedTournament
      ? await prisma.tournamentTeam
          .findMany({
            where: { tournamentId: selectedTournament.id },
            select: {
              id: true,
              status: true,
              registeredAt: true,
              team: { select: { id: true, name: true, tag: true, logo: true } },
              players: {
                select: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      discordTag: true,
                      minecraftUsername: true,
                      image: true,
                    },
                  },
                },
                orderBy: { createdAt: "asc" },
              },
            },
            orderBy: { registeredAt: "desc" },
          })
          .catch((error) => {
            if (!DEMO_CONTENT_ENABLED) throw error;
            console.warn("Tournament roster API unavailable; using demo entries.", error);
            return demoEntries(selectedTournament.id);
          })
      : [];

  const complete = entries.filter((entry) => entry.status === "REGISTERED");
  const pending = entries.filter((entry) => entry.status === "PENDING");
  const playersCount = directoryTeams.reduce((total, team) => total + team.members.length, 0);

  return (
    <CompetitionPageShell
      eyebrow="Squadre CoralMC"
      title="Team"
      accent="in gara"
      description="Trova la squadra giusta, chiedi di entrare o invita i tuoi compagni: ogni roster nasce qui."
      metrics={[
        { value: directoryTeams.length, label: "Team" },
        { value: playersCount, label: "Giocatori" },
        { value: tournaments.length, label: "Tornei" },
      ]}
      contentTitle="Ogni roster racconta una sfida"
      contentDescription="Esplora i team attivi, entra in quello che fa per te oppure controlla chi si è già iscritto ai tornei."
      action={
        <CreateTeamDialog>
          <Button variant="cyan" size="lg" className="h-12 rounded-xl px-6 font-black">
            Crea il tuo team
          </Button>
        </CreateTeamDialog>
      }
    >
      <nav
        data-reveal="left"
        aria-label="Vista team"
        className="mb-6 flex w-fit max-w-full gap-1 overflow-x-auto rounded-xl border-2 border-white/20 bg-[#03162f]/55 p-1 backdrop-blur-xl"
      >
        {views.map((option) => {
          const Icon = option.icon;
          return (
            <Link
              key={option.value}
              href={option.value === "roster" ? "/teams" : "/teams?view=tournaments"}
              className={cn(
                "inline-flex h-11 shrink-0 items-center gap-2 rounded-lg px-4 text-sm font-black transition-colors",
                view === option.value
                  ? "bg-[#57ffff] text-[#00204a] shadow-[0_4px_14px_rgba(87,255,255,0.22)]"
                  : "text-white/70 hover:bg-white/[0.08] hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              {option.label}
            </Link>
          );
        })}
      </nav>

      {view === "roster" ? (
        <>
          {myTeam ? <MyTeamPanel team={myTeam} isCaptain={isCaptain} /> : null}

          {!myTeam && currentUserId ? (
            <section
              data-reveal="right"
              className="mb-6 flex flex-col gap-4 rounded-[26px] border-2 border-dashed border-[#57ffff]/35 bg-[#061b3b]/55 p-6 backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#57ffff]">
                  Non sei ancora in un team
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-[-0.03em] text-white">
                  Entra in una squadra o creane una tua
                </h2>
                <p className="mt-1.5 text-sm text-white/50">
                  Chiedi di entrare in un team qui sotto: il capitano riceverà la tua richiesta.
                </p>
              </div>
              <CreateTeamDialog>
                <Button variant="cyan" className="h-12 shrink-0 rounded-xl px-6 font-black">
                  Crea team
                </Button>
              </CreateTeamDialog>
            </section>
          ) : null}

          {directoryTeams.length ? (
            <TeamDirectory teams={directoryTeams} currentUserId={currentUserId} />
          ) : (
            <section
              className="relative overflow-hidden rounded-[28px] border-2 border-white/20 bg-[#061b3b]/68 px-6 py-20 text-center shadow-[0_26px_70px_rgba(0,20,65,0.34)] backdrop-blur-2xl"
            >
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,157,255,0.14),transparent_52%)]"
              />
              <Users className="relative mx-auto h-11 w-11 text-cyan-300/55" />
              <h2 className="relative mt-5 text-2xl font-black text-white">
                Nessun team, per ora
              </h2>
              <p className="relative mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/45">
                Sii il primo: crea una squadra e invita i tuoi compagni.
              </p>
              <CreateTeamDialog>
                <Button variant="cyan" className="relative mt-7">
                  Crea il primo team
                </Button>
              </CreateTeamDialog>
            </section>
          )}
        </>
      ) : !tournaments.length ? (
        <section
          className="relative overflow-hidden rounded-[28px] border-2 border-white/20 bg-[#061b3b]/68 px-6 py-20 text-center shadow-[0_26px_70px_rgba(0,20,65,0.34)] backdrop-blur-2xl"
        >
          <Trophy className="relative mx-auto h-11 w-11 text-cyan-300/55" />
          <h2 className="relative mt-5 text-2xl font-black text-white">Nessun torneo attivo</h2>
          <p className="relative mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/45">
            Le iscrizioni compariranno qui non appena sarà disponibile un torneo.
          </p>
        </section>
      ) : (
        <>
          <section
            data-reveal="left"
            className="mb-9 rounded-[24px] border-2 border-white/20 bg-[#061b3b]/68 p-5 shadow-[0_22px_60px_rgba(0,20,65,0.26)] backdrop-blur-2xl sm:p-6"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="w-full max-w-2xl">
                <label className="mb-2 block text-sm font-bold text-white">Torneo</label>
                <TournamentRosterFilter
                  tournaments={tournaments}
                  selectedTournamentId={selectedTournamentId}
                />
              </div>
              {selectedTournament ? (
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-white/38">
                  <Shield className="h-4 w-4 text-[#57ffff]" />
                  {selectedTournament.teamMode}
                </div>
              ) : null}
            </div>
          </section>

          {!selectedTournament ? (
            <section
              className="rounded-[28px] border-2 border-white/20 bg-[#061b3b]/68 px-6 py-16 text-center shadow-[0_26px_70px_rgba(0,20,65,0.34)] backdrop-blur-2xl"
            >
              <Shield className="mx-auto h-10 w-10 text-cyan-300/50" />
              <h2 className="mt-4 text-xl font-black text-white">Seleziona un torneo</h2>
              <p className="mt-2 text-sm text-white/45">
                Scegli un evento dal menu per visualizzare i roster.
              </p>
            </section>
          ) : (
            <div className="space-y-12">
              <section>
                <div data-reveal="left" className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-xs font-black uppercase tracking-[0.18em]">
                        Confermati
                      </span>
                    </div>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
                      Iscrizioni complete
                    </h2>
                  </div>
                  <span className="text-3xl font-black text-white/20">
                    {String(complete.length).padStart(2, "0")}
                  </span>
                </div>

                {complete.length ? (
                  <div className="grid grid-flow-dense gap-6 md:grid-cols-2">
                    {complete.map((entry) => (
                      <article
                        key={entry.id}
                        className="group relative min-h-[290px] overflow-hidden rounded-[28px] border-2 border-white/20 bg-[#061b3b]/72 p-7 shadow-[0_22px_60px_rgba(0,20,65,0.26)] backdrop-blur-2xl transition duration-500 hover:-translate-y-2"
                      >
                        <div
                          aria-hidden
                          className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#57ffff]/15 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                        />
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex min-w-0 items-center gap-4">
                            <TeamAvatar
                              team={{
                                tag: entry.team.tag,
                                logo: entry.team.logo,
                                members: entry.players.map((player) => ({
                                  role: "CAPTAIN",
                                  user: player.user,
                                })),
                              }}
                              size={56}
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#57ffff]">
                                {entry.team.tag}
                              </p>
                              <h3 className="mt-1 truncate text-3xl font-black text-white">
                                {entry.team.name}
                              </h3>
                            </div>
                          </div>
                          <Link
                            href={`/teams/${entry.team.id}`}
                            aria-label={`Apri ${entry.team.name}`}
                            className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl border-2 border-white/25 bg-white/[0.08] text-white hover:border-[#57ffff]/60 hover:text-[#57ffff]"
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </div>
                        <div className="relative mt-7 flex -space-x-3">
                          {entry.players.slice(0, 6).map(({ user }) => {
                            const label = labelUser(user);
                            return (
                              <div
                                key={user.id}
                                title={label}
                                className="relative grid h-14 w-14 place-items-center overflow-hidden rounded-2xl border-[3px] border-[#57ffff]/55 bg-[#0b233b] text-xs font-black text-white/75 shadow-[0_10px_22px_rgba(0,20,65,0.28)] transition-transform duration-300 group-hover:-translate-y-1"
                              >
                                {user.image ? (
                                  <Image
                                    src={user.image}
                                    alt={label}
                                    fill
                                    sizes="56px"
                                    className="object-cover [image-rendering:pixelated]"
                                  />
                                ) : (
                                  label.slice(0, 2).toUpperCase()
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div className="relative mt-5 flex flex-wrap gap-2">
                          {entry.players.map(({ user }) => (
                            <span
                              key={user.id}
                              className="rounded-lg border border-white/20 bg-white/[0.08] px-3 py-1.5 text-xs font-semibold text-white/82"
                            >
                              {labelUser(user)}
                            </span>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div
                    className="rounded-2xl border-2 border-dashed border-white/20 bg-[#061b3b]/45 px-5 py-12 text-center text-sm text-white/65"
                  >
                    Nessun roster è ancora completo per questo torneo.
                  </div>
                )}
              </section>

              <section>
                <div data-reveal="left" className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-amber-300">
                      <Clock3 className="h-4 w-4" />
                      <span className="text-xs font-black uppercase tracking-[0.18em]">
                        In attesa
                      </span>
                    </div>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
                      Roster da completare
                    </h2>
                  </div>
                  <span className="text-3xl font-black text-white/20">
                    {String(pending.length).padStart(2, "0")}
                  </span>
                </div>
                {pending.length ? (
                  <div className="space-y-3">
                    {pending.map((entry) => (
                      <article
                        key={entry.id}
                        className="flex flex-col gap-4 rounded-2xl border-2 border-white/20 bg-[#061b3b]/58 p-5 shadow-[0_16px_42px_rgba(0,20,65,0.2)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-black text-white">{entry.team.name}</p>
                          <p className="mt-1 text-xs text-white/38">
                            {entry.team.tag} · {entry.players.length} giocatori
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {entry.players.map(({ user }) => (
                            <span
                              key={user.id}
                              className="rounded-lg border border-white/20 bg-white/[0.07] px-3 py-1.5 text-xs font-semibold text-white/75"
                            >
                              {labelUser(user)}
                            </span>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div
                    className="rounded-2xl border-2 border-dashed border-white/20 bg-[#061b3b]/45 px-5 py-10 text-center text-sm text-white/65"
                  >
                    Nessuna iscrizione in sospeso.
                  </div>
                )}
              </section>
            </div>
          )}
        </>
      )}
    </CompetitionPageShell>
  );
}
