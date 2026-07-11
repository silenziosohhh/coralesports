"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Users, Trophy, Calendar, Crown, MoreVertical, LogOut, UserPlus, UserX } from "lucide-react";
import Link from "next/link";
import { LeaveTeamDialog } from "@/components/teams/leave-team-dialog";
import { InviteTeamDialog } from "@/components/teams/invite-team-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface TeamMember {
  id: string;
  role: string;
  user: {
    id: string;
    name: string;
    image: string | null;
    discordTag?: string | null;
    elo: number;
  };
}

interface Team {
  id: string;
  name: string;
  tag: string;
  description: string | null;
  logo: string | null;
  createdById: string;
  createdAt: string;
  members: TeamMember[];
  _count: {
    tournamentTeams: number;
  };
}

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [leaveOpen, setLeaveOpen] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, [params.id]);

  const fetchTeam = async () => {
    try {
      const response = await fetch(`/api/teams/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setTeam(data);
      }
    } catch (error) {
      console.error("Error fetching team:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
            <p className="text-[var(--text-secondary)]">Loading team...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Team not found</h1>
          <Button onClick={() => router.push("/teams")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Teams
          </Button>
        </div>
      </div>
    );
  }

  const isCaptain = team.members.some(
    (m) => m.user.id === session?.user?.id && m.role === "CAPTAIN"
  );
  const isMember = team.members.some((m) => m.user.id === session?.user?.id);
  const isOwner = team.createdById === session?.user?.id;

  const removeMember = async (userId: string) => {
    try {
      const res = await fetch(`/api/teams/${team.id}/members/${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore");
      toast.success("Membro rimosso");
      await fetchTeam();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push("/teams")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Teams
      </Button>

      {/* Team Header */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center text-4xl font-bold text-[var(--color-primary)] border border-[var(--border-color)]">
              {team.logo ? (
                <img src={team.logo} alt={team.name} className="w-full h-full object-cover rounded-lg" />
              ) : (
                team.tag
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">{team.name}</h1>
                <Badge className="bg-[var(--color-primary)] text-[var(--bg-primary)]">
                  {team.tag}
                </Badge>
              </div>
              {team.description && (
                <p className="text-[var(--text-secondary)] mb-4">{team.description}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {team.members.length} Members
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  {team._count.tournamentTeams} Tournaments
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Created {new Date(team.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            {isMember && (
              <div className="flex items-center gap-2">
                {isCaptain && (
                  <InviteTeamDialog teamId={team.id} teamName={team.name}>
                    <Button variant="cyan" className="gap-2">
                      <UserPlus className="h-4 w-4" />
                      Invita
                    </Button>
                  </InviteTeamDialog>
                )}
                <Button variant="destructive" onClick={() => setLeaveOpen(true)}>
                  {isOwner ? "Sciogli team" : "Esci"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isMember && (
        <LeaveTeamDialog
          teamId={team.id}
          teamName={team.name}
          isOwner={isOwner}
          open={leaveOpen}
          onOpenChange={setLeaveOpen}
        />
      )}

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {team.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.user.image || ""} alt={member.user.name} />
                    <AvatarFallback>{member.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{member.user.name}</p>
                      {member.role === "CAPTAIN" && (
                        <Crown className="h-4 w-4 text-yellow-400" />
                      )}
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {member.user.discordTag || member.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="border-[var(--color-primary)] text-[var(--color-primary)]">
                    {member.user.elo} ELO
                  </Badge>
                  <Badge className={member.role === "CAPTAIN" ? "bg-yellow-500" : "bg-[var(--color-secondary)]"}>
                    {member.role}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Member options">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {member.user.id === session?.user?.id ? (
                        <DropdownMenuItem
                          className="text-red-500 focus:text-red-500"
                          onSelect={(e) => {
                            e.preventDefault();
                            setLeaveOpen(true);
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          {isOwner ? "Sciogli team" : "Esci dal team"}
                        </DropdownMenuItem>
                      ) : isCaptain && member.role !== "CAPTAIN" ? (
                        <DropdownMenuItem
                          className="text-red-500 focus:text-red-500"
                          onSelect={(e) => {
                            e.preventDefault();
                            removeMember(member.user.id);
                          }}
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Rimuovi dal team
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem disabled>Nessuna azione</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
