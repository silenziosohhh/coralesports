import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Trophy, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { it } from "date-fns/locale";

export default async function AdminMatchesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";

  if (!isAdmin) {
    redirect("/profile");
  }

  const matches = await prisma.match.findMany({
    orderBy: { scheduledAt: "desc" },
    include: {
      tournament: {
        select: {
          name: true,
          slug: true,
        },
      },
      team1: {
        select: {
          name: true,
          tag: true,
        },
      },
      round: {
        select: {
          name: true,
          roundNumber: true,
        },
      },
    },
  });

  const stats = {
    total: matches.length,
    scheduled: matches.filter((m) => m.status === "SCHEDULED").length,
    live: matches.filter((m) => m.status === "LIVE").length,
    completed: matches.filter((m) => m.status === "COMPLETED").length,
    disputed: matches.filter((m) => m.status === "DISPUTED").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "default";
      case "LIVE":
        return "destructive";
      case "COMPLETED":
        return "outline";
      case "DISPUTED":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <main className="admin-page-shell min-h-screen px-4 pb-32 pt-28 sm:pt-32">
      <div className="admin-page-content mx-auto w-full max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="page-title mb-2 text-4xl font-bold">Calendario Partite</h1>
            <p className="text-gray">Visualizza e gestisci tutte le partite programmate</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard">← Dashboard</Link>
          </Button>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-5">
          <Card className="glass-card border-cyan/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Totale</CardTitle>
              <Calendar className="h-4 w-4 text-cyan" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Programmate</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.scheduled}</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-red-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Live</CardTitle>
              <Trophy className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.live}</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.completed}</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-yellow-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contestate</CardTitle>
              <XCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.disputed}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card border-cyan/20">
          <CardHeader>
            <CardTitle>Tutte le Partite</CardTitle>
            <CardDescription>Lista completa delle partite programmate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="border-cyan/10 bg-slate-dark/50 flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="outline">{match.tournament.name}</Badge>
                      {match.round && <Badge variant="secondary">{match.round.name}</Badge>}
                      <Badge variant={getStatusColor(match.status)}>{match.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 text-right">
                        <p className="font-semibold text-white">{match.team1.name}</p>
                        <p className="text-xs text-gray">[{match.team1.tag}]</p>
                      </div>
                      <div className="flex items-center gap-2 px-4">
                        <div className="text-center">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-white">
                              {match.team1Score}
                            </span>
                            <span className="text-gray">-</span>
                            <span className="text-2xl font-bold text-white">
                              {match.team2Score}
                            </span>
                          </div>
                          {match.scheduledAt && (
                            <p className="mt-1 text-xs text-gray">
                              {format(new Date(match.scheduledAt), "dd MMM HH:mm", { locale: it })}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white">{match.team2Id ? "TBD" : "TBD"}</p>
                        <p className="text-xs text-gray">-</p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex gap-2">
                    <Button variant="outline" size="sm">
                      Modifica
                    </Button>
                    {match.status === "DISPUTED" && (
                      <Button variant="cyan" size="sm">
                        Risolvi
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {matches.length === 0 && (
                <div className="py-12 text-center">
                  <Calendar className="text-gray/50 mx-auto h-12 w-12" />
                  <p className="mt-4 text-gray">Nessuna partita programmata</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
