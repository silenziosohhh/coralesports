"use client";

import { TournamentSelectDropdown } from "@/components/tournaments/tournament-select-dropdown";

type TournamentOption = {
  id: string;
  name: string;
  startDate: string | Date;
  status: string;
  teamMode: "SOLO" | "DUO" | "TRIO";
};

export function TournamentRosterFilter({
  tournaments,
  selectedTournamentId,
}: {
  tournaments: TournamentOption[];
  selectedTournamentId: string;
}) {
  return (
    <TournamentSelectDropdown
      basePath="/teams"
      tournaments={tournaments}
      selectedTournamentId={selectedTournamentId}
      paramKey="tournament"
    />
  );
}
