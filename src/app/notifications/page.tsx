"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CompetitionPageShell } from "@/components/competition/competition-page-shell";
import { Bell, Users, Trophy, Calendar, AlertCircle, CheckCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const PANEL =
  "relative overflow-hidden rounded-[28px] border-2 border-white/20 bg-[#061b3b]/68 shadow-[0_26px_70px_rgba(0,20,65,0.34)] backdrop-blur-2xl";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

const notificationIcons = {
  TEAM_INVITATION: Users,
  MATCH_SCHEDULED: Calendar,
  MATCH_RESULT: Trophy,
  TOURNAMENT_UPDATE: Trophy,
  SYSTEM: AlertCircle,
};

const notificationColors = {
  TEAM_INVITATION: "text-blue-400",
  MATCH_SCHEDULED: "text-purple-400",
  MATCH_RESULT: "text-green-400",
  TOURNAMENT_UPDATE: "text-cyan",
  SYSTEM: "text-yellow-400",
};

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch(`/api/notifications?unreadOnly=${filter === "unread"}`);
      const data = await response.json();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/signin");
    }
  }, [status]);

  useEffect(() => {
    if (session) {
      fetchNotifications();
    }
  }, [session, fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
      });
      fetchNotifications();
      toast.success("Marked as read");
    } catch (error) {
      console.error("Error marking as read:", error);
      toast.error("Failed to mark as read");
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      });
      fetchNotifications();
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/mark-all-read", {
        method: "POST",
      });
      fetchNotifications();
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const seconds = Math.floor((now.getTime() - notifDate.getTime()) / 1000);

    if (seconds < 60) return "Adesso";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min fa`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} h fa`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} g fa`;
    return notifDate.toLocaleDateString();
  };

  return (
    <CompetitionPageShell
      eyebrow="Il tuo centro aggiornamenti"
      title="Notifiche"
      description="Inviti ai team, match programmati, risultati e comunicazioni dello staff: tutto quello che ti riguarda in un posto solo."
      action={
        unreadCount > 0 ? (
          <Button onClick={markAllAsRead} variant="cyan" size="lg" className="h-12 rounded-xl px-6 font-black">
            <CheckCheck className="mr-2 h-4 w-4" />
            Segna tutte come lette
          </Button>
        ) : null
      }
    >
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Button
            variant={filter === "all" ? "cyan" : "outline"}
            onClick={() => setFilter("all")}
            className="rounded-xl font-black"
          >
            Tutte
          </Button>
          <Button
            variant={filter === "unread" ? "cyan" : "outline"}
            onClick={() => setFilter("unread")}
            className="rounded-xl font-black"
          >
            Da leggere
          </Button>
          {unreadCount > 0 ? (
            <Badge className="ml-1 border-0 bg-[#57ffff] font-black text-[#00152b]">{unreadCount} nuove</Badge>
          ) : null}
        </div>

        {loading ? (
          <div className={`${PANEL} px-6 py-16 text-center`}>
            <p className="relative text-sm font-semibold text-white/60">Caricamento notifiche…</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <article className={`${PANEL} px-6 py-16 text-center`}>
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,157,255,0.14),transparent_52%)]"
                />
                <Bell className="relative mx-auto h-10 w-10 text-cyan-300/60" />
                <h2 className="relative mt-5 text-2xl font-black text-white">
                  {filter === "unread" ? "Sei in pari" : "Nessuna notifica"}
                </h2>
                <p className="relative mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/45">
                  {filter === "unread"
                    ? "Hai già letto tutto. Le nuove notifiche compariranno qui."
                    : "Appena ci sarà un aggiornamento sui tuoi team o tornei lo troverai qui."}
                </p>
              </article>
            ) : (
              notifications.map((notification) => {
                const Icon = notificationIcons[notification.type as keyof typeof notificationIcons] || AlertCircle;
                const iconColor =
                  notificationColors[notification.type as keyof typeof notificationColors] || "text-white/60";

                return (
                  <article
                    key={notification.id}
                    className={`relative overflow-hidden rounded-2xl border p-4 backdrop-blur-xl transition-colors ${
                      notification.read
                        ? "border-white/14 bg-[#061b3b]/48 hover:border-white/25"
                        : "border-[#57ffff]/35 bg-[#061b3b]/68 hover:border-[#57ffff]/55"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/[0.06] ${iconColor}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-start justify-between gap-2">
                          <h3 className="font-black tracking-[-0.01em] text-white">{notification.title}</h3>
                          <div className="flex shrink-0 items-center gap-1">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="h-8 px-2 text-white/70 hover:text-white"
                              >
                                <CheckCheck className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-8 px-2 text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="mb-2 text-sm leading-relaxed text-white/68">{notification.message}</p>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-semibold text-white/42">
                            {getTimeAgo(notification.createdAt)}
                          </span>
                          {notification.link && (
                            <Link
                              href={notification.link}
                              className="text-xs font-black text-[#57ffff] transition-opacity hover:opacity-80"
                            >
                              Vedi dettagli →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        )}
      </div>
    </CompetitionPageShell>
  );
}
