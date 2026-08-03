"use client";

import { TournamentSelectDropdown, type TournamentSelectOption } from "@/components/tournaments/tournament-select-dropdown";

export type TournamentLeaderboardOption = {
  id: string;
  slug: string;
  name: string;
  startDate: string | Date;
  status: string;
  teamMode: "SOLO" | "DUO" | "TRIO";
};

export function TournamentLeaderboardFilter({
  tournaments,
  selectedTournamentId,
}: {
  tournaments: TournamentLeaderboardOption[];
  selectedTournamentId: string;
}) {
  const options: TournamentSelectOption[] = tournaments;
  return (
    <TournamentSelectDropdown
      basePath="/leaderboard"
      tournaments={options}
      selectedTournamentId={selectedTournamentId}
      clearParams={["page"]}
      paramKey="tournament"
      triggerClassName="h-11 rounded-lg border border-white/15 bg-[#061525]/60 px-4 shadow-none hover:bg-white/[0.04]"
    />
  );
}
