import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Trophy, TrendingUp, Activity, Calendar, Shield } from "lucide-react";
import Link from "next/link";

export default async function AdminAnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";

  if (!isAdmin) {
    redirect("/profile");
  }

  // Fetch analytics data
  const [
    totalUsers,
    activeUsers,
    totalTeams,
    totalTournaments,
    activeTournaments,
    totalMatches,
    completedMatches,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: "ACTIVE" } }),
    prisma.team.count(),
    prisma.tournament.count(),
    prisma.tournament.count({ where: { status: "LIVE" } }),
    prisma.match.count(),
    prisma.match.count({ where: { status: "COMPLETED" } }),
  ]);

  // Top players by ELO
  const topPlayers = await prisma.user.findMany({
    take: 10,
    orderBy: { elo: "desc" },
    select: {
      name: true,
      discordTag: true,
      elo: true,
      wins: true,
      losses: true,
    },
  });

  // Top teams by ELO
  const topTeams = await prisma.team.findMany({
    take: 10,
    orderBy: { elo: "desc" },
    select: {
      name: true,
      tag: true,
      elo: true,
      wins: true,
      losses: true,
    },
  });

  // Recent tournaments
  const recentTournaments = await prisma.tournament.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      name: true,
      status: true,
      _count: {
        select: {
          teams: true,
          matches: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="page-title mb-2 text-4xl font-bold">Analytics</h1>
            <p className="text-gray">Statistiche e insights della piattaforma</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard">← Dashboard</Link>
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card className="glass-card border-cyan/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utenti Totali</CardTitle>
              <Users className="h-4 w-4 text-cyan" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalUsers}</div>
              <p className="text-xs text-gray">
                {activeUsers} attivi ({Math.round((activeUsers / totalUsers) * 100)}%)
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Teams Totali</CardTitle>
              <Shield className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalTeams}</div>
              <p className="text-xs text-gray">Team registrati</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-yellow-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tornei</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalTournaments}</div>
              <p className="text-xs text-gray">{activeTournaments} in corso</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Partite</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalMatches}</div>
              <p className="text-xs text-gray">{completedMatches} completate</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Top Players */}
          <Card className="glass-card border-cyan/20">
            <CardHeader>
              <CardTitle>Top 10 Giocatori</CardTitle>
              <CardDescription>Classifica per ELO</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPlayers.map((player, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-cyan/10 bg-slate-dark/50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan/10 text-sm font-bold text-cyan">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {player.discordTag || player.name}
                        </p>
                        <p className="text-xs text-gray">
                          W/L: {player.wins}/{player.losses}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-cyan">{player.elo}</p>
                      <p className="text-xs text-gray">ELO</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Teams */}
          <Card className="glass-card border-cyan/20">
            <CardHeader>
              <CardTitle>Top 10 Teams</CardTitle>
              <CardDescription>Classifica per ELO</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topTeams.map((team, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-cyan/10 bg-slate-dark/50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10 text-sm font-bold text-purple-500">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {team.name} <span className="text-gray text-sm">[{team.tag}]</span>
                        </p>
                        <p className="text-xs text-gray">
                          W/L: {team.wins}/{team.losses}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-purple-500">{team.elo}</p>
                      <p className="text-xs text-gray">ELO</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tournaments */}
        <Card className="glass-card border-cyan/20 mt-8">
          <CardHeader>
            <CardTitle>Tornei Recenti</CardTitle>
            <CardDescription>Ultimi 5 tornei creati</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTournaments.map((tournament, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-cyan/10 bg-slate-dark/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-cyan" />
                    <div>
                      <p className="font-semibold text-white">{tournament.name}</p>
                      <p className="text-xs text-gray">
                        {tournament._count.teams} teams • {tournament._count.matches} partite
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray">{tournament.status}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
