import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { TournamentLeaderboardRow } from "../lib/tournament-leaderboard";

type Props = {
  rows: TournamentLeaderboardRow[];
  rankOffset: number;
};

export function TournamentLeaderboardTable({ rows, rankOffset }: Props) {
  return (
    <div className="space-y-3">
      {rows.length === 0 ? <p className="text-sm text-muted-foreground">Nessun risultato.</p> : null}

      {rows.map((row, index) => {
        const rank = rankOffset + index + 1;
        return (
          <div key={row.teamId} className="rounded-lg border border-white/10 bg-black/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-semibold text-white">
                #{rank} {row.teamName} ({row.teamTag})
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge>P{row.points}</Badge>
                <Badge variant="secondary">
                  {row.wins}-{row.draws}-{row.losses}
                </Badge>
                <Badge variant="outline">
                  {row.scoreFor}:{row.scoreAgainst} ({row.scoreDiff >= 0 ? "+" : ""}
                  {row.scoreDiff})
                </Badge>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {row.teamLogo ? (
                <Image src={row.teamLogo} alt={row.teamName} width={28} height={28} className="h-7 w-7 rounded-md object-cover" />
              ) : null}
              <span>Seed: {row.seed ?? "-"}</span>
              <span>•</span>
              <span>Elo: {row.teamElo}</span>
              <span>•</span>
              <span>Giocate: {row.played}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
