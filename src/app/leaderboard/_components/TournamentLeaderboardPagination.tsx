import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  tournamentId: string;
  view: "teams" | "players";
  q?: string;
  page: number;
  pageSize: number;
  total: number;
};

function hrefFor(tournamentId: string, view: "teams" | "players", page: number, q?: string) {
  const params = new URLSearchParams();
  params.set("tournament", tournamentId);
  params.set("view", view);
  params.set("page", String(page));
  if (q) params.set("q", q);
  return `/leaderboard?${params.toString()}`;
}

export function TournamentLeaderboardPagination({ tournamentId, view, q, page, pageSize, total }: Props) {
  const maxPage = Math.max(1, Math.ceil(total / pageSize));
  const prevDisabled = page <= 1;
  const nextDisabled = page >= maxPage;
  const entityLabel = view === "players" ? "giocatori" : "team";

  return (
    <div className="mt-4 flex flex-col gap-4 border-t border-white/[0.07] px-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-white/[0.45]">
        Pagina <span className="font-bold text-white">{page}</span> di{" "}
        <span className="font-bold text-white">{maxPage}</span>
        <span className="px-2 text-white/20">•</span>
        <span className="font-bold text-cyan-300">{total}</span> {entityLabel}
      </div>

      <div className="flex items-center gap-2">
        <Button
          asChild
          variant="outline"
          className={cn(
            "h-9 rounded-lg border border-white/10 bg-transparent px-3 text-white/60 shadow-none hover:border-white/20 hover:bg-white/5 hover:text-white",
            prevDisabled && "pointer-events-none opacity-35",
          )}
        >
          <Link href={hrefFor(tournamentId, view, Math.max(1, page - 1), q)}>
            <ChevronLeft className="h-4 w-4" />
            Indietro
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className={cn(
            "h-9 rounded-lg border border-white/10 bg-transparent px-3 text-white/60 shadow-none hover:border-white/20 hover:bg-white/5 hover:text-white",
            nextDisabled && "pointer-events-none opacity-35",
          )}
        >
          <Link href={hrefFor(tournamentId, view, Math.min(maxPage, page + 1), q)}>
            Avanti
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
