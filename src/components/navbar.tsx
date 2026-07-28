"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Orbitron } from "next/font/google";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, LayoutDashboard, Settings, LogOut, Menu, Bell, Calendar, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { NavbarLink } from "@/components/navbar/navbar-link";
import { GlobalSearch } from "@/components/navbar/global-search";
import { VideoIcon, type VideoIconHandle } from "@/components/ui/video-icon";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/lib/i18n";

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

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["700", "800"],
});

export function Navbar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  const tourneiDesktopRef = useRef<VideoIconHandle>(null);
  const teamsDesktopRef = useRef<VideoIconHandle>(null);
  const classificaDesktopRef = useRef<VideoIconHandle>(null);
  const storeDesktopRef = useRef<VideoIconHandle>(null);
  const tourneiMobileRef = useRef<VideoIconHandle>(null);
  const teamsMobileRef = useRef<VideoIconHandle>(null);
  const classificaMobileRef = useRef<VideoIconHandle>(null);
  const storeMobileRef = useRef<VideoIconHandle>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (session) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
      return () => clearInterval(interval);
    }
  }, [session]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications");
      const data = await response.json();
      setUnreadCount(data.unreadCount);
      setNotifications(data.notifications.slice(0, 5)); // Only show 5 most recent
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
      });
      fetchNotifications();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const seconds = Math.floor((now.getTime() - notifDate.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <nav
      className={`top-0 z-50 w-full transition-all duration-300 ${
        isHome ? "fixed left-0 right-0" : "sticky"
      } ${
        scrolled
          ? "border-b border-transparent bg-[var(--bg-primary)]/52 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
          : isHome
            ? "border-b border-transparent bg-transparent"
            : "border-b border-transparent bg-[var(--bg-primary)]/88 backdrop-blur-xl"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="CoralMC" width={32} height={32} className="rounded-lg" priority={false} />
          <span
            className={`${orbitron.className} hidden bg-gradient-to-r from-[var(--color-secondary)] via-[var(--color-accent)] to-[var(--color-highlight)] bg-clip-text text-sm font-extrabold uppercase tracking-[0.18em] text-transparent drop-shadow-[0_0_18px_rgba(0,157,255,0.22)] sm:inline-block`}
          >
            CoralMC Esports
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-6 md:flex">
          <NavbarLink
            href="/tournaments"
            className="gap-2"
            onMouseEnter={() => tourneiDesktopRef.current?.play()}
            onMouseLeave={() => tourneiDesktopRef.current?.pause()}
          >
            <VideoIcon ref={tourneiDesktopRef} src="/icons/podium.mp4" />
            {t("nav.tournaments")}
          </NavbarLink>
          <NavbarLink
            href="/teams"
            className="gap-2"
            onMouseEnter={() => teamsDesktopRef.current?.play()}
            onMouseLeave={() => teamsDesktopRef.current?.pause()}
          >
            <VideoIcon ref={teamsDesktopRef} src="/icons/win-win.mp4" />
            {t("nav.teams")}
          </NavbarLink>
          <NavbarLink
            href="/leaderboard"
            className="gap-2"
            onMouseEnter={() => classificaDesktopRef.current?.play()}
            onMouseLeave={() => classificaDesktopRef.current?.pause()}
          >
            <VideoIcon ref={classificaDesktopRef} src="/icons/ranking.mp4" />
            {t("nav.leaderboard")}
          </NavbarLink>
          <NavbarLink
            href="/store"
            className="gap-2"
            onMouseEnter={() => storeDesktopRef.current?.play()}
            onMouseLeave={() => storeDesktopRef.current?.pause()}
          >
            <VideoIcon ref={storeDesktopRef} src="/icons/shopping-bag.mp4" />
            {t("nav.store")}
          </NavbarLink>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          <GlobalSearch />
          <LanguageSwitcher />
          {session ? (
            <>
              {/* Notifications Dropdown */}
              <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full bg-white/0 transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/40"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge
                        variant="default"
                        className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center bg-[var(--color-accent)] p-0 text-navy text-xs"
                      >
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-96 border-0 bg-[var(--bg-primary)] shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
                  align="end"
                >
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <Badge variant="default" className="bg-[var(--color-accent)] text-navy">
                        {unreadCount} new
                      </Badge>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-gray text-sm">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      No notifications yet
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => {
                        const Icon = notificationIcons[notification.type as keyof typeof notificationIcons] || AlertCircle;
                        const iconColor = notificationColors[notification.type as keyof typeof notificationColors] || "text-gray";
                        
                        return (
                          <div
                            key={notification.id}
                            className={`cursor-pointer p-3 hover:bg-[var(--color-accent)]/10 transition-colors border-b border-[var(--color-accent)]/10 last:border-0 ${!notification.read ? "bg-[var(--color-accent)]/5" : ""}`}
                            onClick={() => {
                              if (!notification.read) {
                                markAsRead(notification.id);
                              }
                              if (notification.link) {
                                window.location.href = notification.link;
                              }
                              setNotificationsOpen(false);
                            }}
                          >
                            <div className="flex items-start space-x-3 w-full">
                              <div className={`p-2 rounded-lg bg-white/5 ${iconColor} flex-shrink-0`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="font-semibold text-white text-sm line-clamp-1">
                                    {notification.title}
                                  </p>
                                  {!notification.read && (
                                    <div className="h-2 w-2 rounded-full bg-[var(--color-accent)] flex-shrink-0 mt-1.5" />
                                  )}
                                </div>
                                <p className="text-xs text-gray/90 line-clamp-2 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-cyan/70 mt-1.5 font-medium">
                                  {getTimeAgo(notification.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  <DropdownMenuSeparator className="bg-[var(--color-accent)]/20" />
                  <div className="p-3 text-center">
                    <Link 
                      href="/notifications" 
                      className="text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 font-medium text-sm transition-colors"
                      onClick={() => setNotificationsOpen(false)}
                    >
                      View All Notifications →
                    </Link>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu Dropdown */}
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full bg-white/0 p-0 transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/40"
                >
                  <Avatar>
                    <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                    <AvatarFallback>{session.user.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 border-0 bg-[var(--bg-primary)] shadow-[0_24px_80px_rgba(0,0,0,0.55)] flex gap-1 flex-col"
                align="end"
              >
                <DropdownMenuLabel className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 ring-2 ring-cyan/30">
                      <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                      <AvatarFallback className="bg-cyan/20 text-cyan">{session.user.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold text-white">{session.user.name}</p>
                      {session.user.elo && (
                        <p className="text-xs font-medium text-cyan">{session.user.elo} ELO</p>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <Users className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/notifications" className="cursor-pointer">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                    {unreadCount > 0 && (
                      <Badge variant="default" className="ml-auto bg-cyan text-navy">
                        {unreadCount}
                      </Badge>
                    )}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                {session.user.role !== "USER" ? (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-[var(--color-destructive)] transition-colors"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </>
          ) : (
            <Button variant="cyan" asChild>
              <Link href="/auth/signin">{t("nav.signIn")}</Link>
            </Button>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-cyan/20 bg-slate-dark/95 backdrop-blur md:hidden">
          <div className="container mx-auto space-y-1 px-4 py-4">
            <NavbarLink
              href="/tournaments"
              variant="mobile"
              className="flex items-center gap-2"
              onNavigate={() => setMobileMenuOpen(false)}
              onMouseEnter={() => tourneiMobileRef.current?.play()}
              onMouseLeave={() => tourneiMobileRef.current?.pause()}
            >
              <VideoIcon ref={tourneiMobileRef} src="/icons/podium.mp4" />
              {t("nav.tournaments")}
            </NavbarLink>
            <NavbarLink
              href="/teams"
              variant="mobile"
              className="flex items-center gap-2"
              onNavigate={() => setMobileMenuOpen(false)}
              onMouseEnter={() => teamsMobileRef.current?.play()}
              onMouseLeave={() => teamsMobileRef.current?.pause()}
            >
              <VideoIcon ref={teamsMobileRef} src="/icons/win-win.mp4" />
              {t("nav.teams")}
            </NavbarLink>
            <NavbarLink
              href="/leaderboard"
              variant="mobile"
              className="flex items-center gap-2"
              onNavigate={() => setMobileMenuOpen(false)}
              onMouseEnter={() => classificaMobileRef.current?.play()}
              onMouseLeave={() => classificaMobileRef.current?.pause()}
            >
              <VideoIcon ref={classificaMobileRef} src="/icons/ranking.mp4" />
              {t("nav.leaderboard")}
            </NavbarLink>
            <NavbarLink
              href="/store"
              variant="mobile"
              className="flex items-center gap-2"
              onNavigate={() => setMobileMenuOpen(false)}
              onMouseEnter={() => storeMobileRef.current?.play()}
              onMouseLeave={() => storeMobileRef.current?.pause()}
            >
              <VideoIcon ref={storeMobileRef} src="/icons/shopping-bag.mp4" />
              {t("nav.store")}
            </NavbarLink>
          </div>
        </div>
      )}
    </nav>
  );
}
