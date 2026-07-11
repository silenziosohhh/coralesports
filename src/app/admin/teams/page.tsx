import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { TeamsClient } from "./teams-client";

export default async function AdminTeamsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";

  if (!isAdmin) {
    redirect("/profile");
  }

  const teams = await prisma.team.findMany({
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
          members: true,
          tournamentTeams: true,
        },
      },
    },
  });

  const stats = {
    total: teams.length,
    public: teams.filter((t) => t.visibility === "PUBLIC").length,
    private: teams.filter((t) => t.visibility === "PRIVATE").length,
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="page-title mb-2 text-4xl font-bold">Gestione Teams</h1>
            <p className="text-gray">Visualizza e gestisci tutti i team della piattaforma</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard">← Dashboard</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="glass-card border-cyan/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Totale Teams</CardTitle>
              <Users className="h-4 w-4 text-cyan" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pubblici</CardTitle>
              <Eye className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.public}</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Privati</CardTitle>
              <EyeOff className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.private}</div>
            </CardContent>
          </Card>
        </div>

        {/* Teams List */}
        <Card className="glass-card border-cyan/20">
          <CardHeader>
            <CardTitle>Tutti i Teams</CardTitle>
            <CardDescription>Lista completa dei team registrati</CardDescription>
          </CardHeader>
          <CardContent>
            {teams.length === 0 ? (
              <div className="py-12 text-center">
                <Users className="mx-auto h-12 w-12 text-gray/50" />
                <p className="mt-4 text-gray">Nessun team registrato</p>
              </div>
            ) : (
              <TeamsClient teams={teams} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
