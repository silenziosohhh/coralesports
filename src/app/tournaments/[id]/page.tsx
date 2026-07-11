"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Users, Trophy, Target } from "lucide-react";
import { TournamentSignupDialog } from "@/components/tournaments/tournament-signup-dialog";
import { TournamentRegistrationsCard } from "@/components/tournaments/tournament-registrations-card";

interface Tournament {
  id: string;
  name: string;
  description: string | null;
  format: string;
  teamMode: "SOLO" | "DUO" | "TRIO";
  playersPerTeam: number;
  maxTeams: number;
  prizePool: string | null;
  startDate: string;
  endDate: string | null;
  registrationStart?: string | null;
  registrationEnd?: string | null;
  status: string;
  rules: string | null;
  banner: string | null;
  createdAt: string;
  _count: {
    teams: number;
  };
  teams: Array<{
    id: string;
    team: {
      id: string;
      name: string;
      tag: string;
      logo: string | null;
      _count: {
        members: number;
      };
    };
  }>;
}

export default function TournamentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";

  useEffect(() => {
    fetchTournament();
  }, [params.id]);

  const fetchTournament = async () => {
    try {
      const response = await fetch(`/api/tournaments/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setTournament(data);
      }
    } catch (error) {
      console.error("Error fetching tournament:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading tournament...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tournament not found</h1>
          <Button onClick={() => router.push("/tournaments")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tournaments
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "LIVE":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "FINISHED":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push("/tournaments")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Tournaments
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Banner + Teams */}
        <div className="lg:col-span-2 space-y-6">
          <TournamentRegistrationsCard
            name={tournament.name}
            bannerUrl={tournament.banner || "/default_tournament_banner.jpeg"}
            teamCount={tournament.teams.length}
            maxTeams={tournament.maxTeams}
            teams={tournament.teams}
            onTeamClick={(teamId) => router.push(`/teams/${teamId}`)}
          />
        </div>

        {/* Right Column - Info */}
        <div className="space-y-6">
          {/* Info Evento */}
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Trophy />
                  Info Torneo
                </CardTitle>
                <Badge className={getStatusColor(tournament.status)}>
                  {tournament.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 overflow-hidden">
              {/* Tournament Title and Description */}
              <div className="space-y-3 pb-4 border-b border-[var(--border-color)]">
                <h3 className="text-xl font-bold">1° {tournament.name}</h3>
                {tournament.description && (
                  <div className="flex items-start gap-2 text-sm min-w-0">
                    <p className="text-muted-foreground whitespace-pre-wrap break-words overflow-wrap-anywhere min-w-0">{tournament.description}</p>
                  </div>
                )}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Data
                  </span>
                  <span className="font-semibold">
                    {new Date(tournament.startDate).toLocaleDateString("it-IT")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Ora
                  </span>
                  <span className="font-semibold">
                    {new Date(tournament.startDate).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                {tournament.prizePool && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      Montepremi
                    </span>
                    <span className="font-semibold text-[var(--color-accent)]">
                      {tournament.prizePool}€
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Formato
                  </span>
                  <span className="font-semibold">{tournament.teamMode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Teams
                  </span>
                  <span className="font-semibold">{tournament.maxTeams > 0 ? tournament.maxTeams : "∞"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Player/Team
                  </span>
                  <span className="font-semibold">{tournament.playersPerTeam}</span>
                </div>
              </div>

              {/* RULESET */}
              {tournament.rules && (
                <div className="pt-4 border-t border-[var(--border-color)]">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    RULESET
                  </h4>
                  <div className="text-xs text-muted-foreground space-y-1 break-words overflow-wrap-anywhere">
                    {tournament.rules.split('\n').map((line, i) => (
                      <p key={i} className="break-words overflow-wrap-anywhere">{line || '\u00A0'}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-4">
                {session?.user?.id && (
                  <TournamentSignupDialog tournamentId={tournament.id} teamMode={tournament.teamMode}>
                    <Button variant="cyan" className="w-full">
                      Iscriviti
                    </Button>
                  </TournamentSignupDialog>
                )}
                <Button variant="outline" className="w-full">
                  Condividi
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => router.push("/tournaments")}>
                  Torna alla Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
