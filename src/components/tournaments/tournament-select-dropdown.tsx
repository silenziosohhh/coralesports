"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type TournamentSelectOption = {
  id: string;
  name: string;
  startDate: string | Date;
  status: string;
  teamMode: "SOLO" | "DUO" | "TRIO";
};

export function TournamentSelectDropdown({
  basePath,
  tournaments,
  selectedTournamentId,
  clearParams = [],
  allowClear = false,
  paramKey = "tournament",
}: {
  basePath: string;
  tournaments: TournamentSelectOption[];
  selectedTournamentId: string;
  clearParams?: string[];
  allowClear?: boolean;
  paramKey?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selected = useMemo(
    () => tournaments.find((t) => t.id === selectedTournamentId) ?? null,
    [selectedTournamentId, tournaments]
  );

  const label = selected
    ? `${selected.name} • ${selected.teamMode} • ${new Date(selected.startDate).toLocaleDateString("it-IT")}`
    : "Seleziona torneo";

  const setTournament = (tournamentId: string) => {
    const next = new URLSearchParams(searchParams?.toString());
    for (const key of clearParams) next.delete(key);

    if (!tournamentId) next.delete(paramKey);
    else next.set(paramKey, tournamentId);

    const qs = next.toString();
    router.push(`${basePath}${qs ? `?${qs}` : ""}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="truncate">{label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[min(680px,calc(100vw-2rem))] max-h-[420px] overflow-y-auto">
        <DropdownMenuLabel>Seleziona torneo</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {allowClear ? (
          <>
            <DropdownMenuItem onClick={() => setTournament("")}>Tutti / nessuno</DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        ) : null}
        {tournaments.map((t) => (
          <DropdownMenuItem key={t.id} onClick={() => setTournament(t.id)}>
            <span className="truncate">
              {t.name} • {t.teamMode} • {new Date(t.startDate).toLocaleDateString("it-IT")}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
