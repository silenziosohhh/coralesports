import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Settings, ShoppingBag, Swords, Trophy, Users } from "lucide-react";

export default async function AdminIndexPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");

  const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";
  if (!isAdmin) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">
              Admin <span className="text-[var(--color-accent)]">Panel</span>
            </h1>
            <p className="mt-2 text-white/60">Gestione piattaforma, tornei e shop.</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard">← Dashboard</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="glass-card border-cyan/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[var(--color-accent)]" />
                <CardTitle>Utenti</CardTitle>
              </div>
              <CardDescription>Ruoli, ban, overview</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin/users">Apri</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-cyan/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-[var(--color-secondary)]" />
                <CardTitle>Tornei</CardTitle>
              </div>
              <CardDescription>Creazione e gestione</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin/tournaments">Apri</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-cyan/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Swords className="h-5 w-5 text-[var(--color-primary)]" />
                <CardTitle>Match</CardTitle>
              </div>
              <CardDescription>Schedule, risultati, dispute</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin/matches">Apri</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-cyan/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-emerald-400" />
                <CardTitle>Analytics</CardTitle>
              </div>
              <CardDescription>Statistiche piattaforma</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin/analytics">Apri</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-cyan/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[var(--color-accent)]" />
                <CardTitle>Shop</CardTitle>
              </div>
              <CardDescription>Prodotti, categorie, ordini</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin/shop">Apri</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-cyan/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-400" />
                <CardTitle>Impostazioni</CardTitle>
              </div>
              <CardDescription>Configurazioni piattaforma</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link href="/admin/settings">Apri</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

