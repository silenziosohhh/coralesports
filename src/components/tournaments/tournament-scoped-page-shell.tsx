import type { ReactNode } from "react";
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
    <main className="admin-page-shell min-h-screen px-4 pb-28 pt-28 sm:pt-32">
      <div className="admin-page-content mx-auto w-full max-w-7xl">
        <header className="mb-10 max-w-3xl">
          <h1 className="page-title mb-3 text-4xl sm:text-5xl">{title}</h1>
          <p className="text-base leading-7 text-white/60">{description}</p>
        </header>

        {!hasTournaments ? (
          <EmptyStateCard
            title={noTournamentsTitle}
            description={noTournamentsDescription}
            action={noTournamentsAction}
          />
        ) : (
          <>
            <section className="glass-card mb-6 p-6 sm:p-7">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-white">Filtro torneo</h2>
                <p className="mt-1 text-sm text-white/55">Scegli quale torneo visualizzare.</p>
              </div>
              <div className="max-w-[680px]">
                <label className="mb-2 block text-sm font-bold text-white">Torneo</label>
                {filter}
              </div>
            </section>

            {!hasSelection ? (
              <section className="glass-card flex min-h-[280px] flex-col items-center justify-center p-6 text-center">
                {emptyIcon}
                <h3 className="mb-2 text-xl font-semibold">Nessun torneo selezionato</h3>
                <p className="text-white/55">Seleziona un torneo dal menu a tendina.</p>
              </section>
            ) : (
              <div className="space-y-6">{children}</div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
