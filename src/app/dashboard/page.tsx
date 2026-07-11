import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Calendar, ShoppingBag, Shield, Settings } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  // Check if user has admin privileges
  const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";

  if (!isAdmin) {
    redirect("/profile");
  }

  // Fetch real statistics
  const [totalUsers, activeTournaments, totalTeams, todayMatches] = await Promise.all([
    prisma.user.count(),
    prisma.tournament.count({ where: { status: "LIVE" } }),
    prisma.team.count(),
    prisma.match.count({
      where: {
        scheduledAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    }),
  ]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="page-title mb-2 text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-gray">
            Manage tournaments, users, and platform settings
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-card border-cyan/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-cyan" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalUsers}</div>
              <p className="text-xs text-gray">Registered players</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-cyan/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tournaments</CardTitle>
              <Trophy className="h-4 w-4 text-cyan" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{activeTournaments}</div>
              <p className="text-xs text-gray">Currently running</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-cyan/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
              <Users className="h-4 w-4 text-cyan" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalTeams}</div>
              <p className="text-xs text-gray">Registered teams</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-cyan/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Matches Today</CardTitle>
              <Calendar className="h-4 w-4 text-cyan" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{todayMatches}</div>
              <p className="text-xs text-gray">Scheduled matches</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-white">Admin Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="glass-card border-cyan/20">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-cyan" />
                  <CardTitle>Manage Tournaments</CardTitle>
                </div>
                <CardDescription>Create and manage tournaments</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="cyan" className="w-full" asChild>
                  <Link href="/admin/tournaments">Manage</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-cyan/20">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-cyan" />
                  <CardTitle>Manage Teams</CardTitle>
                </div>
                <CardDescription>Oversee team registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/teams">Manage</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-cyan/20">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-cyan" />
                  <CardTitle>Manage Users</CardTitle>
                </div>
                <CardDescription>View and moderate users</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/users">Manage</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-cyan/20">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="h-5 w-5 text-cyan" />
                  <CardTitle>Manage Store</CardTitle>
                </div>
                <CardDescription>Gestisci prodotti e ordini dello store</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/store">Manage Store</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-cyan/20">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-cyan" />
                  <CardTitle>Match Schedule</CardTitle>
                </div>
                <CardDescription>View and edit match schedules</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/matches">View Schedule</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card border-cyan/20">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-cyan" />
                  <CardTitle>Platform Settings</CardTitle>
                </div>
                <CardDescription>Configure platform settings</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/settings">Settings</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="mb-4 text-2xl font-bold text-white">Recent Activity</h2>
          <Card className="glass-card border-cyan/20">
            <CardContent className="flex min-h-[200px] items-center justify-center pt-6">
              <div className="text-center">
                <Calendar className="h-12 w-12 text-gray mx-auto mb-3" />
                <p className="text-gray">No recent activity</p>
                <p className="mt-2 text-sm text-gray/60">
                  Admin actions will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
