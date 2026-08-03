"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Orbitron } from "next/font/google";
import { useSession, signOut } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";
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
import {
  Trophy,
  Users,
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  Bell,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const isNavActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const tourneiDesktopRef = useRef<VideoIconHandle>(null);
  const teamsDesktopRef = useRef<VideoIconHandle>(null);
  const classificaDesktopRef = useRef<VideoIconHandle>(null);
  const storeDesktopRef = useRef<VideoIconHandle>(null);
  const tourneiMobileRef = useRef<VideoIconHandle>(null);
  const teamsMobileRef = useRef<VideoIconHandle>(null);
  const classificaMobileRef = useRef<VideoIconHandle>(null);
  const storeMobileRef = useRef<VideoIconHandle>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications?limit=5");
      if (!response.ok) return;
      const data = await response.json();
      setUnreadCount(data.unreadCount);
      setNotifications(data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 4);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!session?.user?.id) {
      setUnreadCount(0);
      setNotifications([]);
      return;
    }

    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") void fetchNotifications();
    };

    refreshWhenVisible();
    const interval = window.setInterval(refreshWhenVisible, 30000);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [fetchNotifications, session?.user?.id]);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
      });
      void fetchNotifications();
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
      className={`top-0 z-50 w-full transition-all duration-500 ease-out ${
        isHome ? "fixed left-0 right-0" : "sticky"
      } ${
        scrolled
          ? "bg-transparent"
          : isHome
            ? "border-b border-transparent bg-transparent"
            : "bg-[var(--bg-primary)]/88 border-b border-transparent backdrop-blur-xl"
      }`}
    >
      <div
        className={`navbar-scroll-shell mx-auto flex items-center border ${
          scrolled
            ? "mt-3 flex h-16 w-[calc(100%-2rem)] max-w-[1120px] justify-between rounded-[14px] border-[rgba(190,200,215,0.24)] bg-[rgba(5,14,28,0.38)] px-4 shadow-[0_14px_36px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl md:grid md:grid-cols-[1fr_auto_1fr] md:px-6 lg:px-7"
            : "mt-0 flex h-16 w-full max-w-screen-2xl justify-between rounded-none border-transparent bg-transparent px-4"
        }`}
      >
        <Link
          href="/"
          className={`navbar-scroll-item flex items-center ${
            scrolled ? "gap-0 md:justify-self-start" : "gap-3"
          }`}
        >
          <Image
            src="/logo.png"
            alt="CoralMC"
            width={42}
            height={42}
            className={`navbar-scroll-item rounded-lg ${
              scrolled ? "h-[42px] w-[42px]" : "h-8 w-8"
            }`}
            priority={false}
          />
          <span
            className={`${orbitron.className} navbar-scroll-item hidden overflow-hidden whitespace-nowrap bg-gradient-to-r from-[var(--color-secondary)] via-[var(--color-accent)] to-[var(--color-highlight)] bg-clip-text font-extrabold uppercase text-transparent drop-shadow-[0_0_18px_rgba(0,157,255,0.22)] sm:inline-flex ${
              scrolled
                ? "max-w-0 -translate-x-2 text-[15px] tracking-[0.18em] opacity-0"
                : "max-w-[220px] translate-x-0 text-sm tracking-[0.18em] opacity-100"
            }`}
          >
            CoralMC Esports
          </span>
        </Link>

        <div
          className={`navbar-scroll-item hidden items-center md:flex ${
            scrolled ? "space-x-2 justify-self-center lg:space-x-4" : "ml-0 space-x-6"
          }`}
        >
          <NavbarLink
            href="/tournaments"
            className={`navbar-scroll-item ${scrolled ? "gap-2.5 px-3 py-2.5 text-base" : "gap-2"}`}
            onMouseEnter={() => tourneiDesktopRef.current?.play()}
            onMouseLeave={() => tourneiDesktopRef.current?.pause()}
          >
            <VideoIcon
              ref={tourneiDesktopRef}
              src="/icons/podium.mp4"
              active={isNavActive("/tournaments")}
              className={`navbar-scroll-item ${scrolled ? "h-8 w-8" : ""}`}
            />
            <span className="navbar-link-label">{t("nav.tournaments")}</span>
          </NavbarLink>
          <NavbarLink
            href="/teams"
            className={`navbar-scroll-item ${scrolled ? "gap-2.5 px-3 py-2.5 text-base" : "gap-2"}`}
            onMouseEnter={() => teamsDesktopRef.current?.play()}
            onMouseLeave={() => teamsDesktopRef.current?.pause()}
          >
            <VideoIcon
              ref={teamsDesktopRef}
              src="/icons/win-win.mp4"
              active={isNavActive("/teams")}
              className={`navbar-scroll-item ${scrolled ? "h-8 w-8" : ""}`}
            />
            <span className="navbar-link-label">{t("nav.teams")}</span>
          </NavbarLink>
          <NavbarLink
            href="/store"
            className={buttonVariants({
              variant: "cyan",
              size: "lg",
              className:
                "navbar-scroll-item h-11 gap-2.5 rounded-[10px] px-5 py-0 text-[15px] !text-white [&_svg]:!text-white",
            })}
            onMouseEnter={() => storeDesktopRef.current?.play()}
            onMouseLeave={() => storeDesktopRef.current?.pause()}
          >
            <VideoIcon
              ref={storeDesktopRef}
              src="/icons/shopping-bag.mp4"
              active={isNavActive("/store")}
              className={`navbar-scroll-item ${scrolled ? "h-8 w-8" : ""}`}
            />
            <span className="navbar-link-label">{t("nav.store")}</span>
          </NavbarLink>
          <NavbarLink
            href="/leaderboard"
            className={`navbar-scroll-item ${scrolled ? "gap-2.5 px-3 py-2.5 text-base" : "gap-2"}`}
            onMouseEnter={() => classificaDesktopRef.current?.play()}
            onMouseLeave={() => classificaDesktopRef.current?.pause()}
          >
            <VideoIcon
              ref={classificaDesktopRef}
              src="/icons/ranking.mp4"
              active={isNavActive("/leaderboard")}
              className={`navbar-scroll-item ${scrolled ? "h-8 w-8" : ""}`}
            />
            <span className="navbar-link-label">{t("nav.leaderboard")}</span>
          </NavbarLink>
        </div>

        <div
          className={`navbar-scroll-item flex items-center ${
            scrolled ? "space-x-3 md:justify-self-end lg:space-x-4" : "ml-0 space-x-4"
          }`}
        >
          <div className={`navbar-scroll-item ${scrolled ? "lg:scale-105" : ""}`}>
            <GlobalSearch />
          </div>
          <div className={`navbar-scroll-item ${scrolled ? "lg:scale-105" : ""}`}>
            <LanguageSwitcher />
          </div>
          {session ? (
            <>
              <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="focus-visible:ring-[var(--color-accent)]/40 relative rounded-full bg-white/0 transition-colors hover:bg-white/5 focus-visible:ring-2"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge
                        variant="default"
                        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center bg-[var(--color-accent)] p-0 text-xs text-navy"
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
                    <div className="py-8 text-center text-sm text-gray">
                      <Bell className="mx-auto mb-2 h-8 w-8 opacity-50" />
                      No notifications yet
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => {
                        const Icon =
                          notificationIcons[notification.type as keyof typeof notificationIcons] ||
                          AlertCircle;
                        const iconColor =
                          notificationColors[
                            notification.type as keyof typeof notificationColors
                          ] || "text-gray";

                        return (
                          <div
                            key={notification.id}
                            className={`hover:bg-[var(--color-accent)]/10 border-[var(--color-accent)]/10 cursor-pointer border-b p-3 transition-colors last:border-0 ${!notification.read ? "bg-[var(--color-accent)]/5" : ""}`}
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
                            <div className="flex w-full items-start space-x-3">
                              <div
                                className={`rounded-lg bg-white/5 p-2 ${iconColor} flex-shrink-0`}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="line-clamp-1 text-sm font-semibold text-white">
                                    {notification.title}
                                  </p>
                                  {!notification.read && (
                                    <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[var(--color-accent)]" />
                                  )}
                                </div>
                                <p className="text-gray/90 mt-1 line-clamp-2 text-xs">
                                  {notification.message}
                                </p>
                                <p className="text-cyan/70 mt-1.5 text-xs font-medium">
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
                      className="hover:text-[var(--color-accent)]/80 text-sm font-medium text-[var(--color-accent)] transition-colors"
                      onClick={() => setNotificationsOpen(false)}
                    >
                      View All Notifications →
                    </Link>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="focus-visible:ring-[var(--color-accent)]/40 relative h-10 w-10 rounded-full bg-white/0 p-0 transition-colors hover:bg-white/5 focus-visible:ring-2"
                  >
                    <Avatar>
                      <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                      <AvatarFallback>{session.user.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="flex w-64 flex-col gap-1 border-0 bg-[var(--bg-primary)] shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
                  align="end"
                >
                  <DropdownMenuLabel className="pb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="ring-cyan/30 h-12 w-12 ring-2">
                        <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                        <AvatarFallback className="bg-cyan/20 text-cyan">
                          {session.user.name?.[0] || "U"}
                        </AvatarFallback>
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
            <Button
              variant="cyan"
              className={
                scrolled
                  ? "navbar-scroll-item h-11 rounded-[10px] px-5 text-[15px] font-extrabold"
                  : ""
              }
              asChild
            >
              <Link href="/auth/signin">{t("nav.signIn")}</Link>
            </Button>
          )}

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

      {mobileMenuOpen && (
        <div className="border-cyan/20 bg-slate-dark/95 border-t backdrop-blur md:hidden">
          <div className="container mx-auto space-y-1 px-4 py-4">
            <NavbarLink
              href="/tournaments"
              variant="mobile"
              className="flex items-center gap-2"
              onNavigate={() => setMobileMenuOpen(false)}
              onMouseEnter={() => tourneiMobileRef.current?.play()}
              onMouseLeave={() => tourneiMobileRef.current?.pause()}
            >
              <VideoIcon
                ref={tourneiMobileRef}
                src="/icons/podium.mp4"
                active={isNavActive("/tournaments")}
              />
              <span className="navbar-link-label">{t("nav.tournaments")}</span>
            </NavbarLink>
            <NavbarLink
              href="/teams"
              variant="mobile"
              className="flex items-center gap-2"
              onNavigate={() => setMobileMenuOpen(false)}
              onMouseEnter={() => teamsMobileRef.current?.play()}
              onMouseLeave={() => teamsMobileRef.current?.pause()}
            >
              <VideoIcon
                ref={teamsMobileRef}
                src="/icons/win-win.mp4"
                active={isNavActive("/teams")}
              />
              <span className="navbar-link-label">{t("nav.teams")}</span>
            </NavbarLink>
            <NavbarLink
              href="/leaderboard"
              variant="mobile"
              className="flex items-center gap-2"
              onNavigate={() => setMobileMenuOpen(false)}
              onMouseEnter={() => classificaMobileRef.current?.play()}
              onMouseLeave={() => classificaMobileRef.current?.pause()}
            >
              <VideoIcon
                ref={classificaMobileRef}
                src="/icons/ranking.mp4"
                active={isNavActive("/leaderboard")}
              />
              <span className="navbar-link-label">{t("nav.leaderboard")}</span>
            </NavbarLink>
            <NavbarLink
              href="/store"
              variant="mobile"
              className="flex items-center gap-2"
              onNavigate={() => setMobileMenuOpen(false)}
              onMouseEnter={() => storeMobileRef.current?.play()}
              onMouseLeave={() => storeMobileRef.current?.pause()}
            >
              <VideoIcon
                ref={storeMobileRef}
                src="/icons/shopping-bag.mp4"
                active={isNavActive("/store")}
              />
              <span className="navbar-link-label">{t("nav.store")}</span>
            </NavbarLink>
          </div>
        </div>
      )}
    </nav>
  );
}
