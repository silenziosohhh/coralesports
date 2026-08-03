import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Database, Shield, Bell, Mail, Globe, Lock, Zap } from "lucide-react";
import Link from "next/link";
import { EditSettingDialog } from "@/components/admin/edit-setting-dialog";

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const isSuperAdmin = session.user.role === "SUPER_ADMIN";

  if (!isSuperAdmin) {
    redirect("/dashboard");
  }

  const settings = await prisma.platformSettings.findMany();
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  const getSetting = (key: string, defaultValue: string = "") => settingsMap[key] || defaultValue;

  return (
    <main className="admin-page-shell min-h-screen px-4 pb-32 pt-28 sm:pt-32">
      <div className="admin-page-content mx-auto w-full max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="page-title mb-2 text-4xl font-bold">Impostazioni Piattaforma</h1>
            <p className="text-gray">Configura le impostazioni globali della piattaforma</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard">← Dashboard</Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="glass-card border-cyan/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-cyan" />
                <CardTitle>Impostazioni Generali</CardTitle>
              </div>
              <CardDescription>Configurazioni base della piattaforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-cyan/10 bg-slate-dark/50 flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-semibold text-white">Nome Piattaforma</p>
                  <p className="text-sm text-gray">
                    {getSetting("platform_name", "CoralMC Tournaments")}
                  </p>
                </div>
                <EditSettingDialog
                  settingKey="platform_name"
                  settingLabel="Nome Piattaforma"
                  currentValue={getSetting("platform_name", "CoralMC Tournaments")}
                  description="Il nome della piattaforma visualizzato agli utenti"
                />
              </div>
              <div className="border-cyan/10 bg-slate-dark/50 flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-semibold text-white">Lingua Predefinita</p>
                  <p className="text-sm text-gray">
                    {getSetting("platform_language") === "it" ? "Italiano" : "English"}
                  </p>
                </div>
                <EditSettingDialog
                  settingKey="platform_language"
                  settingLabel="Lingua Predefinita"
                  currentValue={getSetting("platform_language", "it")}
                  description="Lingua predefinita della piattaforma"
                />
              </div>
              <div className="border-cyan/10 bg-slate-dark/50 flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-semibold text-white">Fuso Orario</p>
                  <p className="text-sm text-gray">
                    {getSetting("platform_timezone", "Europe/Rome")} (UTC+2)
                  </p>
                </div>
                <EditSettingDialog
                  settingKey="platform_timezone"
                  settingLabel="Fuso Orario"
                  currentValue={getSetting("platform_timezone", "Europe/Rome")}
                  description="Fuso orario della piattaforma"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-cyan/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-500" />
                <CardTitle>Database</CardTitle>
              </div>
              <CardDescription>Gestione e manutenzione database</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-cyan/10 bg-slate-dark/50 flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-semibold text-white">Backup Automatico</p>
                  <p className="text-sm text-gray">Ogni giorno alle 03:00</p>
                </div>
                <EditSettingDialog
                  settingKey="auto_backup_enabled"
                  settingLabel="Backup Automatico"
                  currentValue={getSetting("auto_backup_enabled", "true")}
                  description="Abilita o disabilita il backup automatico giornaliero"
                  type="boolean"
                />
              </div>
              <div className="border-cyan/10 bg-slate-dark/50 flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-semibold text-white">Ultimo Backup</p>
                  <p className="text-sm text-gray">20 Maggio 2026, 03:00</p>
                </div>
                <Button variant="outline" size="sm">
                  Visualizza
                </Button>
              </div>
              <div className="border-cyan/10 bg-slate-dark/50 flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-semibold text-white">Ottimizzazione DB</p>
                  <p className="text-sm text-gray">Migliora le performance</p>
                </div>
                <Button variant="cyan" size="sm">
                  Esegui
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-cyan/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                <CardTitle>Sicurezza</CardTitle>
              </div>
              <CardDescription>Impostazioni di sicurezza e autenticazione</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-cyan/10 bg-slate-dark/50 flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-semibold text-white">Autenticazione Discord</p>
                  <p className="text-sm text-gray">OAuth2 configurato</p>
                </div>
                <EditSettingDialog
                  settingKey="discord_auth_enabled"
                  settingLabel="Autenticazione Discord"
                  currentValue={getSetting("discord_auth_enabled", "true")}
                  description="Abilita o disabilita l'autenticazione tramite Discord"
                  type="boolean"
                />
              </div>
              <div className="border-cyan/10 bg-slate-dark/50 flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-semibold text-white">Rate Limiting</p>
                  <p className="text-sm text-gray">
                    {getSetting("rate_limit_requests", "100")} richieste/minuto
                  </p>
                </div>
                <EditSettingDialog
                  settingKey="rate_limit_requests"
                  settingLabel="Rate Limiting"
                  currentValue={getSetting("rate_limit_requests", "100")}
                  description="Numero massimo di richieste al minuto"
                  type="number"
                />
              </div>
              <div className="border-cyan/10 bg-slate-dark/50 flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-semibold text-white">IP Whitelist</p>
                  <p className="text-sm text-gray">
                    {getSetting("ip_whitelist", "Nessuna restrizione")}
                  </p>
                </div>
                <EditSettingDialog
                  settingKey="ip_whitelist"
                  settingLabel="IP Whitelist"
                  currentValue={getSetting("ip_whitelist", "")}
                  description="Lista di IP autorizzati (separati da virgola)"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-cyan/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-yellow-500" />
                <CardTitle>Notifiche</CardTitle>
              </div>
              <CardDescription>Configurazione sistema notifiche</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-cyan/10 bg-slate-dark/50 flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-semibold text-white">Notifiche Email</p>
                  <p className="text-sm text-gray">Invio email automatiche</p>
                </div>
                <EditSettingDialog
                  settingKey="email_notifications_enabled"
                  settingLabel="Notifiche Email"
                  currentValue={getSetting("email_notifications_enabled", "true")}
                  description="Abilita o disabilita le notifiche via email"
                  type="boolean"
                />
              </div>
              <div className="border-cyan/10 bg-slate-dark/50 flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-semibold text-white">Notifiche Discord</p>
                  <p className="text-sm text-gray">Webhook configurato</p>
                </div>
                <EditSettingDialog
                  settingKey="discord_notifications_enabled"
                  settingLabel="Notifiche Discord"
                  currentValue={getSetting("discord_notifications_enabled", "true")}
                  description="Abilita o disabilita le notifiche Discord"
                  type="boolean"
                />
              </div>
              <div className="border-cyan/10 bg-slate-dark/50 flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-semibold text-white">Notifiche Push</p>
                  <p className="text-sm text-gray">Browser notifications</p>
                </div>
                <EditSettingDialog
                  settingKey="push_notifications_enabled"
                  settingLabel="Notifiche Push"
                  currentValue={getSetting("push_notifications_enabled", "false")}
                  description="Abilita o disabilita le notifiche push del browser"
                  type="boolean"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-cyan/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-cyan" />
                <CardTitle>Tornei</CardTitle>
              </div>
              <CardDescription>Configurazioni tornei e competizioni</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-cyan/10 bg-slate-dark/50 flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-semibold text-white">ELO Iniziale</p>
                  <p className="text-sm text-gray">Punteggio di partenza</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">
                    {getSetting("default_elo", "1000")}
                  </span>
                  <EditSettingDialog
                    settingKey="default_elo"
                    settingLabel="ELO Iniziale"
                    currentValue={getSetting("default_elo", "1000")}
                    description="Punteggio ELO di partenza per i nuovi team"
                    type="number"
                  />
                </div>
              </div>
              <div className="border-cyan/10 bg-slate-dark/50 flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-semibold text-white">Max Teams per Torneo</p>
                  <p className="text-sm text-gray">Limite massimo</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">
                    {getSetting("max_teams_per_tournament", "64")}
                  </span>
                  <EditSettingDialog
                    settingKey="max_teams_per_tournament"
                    settingLabel="Max Teams per Torneo"
                    currentValue={getSetting("max_teams_per_tournament", "64")}
                    description="Numero massimo di team per torneo"
                    type="number"
                  />
                </div>
              </div>
              <div className="border-cyan/10 bg-slate-dark/50 flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-semibold text-white">Registrazione Automatica</p>
                  <p className="text-sm text-gray">Approvazione team</p>
                </div>
                <EditSettingDialog
                  settingKey="auto_registration"
                  settingLabel="Registrazione Automatica"
                  currentValue={getSetting("auto_registration", "true")}
                  description="Approva automaticamente i nuovi team senza revisione manuale"
                  type="boolean"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-cyan/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                <CardTitle>API & Integrazioni</CardTitle>
              </div>
              <CardDescription>Gestione API e servizi esterni</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-cyan/10 bg-slate-dark/50 flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-semibold text-white">API Pubblica</p>
                  <p className="text-sm text-gray">Accesso dati pubblici</p>
                </div>
                <EditSettingDialog
                  settingKey="public_api_enabled"
                  settingLabel="API Pubblica"
                  currentValue={getSetting("public_api_enabled", "true")}
                  description="Abilita o disabilita l'accesso pubblico alle API"
                  type="boolean"
                />
              </div>
              <div className="border-cyan/10 bg-slate-dark/50 flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-semibold text-white">Webhook Discord</p>
                  <p className="text-sm text-gray">
                    {getSetting("discord_webhook_url") ? "Configurato" : "Non configurato"}
                  </p>
                </div>
                <EditSettingDialog
                  settingKey="discord_webhook_url"
                  settingLabel="Webhook Discord"
                  currentValue={getSetting("discord_webhook_url", "")}
                  description="URL del webhook Discord per eventi e notifiche"
                />
              </div>
              <div className="border-cyan/10 bg-slate-dark/50 flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-semibold text-white">API Keys</p>
                  <p className="text-sm text-gray">Chiave di accesso API</p>
                </div>
                <EditSettingDialog
                  settingKey="api_key"
                  settingLabel="API Key"
                  currentValue={getSetting("api_key", "")}
                  description="Chiave API per accesso ai servizi esterni"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card mt-8 border-red-500/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-red-500" />
              <CardTitle className="text-red-500">Zona Pericolosa</CardTitle>
            </div>
            <CardDescription>Azioni irreversibili - procedere con cautela</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/5 p-4">
              <div>
                <p className="font-semibold text-white">Reset Database</p>
                <p className="text-sm text-gray">Elimina tutti i dati (irreversibile)</p>
              </div>
              <Button variant="destructive" size="sm">
                Reset
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/5 p-4">
              <div>
                <p className="font-semibold text-white">Modalità Manutenzione</p>
                <p className="text-sm text-gray">Disabilita accesso utenti</p>
              </div>
              <Button variant="outline" size="sm">
                Attiva
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
