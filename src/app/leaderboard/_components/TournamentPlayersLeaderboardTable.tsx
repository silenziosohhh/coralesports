import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { TournamentPlayerLeaderboardRow } from "../lib/tournament-leaderboard";

type Props = {
  rows: TournamentPlayerLeaderboardRow[];
  rankOffset: number;
};

function labelPlayer(p: TournamentPlayerLeaderboardRow) {
  return p.minecraftUsername || p.discordTag || p.name || p.id;
}

export function TournamentPlayersLeaderboardTable({ rows, rankOffset }: Props) {
  return (
    <div className="space-y-3">
      {rows.length === 0 ? <p className="text-sm text-muted-foreground">Nessun risultato.</p> : null}

      {rows.map((p, index) => {
        const rank = rankOffset + index + 1;
        return (
          <div key={p.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="text-sm font-semibold text-white">#{rank}</div>
                {p.image ? (
                  <Image src={p.image} alt={labelPlayer(p)} width={28} height={28} className="h-7 w-7 rounded-full" />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-white/10" />
                )}
                <div className="text-sm font-semibold text-white">{labelPlayer(p)}</div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge>ELO {p.elo}</Badge>
                <Badge variant="secondary">
                  W/L {p.wins}/{p.losses}
                </Badge>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

