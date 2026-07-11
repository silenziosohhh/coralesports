import Link from "next/link";
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

  return (
    <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="text-sm text-white/60">
        Pagina <span className="text-white">{page}</span> di <span className="text-white">{maxPage}</span> •{" "}
        <span className="text-white">{total}</span> teams
      </div>

      <div className="flex items-center gap-2">
        <Button asChild variant="outline" className={cn("h-10", prevDisabled && "pointer-events-none opacity-50")}>
          <Link href={hrefFor(tournamentId, view, Math.max(1, page - 1), q)}>← Prev</Link>
        </Button>
        <Button asChild variant="outline" className={cn("h-10", nextDisabled && "pointer-events-none opacity-50")}>
          <Link href={hrefFor(tournamentId, view, Math.min(maxPage, page + 1), q)}>Next →</Link>
        </Button>
      </div>
    </div>
  );
}
