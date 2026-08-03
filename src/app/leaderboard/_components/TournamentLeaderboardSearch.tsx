import { RotateCcw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  tournamentId: string;
  view: "teams" | "players";
  q?: string;
};

export function TournamentLeaderboardSearch({ tournamentId, view, q }: Props) {
  return (
    <form className="flex min-w-0 flex-1 items-center gap-2" action="/leaderboard" method="get">
      <input type="hidden" name="tournament" value={tournamentId} />
      <input type="hidden" name="view" value={view} />

      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-white/[0.35]" />
        <Input
          name="q"
          defaultValue={q}
          placeholder={view === "players" ? "Cerca giocatore" : "Cerca team"}
          className="h-11 rounded-xl border-white/10 bg-[#020c17]/70 pr-3 pl-10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] placeholder:text-white/30 focus-visible:border-[#009dff]/50 focus-visible:ring-[#009dff]/20"
        />
      </div>

      <Button
        type="submit"
        variant="cyan"
        className="h-11 rounded-xl border border-cyan-200/20 bg-[linear-gradient(135deg,#008ff0,#20bfff)] px-5 shadow-[0_8px_24px_rgba(0,157,255,0.18)] hover:brightness-110"
      >
        Cerca
      </Button>
      <Button
        type="submit"
        name="q"
        value=""
        variant="ghost"
        aria-label="Azzera ricerca"
        className="h-11 w-11 rounded-xl border border-white/10 bg-[#020c17]/50 p-0 text-white/50 shadow-none hover:border-white/20 hover:bg-white/5 hover:text-white"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </form>
  );
}
