"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { EditTournamentDialog } from "@/components/admin/edit-tournament-dialog";
import { DeleteTournamentDialog } from "@/components/admin/delete-tournament-dialog";
import { FinishTournamentDialog } from "@/components/admin/finish-tournament-dialog";

interface Tournament {
  id: string;
  name: string;
  description: string | null;
  format: string;
  teamMode: string;
  playersPerTeam: number;
  maxTeams: number;
  prizePool: string | null;
  startDate: Date;
  endDate: Date | null;
  status: string;
  rules: string | null;
  createdBy: {
    name: string | null;
    discordTag: string | null;
  };
  _count: {
    teams: number;
    matches: number;
  };
}

interface TournamentsClientProps {
  tournaments: Tournament[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "DRAFT":
      return "secondary";
    case "UPCOMING":
    case "REGISTRATION_OPEN":
      return "default";
    case "LIVE":
      return "default";
    case "FINISHED":
      return "outline";
    case "CANCELLED":
      return "destructive";
    default:
      return "secondary";
  }
};

export function TournamentsClient({ tournaments }: TournamentsClientProps) {
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [deletingTournament, setDeletingTournament] = useState<{ id: string; name: string } | null>(null);
  const [finishingTournament, setFinishingTournament] = useState<{ id: string; name: string } | null>(null);

  return (
    <>
      <div className="space-y-4">
        {tournaments.map((tournament) => (
          <div
            key={tournament.id}
            className="flex items-center justify-between rounded-lg border border-cyan/10 bg-slate-dark/50 p-4"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan/10">
                <Trophy className="h-6 w-6 text-cyan" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-white">{tournament.name}</p>
                  <Badge variant={getStatusColor(tournament.status)}>
                    {tournament.status}
                  </Badge>
                  <Badge variant="outline">{tournament.format}</Badge>
                  <Badge variant="secondary">{tournament.teamMode}</Badge>
                </div>
                <p className="text-sm text-gray">
                  Creato da: {tournament.createdBy.discordTag || tournament.createdBy.name}
                </p>
                <div className="mt-1 flex gap-4 text-xs text-gray/80">
                  <span>
                    Inizio: {format(new Date(tournament.startDate), "dd MMM yyyy", { locale: it })}
                  </span>
                  <span>Teams: {tournament._count.teams}/{tournament.maxTeams > 0 ? tournament.maxTeams : "∞"}</span>
                  <span>Player/Team: {tournament.playersPerTeam}</span>
                  <span>Partite: {tournament._count.matches}</span>
                  {tournament.prizePool && <span>Prize: {tournament.prizePool}</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/tournaments/${tournament.id}`}>Visualizza</Link>
              </Button>
              {tournament.status !== "FINISHED" && tournament.status !== "CANCELLED" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFinishingTournament({ id: tournament.id, name: tournament.name })}
                >
                  Termina evento
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setEditingTournament(tournament)}
              >
                Modifica
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => setDeletingTournament({ id: tournament.id, name: tournament.name })}
              >
                Elimina
              </Button>
            </div>
          </div>
        ))}
      </div>

      {editingTournament && (
        <EditTournamentDialog
          tournament={editingTournament}
          open={!!editingTournament}
          onOpenChange={(open) => !open && setEditingTournament(null)}
        />
      )}

      {deletingTournament && (
        <DeleteTournamentDialog
          tournamentId={deletingTournament.id}
          tournamentName={deletingTournament.name}
          open={!!deletingTournament}
          onOpenChange={(open) => !open && setDeletingTournament(null)}
        />
      )}

      {finishingTournament && (
        <FinishTournamentDialog
          tournamentId={finishingTournament.id}
          tournamentName={finishingTournament.name}
          open={!!finishingTournament}
          onOpenChange={(open) => !open && setFinishingTournament(null)}
        />
      )}
    </>
  );
}
