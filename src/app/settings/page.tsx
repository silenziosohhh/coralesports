"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, User, Bell, Shield, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

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
    // Load preferences from localStorage
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
    <div className="min-h-screen bg-transparent py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Settings className="h-8 w-8 text-cyan" />
            <h1 className="page-title text-4xl font-bold">Settings</h1>
          </div>
          <p className="text-gray">Manage your account settings and preferences</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Account Information */}
          <Card className="bg-darkslategray-100 border-deepskyblue-300">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-cyan" />
                <CardTitle>Account Information</CardTitle>
              </div>
              <CardDescription>Your account details and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray">Minecraft Nick</label>
                <div className="mt-1 flex gap-2">
                  <input
                    value={minecraftUsername}
                    onChange={(e) => setMinecraftUsername(e.target.value)}
                    placeholder={session.user.minecraftUsername || "Es: Steve"}
                    className="flex-1 rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-cyan/50"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={saveMinecraftUsername}
                    disabled={savingMinecraftUsername}
                  >
                    {savingMinecraftUsername ? "Salvataggio..." : "Salva"}
                  </Button>
                </div>
                <p className="mt-1 text-xs text-gray/80">
                  Serve per iscriversi ai tornei (solo chi l’ha collegato può essere invitato).
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray">Username</label>
                <p className="text-white font-semibold">{session.user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray">Email</label>
                <p className="text-white">{session.user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray">Discord Tag</label>
                <p className="text-white">{session.user.discordTag || "Not connected"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray">Role</label>
                <div className="mt-1">
                  <Badge variant={session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN" ? "default" : "secondary"}>
                    {session.user.role}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray">Status</label>
                <div className="mt-1">
                  <Badge variant={session.user.status === "ACTIVE" ? "default" : "destructive"}>
                    {session.user.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-darkslategray-100 border-deepskyblue-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-cyan" />
                  <CardTitle>Notifications</CardTitle>
                </div>
                <Link href="/notifications">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Tournament Updates</p>
                  <p className="text-sm text-gray">Get notified about tournament changes</p>
                </div>
                <Button 
                  variant={notificationPrefs.tournamentUpdates ? "default" : "outline"} 
                  size="sm"
                  onClick={() => toggleNotification("tournamentUpdates")}
                >
                  {notificationPrefs.tournamentUpdates ? "Enabled" : "Disabled"}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Match Reminders</p>
                  <p className="text-sm text-gray">Receive reminders before matches</p>
                </div>
                <Button 
                  variant={notificationPrefs.matchReminders ? "default" : "outline"} 
                  size="sm"
                  onClick={() => toggleNotification("matchReminders")}
                >
                  {notificationPrefs.matchReminders ? "Enabled" : "Disabled"}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Team Invitations</p>
                  <p className="text-sm text-gray">Get notified of team invites</p>
                </div>
                <Button 
                  variant={notificationPrefs.teamInvitations ? "default" : "outline"} 
                  size="sm"
                  onClick={() => toggleNotification("teamInvitations")}
                >
                  {notificationPrefs.teamInvitations ? "Enabled" : "Disabled"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Test Notifications */}
          <Card className="bg-darkslategray-100 border-deepskyblue-300">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-cyan" />
                <CardTitle>Test Notifications</CardTitle>
              </div>
              <CardDescription>Create test notifications to see how they look</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => createTestNotification("TEAM_INVITATION")}
              >
                <User className="h-4 w-4 mr-2 text-blue-400" />
                Team Invitation
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => createTestNotification("MATCH_SCHEDULED")}
              >
                <Bell className="h-4 w-4 mr-2 text-purple-400" />
                Match Scheduled
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => createTestNotification("MATCH_RESULT")}
              >
                <Settings className="h-4 w-4 mr-2 text-green-400" />
                Match Result
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => createTestNotification("TOURNAMENT_UPDATE")}
              >
                <Settings className="h-4 w-4 mr-2 text-cyan" />
                Tournament Update
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => createTestNotification("SYSTEM")}
              >
                <Settings className="h-4 w-4 mr-2 text-yellow-400" />
                System Notification
              </Button>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="bg-darkslategray-100 border-deepskyblue-300">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-cyan" />
                <CardTitle>Privacy & Security</CardTitle>
              </div>
              <CardDescription>Manage your privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Profile Visibility</p>
                  <p className="text-sm text-gray">Who can see your profile</p>
                </div>
                <Button variant="outline" size="sm">Public</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Show Stats</p>
                  <p className="text-sm text-gray">Display your stats publicly</p>
                </div>
                <Button variant="outline" size="sm">Enabled</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Show Online Status</p>
                  <p className="text-sm text-gray">Let others see when you&apos;re online</p>
                </div>
                <Button variant="outline" size="sm">Enabled</Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-darkslategray-100 border-crimson-100 md:col-span-2">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Trash2 className="h-5 w-5 text-red-500" />
                <CardTitle className="text-red-500">Danger Zone</CardTitle>
              </div>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-white mb-2">Delete Account</p>
                <p className="text-sm text-gray mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
