import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Calendar, Plus } from "lucide-react";
import Link from "next/link";
import { TournamentsClient } from "./tournaments-client";

export default async function AdminTournamentsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";

  if (!isAdmin) {
    redirect("/profile");
  }

  const tournaments = await prisma.tournament.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      createdBy: {
        select: {
          name: true,
          discordTag: true,
        },
      },
      _count: {
        select: {
          teams: true,
          matches: true,
        },
      },
    },
  });

  const stats = {
    total: tournaments.length,
    draft: tournaments.filter((t) => t.status === "DRAFT").length,
    upcoming: tournaments.filter((t) => t.status === "UPCOMING").length,
    live: tournaments.filter((t) => t.status === "LIVE").length,
    finished: tournaments.filter((t) => t.status === "FINISHED").length,
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="page-title mb-2 text-4xl font-bold">Gestione Tornei</h1>
            <p className="text-gray">Visualizza e gestisci tutti i tornei della piattaforma</p>
          </div>
          <div className="flex gap-2">
            <Button variant="cyan" asChild>
              <Link href="/tournaments/create">
                <Plus className="mr-2 h-4 w-4" />
                Nuovo Torneo
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">← Dashboard</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-5">
          <Card className="glass-card border-cyan/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Totale</CardTitle>
              <Trophy className="h-4 w-4 text-cyan" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-gray-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bozze</CardTitle>
              <Calendar className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.draft}</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Arrivo</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.upcoming}</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-cyan/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Live</CardTitle>
              <Trophy className="h-4 w-4 text-cyan" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.live}</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conclusi</CardTitle>
              <Trophy className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.finished}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tournaments List */}
        <Card className="glass-card border-cyan/20">
          <CardHeader>
            <CardTitle>Tutti i Tornei</CardTitle>
            <CardDescription>Lista completa dei tornei creati</CardDescription>
          </CardHeader>
          <CardContent>
            {tournaments.length === 0 ? (
              <div className="py-12 text-center">
                <Trophy className="mx-auto h-12 w-12 text-gray/50" />
                <p className="mt-4 text-gray">Nessun torneo creato</p>
                <Button variant="cyan" className="mt-4" asChild>
                  <Link href="/tournaments/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Crea il primo torneo
                  </Link>
                </Button>
              </div>
            ) : (
              <TournamentsClient tournaments={tournaments} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
