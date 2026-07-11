import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  tournamentId: string;
  view: "teams" | "players";
  q?: string;
};

export function TournamentLeaderboardSearch({ tournamentId, view, q }: Props) {
  return (
    <form className="mb-6 flex flex-col gap-3 md:flex-row md:items-center" action="/leaderboard" method="get">
      <input type="hidden" name="tournament" value={tournamentId} />
      <input type="hidden" name="view" value={view} />
      <Input
        name="q"
        defaultValue={q}
        placeholder={view === "players" ? "Cerca giocatore per Discord / Minecraft / nome..." : "Cerca team per nome o tag..."}
        className="h-11 bg-white/5 text-white placeholder:text-white/40"
      />
      <div className="flex items-center gap-2">
        <Button type="submit" className="h-11 bg-[var(--color-accent)] text-black transition-opacity hover:opacity-90">
          Cerca
        </Button>
        <Button type="submit" name="q" value="" variant="outline" className="h-11">
          Reset
        </Button>
      </div>
    </form>
  );
}
