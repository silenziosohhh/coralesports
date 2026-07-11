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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { TournamentLeaderboardFilter } from "@/components/leaderboard/tournament-leaderboard-filter";
import { TournamentScopedPageShell } from "@/components/tournaments/tournament-scoped-page-shell";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CreateTournamentDialog } from "@/components/tournaments/create-tournament-dialog";

type SearchParams = Record<string, string | string[] | undefined>;

function getParam(params: SearchParams, key: string) {
  const v = params[key];
  return Array.isArray(v) ? v[0] : v;
}

function parsePage(v: string | undefined) {
  const n = v ? Number.parseInt(v, 10) : 1;
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function parseView(v: string | undefined): "teams" | "players" {
  return v === "players" ? "players" : "teams";
}

export default async function LeaderboardPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";

  const tournaments = await listLeaderboardTournaments();
  const legacySlug = getParam(searchParams, "t");
  const selectedTournamentId =
    getParam(searchParams, "tournament") ||
    getParam(searchParams, "tournamentId") ||
    (legacySlug ? tournaments.find((t) => t.slug === legacySlug)?.id : undefined) ||
    tournaments[0]?.id ||
    "";

  const selectedTournament = selectedTournamentId
    ? tournaments.find((t) => t.id === selectedTournamentId) ?? null
    : null;

  const q = getParam(searchParams, "q")?.trim() || undefined;
  const page = parsePage(getParam(searchParams, "page"));
  const view = parseView(getParam(searchParams, "view"));
  const pageSize = 50;

  const data = selectedTournament
    ? view === "players"
      ? await getTournamentPlayersLeaderboard({ tournamentId: selectedTournament.id, q, page, pageSize })
      : await getTournamentTeamLeaderboard({ tournamentId: selectedTournament.id, q, page, pageSize })
    : { tournament: null, q, page, pageSize, total: 0, rows: [] as TournamentLeaderboardRow[] | TournamentPlayerLeaderboardRow[] };

  const rankOffset = (data.page - 1) * data.pageSize;

  return (
    <TournamentScopedPageShell
      title="Classifica"
      description="Seleziona un torneo per vedere la classifica."
      hasTournaments={tournaments.length > 0}
      filter={<TournamentLeaderboardFilter tournaments={tournaments} selectedTournamentId={selectedTournamentId} />}
      hasSelection={Boolean(selectedTournament)}
      emptyIcon={<Trophy className="mb-4 h-14 w-14 text-muted-foreground" />}
      noTournamentsTitle="Nessun torneo trovato"
      noTournamentsDescription="Crea un torneo per visualizzare la classifica."
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
            <span>Classifica</span>
            <Badge variant="outline">{data.total}</Badge>
          </CardTitle>
          <CardDescription>
            {selectedTournament?.name} • {selectedTournament?.teamMode}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-2">
            <Button
              asChild
              variant={view === "teams" ? "default" : "outline"}
              className={view === "teams" ? "bg-[var(--color-accent)] text-black" : ""}
            >
              <a href={`/leaderboard?tournament=${encodeURIComponent(selectedTournamentId)}&view=teams`}>Teams</a>
            </Button>
            <Button
              asChild
              variant={view === "players" ? "default" : "outline"}
              className={view === "players" ? "bg-[var(--color-accent)] text-black" : ""}
            >
              <a href={`/leaderboard?tournament=${encodeURIComponent(selectedTournamentId)}&view=players`}>Giocatori</a>
            </Button>
          </div>

          <TournamentLeaderboardSearch tournamentId={selectedTournamentId} view={view} q={data.q} />

          {view === "players" ? (
            <TournamentPlayersLeaderboardTable rows={data.rows as TournamentPlayerLeaderboardRow[]} rankOffset={rankOffset} />
          ) : (
            <TournamentLeaderboardTable rows={data.rows as TournamentLeaderboardRow[]} rankOffset={rankOffset} />
          )}

          <TournamentLeaderboardPagination
            tournamentId={selectedTournamentId}
            view={view}
            q={data.q}
            page={data.page}
            pageSize={data.pageSize}
            total={data.total}
          />
        </CardContent>
      </Card>
    </TournamentScopedPageShell>
  );
}
