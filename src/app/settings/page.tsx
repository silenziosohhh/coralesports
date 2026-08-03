"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CompetitionPageShell } from "@/components/competition/competition-page-shell";
import { Settings, User, Bell, Shield, Trash2, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { ReactNode } from "react";

const testNotifications = [
  { type: "TEAM_INVITATION", label: "Invito a un team", tone: "text-blue-400", icon: User },
  { type: "MATCH_SCHEDULED", label: "Match programmato", tone: "text-purple-400", icon: Bell },
  { type: "MATCH_RESULT", label: "Risultato match", tone: "text-green-400", icon: Settings },
  { type: "TOURNAMENT_UPDATE", label: "Aggiornamento torneo", tone: "text-[#57ffff]", icon: Settings },
  { type: "SYSTEM", label: "Notifica di sistema", tone: "text-[#ffd63d]", icon: Settings },
] as const;

function SettingsPanel({
  icon: PanelIcon,
  title,
  description,
  action,
  danger,
  className,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  danger?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <article
      className={`relative overflow-hidden rounded-[28px] border-2 p-6 shadow-[0_26px_70px_rgba(0,20,65,0.34)] backdrop-blur-2xl sm:p-7 ${
        danger ? "border-red-500/45 bg-[#2b0713]/62" : "border-white/20 bg-[#061b3b]/68"
      } ${className ?? ""}`}
    >
      <div
        aria-hidden
        className={`absolute -right-24 -top-24 h-56 w-56 rounded-full blur-3xl ${
          danger ? "bg-red-500/18" : "bg-[#57ffff]/16"
        }`}
      />
      <div className="relative flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.06] ${
                danger ? "text-red-400" : "text-[#57ffff]"
              }`}
            >
              <PanelIcon className="h-5 w-5" />
            </span>
            <h2
              className={`text-xl font-black tracking-[-0.02em] ${danger ? "text-red-400" : "text-white"}`}
            >
              {title}
            </h2>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-white/62">{description}</p>
        </div>
        {action}
      </div>
      <div className="relative mt-6">{children}</div>
    </article>
  );
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/14 bg-white/[0.05] px-4 py-3">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/52">{label}</p>
      <div className="mt-1 font-semibold text-white">{children}</div>
    </div>
  );
}

function ToggleRow({
  title,
  description,
  enabled,
  onToggle,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/14 bg-white/[0.05] px-4 py-3">
      <div className="min-w-0">
        <p className="font-bold text-white">{title}</p>
        <p className="text-sm text-white/58">{description}</p>
      </div>
      <Button
        variant={enabled ? "cyan" : "outline"}
        size="sm"
        onClick={onToggle}
        disabled={!onToggle}
        className="shrink-0 rounded-xl font-black disabled:opacity-100"
      >
        {enabled ? "Attivo" : "Disattivo"}
      </Button>
    </div>
  );
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [notificationPrefs, setNotificationPrefs] = useState({
    tournamentUpdates: true,
    matchReminders: true,
    teamInvitations: true,
  });
  const [minecraftUsername, setMinecraftUsername] = useState("");
  const [savingMinecraftUsername, setSavingMinecraftUsername] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/signin");
    }
  }, [status]);

  useEffect(() => {
    const saved = localStorage.getItem("notificationPrefs");
    if (saved) {
      setNotificationPrefs(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    setMinecraftUsername(session.user.minecraftUsername ?? "");
  }, [session?.user]);

  const toggleNotification = (key: keyof typeof notificationPrefs) => {
    const newPrefs = {
      ...notificationPrefs,
      [key]: !notificationPrefs[key],
    };
    setNotificationPrefs(newPrefs);
    localStorage.setItem("notificationPrefs", JSON.stringify(newPrefs));
    toast.success(`${key} ${newPrefs[key] ? "enabled" : "disabled"}`);
  };

  const createTestNotification = async (type: string) => {
    try {
      const messages = {
        TEAM_INVITATION: {
          title: "Team Invitation",
          message: "You've been invited to join Team Awesome!",
          link: "/teams",
        },
        MATCH_SCHEDULED: {
          title: "Match Scheduled",
          message: "Your match is scheduled for tomorrow at 3 PM",
          link: "/tournaments",
        },
        MATCH_RESULT: {
          title: "Match Result",
          message: "Your team won the match! +25 ELO",
          link: "/profile",
        },
        TOURNAMENT_UPDATE: {
          title: "Tournament Update",
          message: "The Spring Championship brackets are now live!",
          link: "/tournaments",
        },
        SYSTEM: {
          title: "System Notification",
          message: "Welcome to CoralMC Tournaments! Check out our latest features.",
          link: "/dashboard",
        },
      };

      const notif = messages[type as keyof typeof messages];
      
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          ...notif,
        }),
      });

      toast.success("Test notification created!");
    } catch (error) {
      console.error("Error creating notification:", error);
      toast.error("Failed to create notification");
    }
  };

  if (!session) {
    return null;
  }

  const saveMinecraftUsername = async () => {
    setSavingMinecraftUsername(true);
    try {
      const res = await fetch("/api/user/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minecraftUsername }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore durante il salvataggio");
      toast.success("Nick Minecraft salvato!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSavingMinecraftUsername(false);
    }
  };

  return (
    <CompetitionPageShell
      eyebrow="Il tuo account CoralMC"
      title="Impostazioni"
      description="Collega il tuo nick Minecraft, decidi quali notifiche ricevere e gestisci privacy e sicurezza del profilo."
    >
      <div className="mx-auto grid w-full max-w-5xl gap-5 md:grid-cols-2">
        <SettingsPanel
          icon={User}
          title="Informazioni account"
          description="I dati del tuo profilo e lo stato dell'iscrizione."
        >
          <div className="space-y-3">
            <div className="rounded-2xl border border-white/14 bg-white/[0.05] px-4 py-3">
              <label className="text-[10px] font-black uppercase tracking-[0.14em] text-white/52">
                Nick Minecraft
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  value={minecraftUsername}
                  onChange={(e) => setMinecraftUsername(e.target.value)}
                  placeholder={session.user.minecraftUsername || "Es: Steve"}
                  className="min-w-0 flex-1 rounded-xl border border-white/15 bg-[#03142b]/70 px-3 py-2 text-sm font-semibold text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#57ffff]/60"
                />
                <Button
                  variant="cyan"
                  onClick={saveMinecraftUsername}
                  disabled={savingMinecraftUsername}
                  className="shrink-0 rounded-xl font-black"
                >
                  {savingMinecraftUsername ? "Salvataggio…" : "Salva"}
                </Button>
              </div>
              <p className="mt-2 text-xs text-white/48">
                Serve per iscriversi ai tornei (solo chi l’ha collegato può essere invitato).
              </p>
            </div>
            <InfoRow label="Username">{session.user.name}</InfoRow>
            <InfoRow label="Email">{session.user.email}</InfoRow>
            <InfoRow label="Discord">{session.user.discordTag || "Non collegato"}</InfoRow>
            <div className="grid grid-cols-2 gap-3">
              <InfoRow label="Ruolo">
                <Badge
                  variant={
                    session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN"
                      ? "default"
                      : "secondary"
                  }
                >
                  {session.user.role}
                </Badge>
              </InfoRow>
              <InfoRow label="Stato">
                <Badge variant={session.user.status === "ACTIVE" ? "default" : "destructive"}>
                  {session.user.status}
                </Badge>
              </InfoRow>
            </div>
          </div>
        </SettingsPanel>

        <SettingsPanel
          icon={Bell}
          title="Notifiche"
          description="Scegli di cosa vuoi essere avvisato."
          action={
            <Button asChild variant="outline" size="sm" className="rounded-xl font-black">
              <Link href="/notifications">Vedi tutte</Link>
            </Button>
          }
        >
          <div className="space-y-3">
            <ToggleRow
              title="Aggiornamenti tornei"
              description="Avvisi sulle modifiche ai tornei"
              enabled={notificationPrefs.tournamentUpdates}
              onToggle={() => toggleNotification("tournamentUpdates")}
            />
            <ToggleRow
              title="Promemoria match"
              description="Ricordati le partite prima che inizino"
              enabled={notificationPrefs.matchReminders}
              onToggle={() => toggleNotification("matchReminders")}
            />
            <ToggleRow
              title="Inviti ai team"
              description="Avvisi quando un team ti invita"
              enabled={notificationPrefs.teamInvitations}
              onToggle={() => toggleNotification("teamInvitations")}
            />
          </div>
        </SettingsPanel>

        <SettingsPanel
          icon={Bell}
          title="Notifiche di prova"
          description="Genera una notifica di esempio per vedere come appare."
        >
          <div className="space-y-2">
            {testNotifications.map(({ type, label, tone, icon: TestIcon }) => (
              <Button
                key={type}
                variant="outline"
                className="w-full justify-start rounded-xl font-bold"
                onClick={() => createTestNotification(type)}
              >
                <TestIcon className={`mr-2 h-4 w-4 ${tone}`} />
                {label}
              </Button>
            ))}
          </div>
        </SettingsPanel>

        <SettingsPanel
          icon={Shield}
          title="Privacy e sicurezza"
          description="Controlla cosa mostrare agli altri giocatori."
        >
          <div className="space-y-3">
            <ToggleRow title="Profilo pubblico" description="Chi può vedere il tuo profilo" enabled />
            <ToggleRow title="Mostra statistiche" description="Rendi pubblici i tuoi numeri" enabled />
            <ToggleRow title="Mostra stato online" description="Fai vedere quando sei connesso" enabled />
          </div>
        </SettingsPanel>

        <SettingsPanel
          icon={Trash2}
          title="Zona pericolosa"
          description="Azioni irreversibili sul tuo account."
          danger
          className="md:col-span-2"
        >
          <div className="rounded-2xl border border-red-500/25 bg-red-500/[0.06] px-4 py-4">
            <p className="font-bold text-white">Elimina account</p>
            <p className="mt-2 text-sm leading-relaxed text-white/62">
              Cancella definitivamente il tuo account e tutti i dati collegati. L’operazione non può essere annullata.
            </p>
            <Button variant="destructive" className="mt-4 rounded-xl font-black">
              Elimina account
            </Button>
          </div>
        </SettingsPanel>
      </div>
    </CompetitionPageShell>
  );
}
