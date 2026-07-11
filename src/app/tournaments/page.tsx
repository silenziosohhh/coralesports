import { Button } from "@/components/ui/button";
import { CreateTournamentDialog } from "@/components/tournaments/create-tournament-dialog";
import { TournamentCard } from "@/components/tournaments/tournament-card";
import { EmptyStateCard } from "@/components/ui/empty-state-card";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function TournamentsPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";

  const tournaments = await prisma.tournament.findMany({
    include: {
      _count: {
        select: {
          teams: true,
        },
      },
    },
    orderBy: {
      startDate: "desc",
    },
  });
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="page-title mb-2 text-4xl font-bold">
            <span className="text-[var(--text-primary)]">Tournaments</span>
          </h1>
          <p className="text-muted-foreground">
            Browse and join competitive tournaments
          </p>
        </div>
        {isAdmin && (
          <CreateTournamentDialog>
            <Button variant="cyan">Create Tournament</Button>
          </CreateTournamentDialog>
        )}
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Button variant="outline" size="sm">All</Button>
        <Button variant="ghost" size="sm">Upcoming</Button>
        <Button variant="ghost" size="sm">Live</Button>
        <Button variant="ghost" size="sm">Finished</Button>
      </div>

      {/* Tournament Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tournaments.map((tournament) => (
          <TournamentCard key={tournament.id} tournament={tournament} />
        ))}
      </div>

      {/* Empty State */}
      {tournaments.length === 0 && (
        <EmptyStateCard
          title="Nessun torneo trovato"
          description="Crea il primo torneo per far partecipare le squadre."
          action={
            isAdmin ? (
              <CreateTournamentDialog>
                <Button variant="cyan">Create Tournament</Button>
              </CreateTournamentDialog>
            ) : null
          }
        />
      )}
    </div>
  );
}
