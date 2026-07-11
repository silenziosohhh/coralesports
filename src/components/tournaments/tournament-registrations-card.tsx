import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

type TeamEntry = {
  id: string;
  team: {
    id: string;
    name: string;
    tag: string;
    logo: string | null;
  };
};

type Props = {
  name: string;
  bannerUrl: string;
  teamCount: number;
  maxTeams: number;
  teams: TeamEntry[];
  onTeamClick: (teamId: string) => void;
};

export function TournamentRegistrationsCard({
  name,
  bannerUrl,
  teamCount,
  maxTeams,
  teams,
  onTeamClick,
}: Props) {
  return (
    <Card className="glass-card overflow-hidden border-cyan/20">
      <div className="relative h-64 w-full">
        <Image
          src={bannerUrl}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-5xl font-bold text-white">{name}</h1>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Iscrizioni</h2>
          <div className="text-sm text-gray">
            <span className="font-semibold text-white">{teamCount}</span>/{maxTeams > 0 ? maxTeams : "∞"} Teams
          </div>
        </div>

        {teams.length === 0 ? (
          <p className="py-8 text-center text-gray/80">No teams registered yet</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {teams.map((teamEntry) => (
              <button
                key={teamEntry.id}
                type="button"
                className="flex items-center gap-3 rounded-lg border border-cyan/10 bg-slate-dark/50 p-3 text-left transition-colors hover:border-cyan/30"
                onClick={() => onTeamClick(teamEntry.team.id)}
              >
                <div className="h-10 w-10 overflow-hidden rounded-lg border border-white/10 bg-black/20">
                  {teamEntry.team.logo ? (
                    <img
                      src={teamEntry.team.logo}
                      alt={teamEntry.team.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white/90">
                      {teamEntry.team.tag}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">{teamEntry.team.name}</p>
                  <p className="text-xs text-gray">{teamEntry.team.tag}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
