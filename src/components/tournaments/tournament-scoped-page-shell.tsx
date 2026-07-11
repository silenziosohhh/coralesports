import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyStateCard } from "@/components/ui/empty-state-card";

export function TournamentScopedPageShell({
  title,
  description,
  hasTournaments,
  filter,
  hasSelection,
  emptyIcon,
  noTournamentsTitle = "Nessun torneo trovato",
  noTournamentsDescription = "Crea il primo torneo per far partecipare le squadre.",
  noTournamentsAction,
  children,
}: {
  title: string;
  description: string;
  hasTournaments: boolean;
  filter: ReactNode;
  hasSelection: boolean;
  emptyIcon: ReactNode;
  noTournamentsTitle?: string;
  noTournamentsDescription?: string;
  noTournamentsAction?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="page-title mb-2 text-4xl font-bold">
          <span className="text-[var(--text-primary)]">{title}</span>
        </h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {!hasTournaments ? (
        <EmptyStateCard
          title={noTournamentsTitle}
          description={noTournamentsDescription}
          action={noTournamentsAction}
        />
      ) : (
        <>
          <Card className="glass-card border-cyan/20 mb-6">
            <CardHeader>
              <CardTitle>Filtro torneo</CardTitle>
              <CardDescription>Scegli quale torneo visualizzare.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-[680px]">
                <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">Torneo</label>
                {filter}
              </div>
            </CardContent>
          </Card>

          {!hasSelection ? (
            <Card className="glass-card border-white/10">
              <CardContent className="flex min-h-[280px] flex-col items-center justify-center text-center">
                {emptyIcon}
                <h3 className="mb-2 text-xl font-semibold">Nessun torneo selezionato</h3>
                <p className="text-muted-foreground">Seleziona un torneo dal menu a tendina.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">{children}</div>
          )}
        </>
      )}
    </div>
  );
}
