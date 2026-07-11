"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import Link from "next/link";
import { EditTeamDialog } from "@/components/admin/edit-team-dialog";
import { DeleteTeamDialog } from "@/components/admin/delete-team-dialog";

interface Team {
  id: string;
  name: string;
  tag: string;
  description: string | null;
  logo: string | null;
  createdBy: {
    name: string | null;
    discordTag: string | null;
  };
  _count: {
    members: number;
    tournamentTeams: number;
  };
}

interface TeamsClientProps {
  teams: Team[];
}

export function TeamsClient({ teams }: TeamsClientProps) {
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [deletingTeam, setDeletingTeam] = useState<{ id: string; name: string } | null>(null);

  return (
    <>
      <div className="space-y-4">
        {teams.map((team) => (
          <div
            key={team.id}
            className="flex items-center justify-between rounded-lg border border-cyan/10 bg-slate-dark/50 p-4"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan/10">
                {team.logo ? (
                  <img
                    src={team.logo}
                    alt={team.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                ) : (
                  <Users className="h-6 w-6 text-cyan" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-white">{team.name}</p>
                  <Badge variant="outline">{team.tag}</Badge>
                </div>
                <p className="text-sm text-gray">
                  Creato da: {team.createdBy.discordTag || team.createdBy.name}
                </p>
                <div className="mt-1 flex gap-4 text-xs text-gray/80">
                  <span>Membri: {team._count.members}</span>
                  <span>Tornei: {team._count.tournamentTeams}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/teams/${team.id}`}>Visualizza</Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setEditingTeam(team)}
              >
                Modifica
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => setDeletingTeam({ id: team.id, name: team.name })}
              >
                Elimina
              </Button>
            </div>
          </div>
        ))}
      </div>

      {editingTeam && (
        <EditTeamDialog
          team={editingTeam}
          open={!!editingTeam}
          onOpenChange={(open) => !open && setEditingTeam(null)}
        />
      )}

      {deletingTeam && (
        <DeleteTeamDialog
          teamId={deletingTeam.id}
          teamName={deletingTeam.name}
          open={!!deletingTeam}
          onOpenChange={(open) => !open && setDeletingTeam(null)}
        />
      )}
    </>
  );
}
