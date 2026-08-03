import Image from "next/image";
import { ArrowUpRight, UsersRound } from "lucide-react";

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
    <article className="group overflow-hidden rounded-[28px] border-2 border-white/15 bg-[#061b3b]/85 shadow-[0_30px_90px_rgba(0,7,24,0.48)] backdrop-blur-2xl">
      <div className="relative h-64 w-full overflow-hidden sm:h-72">
        <Image
          src={bannerUrl}
          alt={name}
          fill
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001126] via-[#001126]/48 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-[#57ffff]">
            Arena iscrizioni
          </p>
          <h2 className="max-w-[900px] text-3xl font-black tracking-[-0.035em] text-white sm:text-5xl">
            {name}
          </h2>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-lg font-bold text-white">
            <UsersRound className="h-5 w-5 text-[#57ffff]" aria-hidden="true" />
            Iscrizioni
          </h3>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/65">
            <span className="font-semibold text-white">{teamCount}</span>/
            {maxTeams > 0 ? maxTeams : "∞"} Teams
          </div>
        </div>

        {teams.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/15 bg-white/[0.025] py-10 text-center text-white/55">
            No teams registered yet
          </p>
        ) : (
          <div className="grid grid-flow-dense gap-3 md:grid-cols-2">
            {teams.map((teamEntry) => (
              <button
                key={teamEntry.id}
                type="button"
                className="group/team flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[#57ffff]/35 hover:bg-[#009dff]/10"
                onClick={() => onTeamClick(teamEntry.team.id)}
              >
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/20">
                  {teamEntry.team.logo ? (
                    <Image
                      src={teamEntry.team.logo}
                      alt={teamEntry.team.name}
                      fill
                      unoptimized
                      sizes="44px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white/90">
                      {teamEntry.team.tag}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">{teamEntry.team.name}</p>
                  <p className="text-xs text-white/55">{teamEntry.team.tag}</p>
                </div>
                <ArrowUpRight
                  className="h-4 w-4 shrink-0 text-white/35 transition group-hover/team:text-[#57ffff]"
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
