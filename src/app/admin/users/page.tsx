import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Shield, Ban, UserCheck, Search } from "lucide-react";
import Link from "next/link";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";

  if (!isAdmin) {
    redirect("/profile");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          teamMembers: true,
          createdTeams: true,
          createdTournaments: true,
        },
      },
    },
  });

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "ACTIVE").length,
    suspended: users.filter((u) => u.status === "SUSPENDED").length,
    banned: users.filter((u) => u.status === "BANNED").length,
  };

  return (
    <main className="admin-page-shell min-h-screen px-4 pb-32 pt-28 sm:pt-32">
      <div className="admin-page-content mx-auto w-full max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="page-title mb-2 text-4xl font-bold">Gestione Utenti</h1>
            <p className="text-gray">Visualizza e gestisci tutti gli utenti della piattaforma</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard">← Dashboard</Link>
          </Button>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card className="glass-card border-cyan/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Totale Utenti</CardTitle>
              <Users className="h-4 w-4 text-cyan" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attivi</CardTitle>
              <UserCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.active}</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-yellow-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sospesi</CardTitle>
              <Shield className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.suspended}</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-red-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bannati</CardTitle>
              <Ban className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.banned}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card border-cyan/20">
          <CardHeader>
            <CardTitle>Tutti gli Utenti</CardTitle>
            <CardDescription>Lista completa degli utenti registrati</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="border-cyan/10 bg-slate-dark/50 flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={user.image || undefined} />
                      <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white">{user.name || "Senza nome"}</p>
                        <Badge
                          variant={
                            user.role === "SUPER_ADMIN"
                              ? "destructive"
                              : user.role === "ADMIN"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {user.role}
                        </Badge>
                        <Badge
                          variant={
                            user.status === "ACTIVE"
                              ? "default"
                              : user.status === "BANNED"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {user.status}
                        </Badge>
                      </div>
                      <p className="text-gray/60 text-xs">Discord: {user.discordTag || "N/A"}</p>
                      <div className="text-gray/80 mt-1 flex gap-4 text-xs">
                        <span>ELO: {user.elo}</span>
                        <span>
                          W/L: {user.wins}/{user.losses}
                        </span>
                        <span>Teams: {user._count.teamMembers}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Modifica
                    </Button>
                    {user.status === "ACTIVE" && (
                      <Button variant="destructive" size="sm">
                        Ban
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
