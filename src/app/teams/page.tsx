import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { TournamentRosterFilter } from "@/components/teams/tournament-roster-filter";
import { TournamentScopedPageShell } from "@/components/tournaments/tournament-scoped-page-shell";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CreateTournamentDialog } from "@/components/tournaments/create-tournament-dialog";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

function labelUser(user: {
  minecraftUsername: string | null;
  discordTag: string | null;
  name: string | null;
  id: string;
}) {
  return user.minecraftUsername || user.discordTag || user.name || user.id;
}

export default async function TeamsPage({
  searchParams,
}: {
  searchParams?: { tournament?: string; tournamentId?: string };
}) {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";

  const tournaments = await prisma.tournament.findMany({
    select: {
      id: true,
      name: true,
      startDate: true,
      status: true,
      teamMode: true,
    },
    orderBy: { startDate: "desc" },
    take: 100,
  });

  const selectedTournamentId = searchParams?.tournament || searchParams?.tournamentId || tournaments[0]?.id || "";
  const selectedTournament = selectedTournamentId
    ? tournaments.find((t) => t.id === selectedTournamentId) ?? null
    : null;

  const entries = selectedTournament
    ? await prisma.tournamentTeam.findMany({
        where: { tournamentId: selectedTournament.id },
        select: {
          id: true,
          status: true,
          registeredAt: true,
          team: { select: { id: true, name: true, tag: true } },
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
    : [];

  const complete = entries.filter((e) => e.status === "REGISTERED");
  const pending = entries.filter((e) => e.status === "PENDING");

  return (
      <TournamentScopedPageShell
      title="Teams"
      description="Seleziona un torneo per vedere gli iscritti."
      hasTournaments={tournaments.length > 0}
      filter={<TournamentRosterFilter tournaments={tournaments} selectedTournamentId={selectedTournamentId} />}
      hasSelection={Boolean(selectedTournament)}
      emptyIcon={<Users className="mb-4 h-14 w-14 text-muted-foreground" />}
      noTournamentsTitle="Nessun torneo trovato"
      noTournamentsDescription="Crea un torneo per visualizzare i team iscritti."
      noTournamentsAction={
        isAdmin ? (
          <CreateTournamentDialog>
            <Button variant="cyan">Create Tournament</Button>
          </CreateTournamentDialog>
        ) : null
      }
    >
      <Card className="glass-card border-cyan/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Iscrizioni complete</span>
            <Badge variant="outline">{complete.length}</Badge>
          </CardTitle>
          <CardDescription>
            {selectedTournament?.name} • {selectedTournament?.teamMode}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {complete.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nessuna iscrizione completa.</p>
          ) : (
            <div className="space-y-3">
              {complete.map((e) => (
                <div key={e.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-white">
                      {e.team.name} ({e.team.tag})
                    </div>
                    <Badge>REGISTERED</Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {e.players.map((p) => (
                      <Badge key={p.user.id} variant="secondary">
                        {labelUser(p.user)}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>In sospeso</span>
            <Badge variant="outline">{pending.length}</Badge>
          </CardTitle>
          <CardDescription>Iscrizioni non complete.</CardDescription>
        </CardHeader>
        <CardContent>
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nessuna iscrizione in sospeso.</p>
          ) : (
            <div className="space-y-3">
              {pending.map((e) => (
                <div key={e.id} className="rounded-lg border border-white/10 bg-black/10 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-white">
                      {e.team.name} ({e.team.tag})
                    </div>
                    <Badge variant="secondary">PENDING</Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {e.players.map((p) => (
                      <Badge key={p.user.id} variant="secondary">
                        {labelUser(p.user)}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TournamentScopedPageShell>
  );
}
