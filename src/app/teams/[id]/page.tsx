"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { CompetitionPageShell } from "@/components/competition/competition-page-shell";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Users,
  Trophy,
  Calendar,
  Crown,
  MoreVertical,
  LogOut,
  UserPlus,
  UserX,
} from "lucide-react";
import Link from "next/link";
import { LeaveTeamDialog } from "@/components/teams/leave-team-dialog";
import { InviteTeamDialog } from "@/components/teams/invite-team-dialog";
import { TeamAvatar } from "@/components/teams/team-avatar";
import { CoralLoadingScreen } from "@/components/ui/coral-loading-screen";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { TeamScoreboardPanel } from "./_components/TeamScoreboard";
import { INTL_LOCALE, useI18n } from "@/lib/i18n";

const PANEL =
  "relative overflow-hidden rounded-[28px] border-2 border-white/20 bg-[#061b3b]/68 shadow-[0_26px_70px_rgba(0,20,65,0.34)] backdrop-blur-2xl";

interface TeamMember {
  id: string;
  role: string;
  user: {
    id: string;
    name: string;
    image: string | null;
    minecraftUsername?: string | null;
    discordTag?: string | null;
    elo: number;
  };
}

interface Team {
  id: string;
  name: string;
  tag: string;
  description: string | null;
  logo: string | null;
  createdById: string;
  createdAt: string;
  members: TeamMember[];
  _count: {
    tournamentTeams: number;
  };
}

export default function TeamDetailPage() {
  const { t, locale } = useI18n();
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const teamId = String(params.id);

  const fetchTeam = useCallback(async () => {
    try {
      const response = await fetch(`/api/teams/${teamId}`);
      if (response.ok) {
        const data = await response.json();
        setTeam(data);
      }
    } catch (error) {
      console.error("Error fetching team:", error);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    void fetchTeam();
  }, [fetchTeam]);

  if (loading) {
    return <CoralLoadingScreen messageKey="loading.team" />;
  }

  if (!team) {
    return (
      <CompetitionPageShell
        eyebrow={t("team.detail.eyebrow")}
        title={t("team.detail.notFoundTitle")}
        accent={t("team.detail.notFoundAccent")}
        description={t("team.detail.notFoundDescription")}
        action={
          <Button
            variant="cyan"
            size="lg"
            className="h-12 rounded-xl px-6 font-black"
            onClick={() => router.push("/teams")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("team.detail.back")}
          </Button>
        }
      >
        <article className={`${PANEL} px-6 py-16 text-center`}>
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,157,255,0.14),transparent_52%)]"
          />
          <Users className="text-cyan-300/60 relative mx-auto h-10 w-10" />
          <h2 className="relative mt-5 text-2xl font-black text-white">
            {t("team.detail.emptyTitle")}
          </h2>
          <p className="relative mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/45">
            {t("team.detail.emptyDescription")}
          </p>
        </article>
      </CompetitionPageShell>
    );
  }

  const isCaptain = team.members.some(
    (m) => m.user.id === session?.user?.id && m.role === "CAPTAIN"
  );
  const isMember = team.members.some((m) => m.user.id === session?.user?.id);
  const isOwner = team.createdById === session?.user?.id;

  const removeMember = async (userId: string) => {
    try {
      const res = await fetch(`/api/teams/${team.id}/members/${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore");
      toast.success(t("team.detail.memberRemoved"));
      await fetchTeam();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <CompetitionPageShell
      eyebrow={t("team.detail.eyebrow")}
      title={team.name}
      description={
        team.description ??
        t("team.detail.defaultDescription")
      }
      action={
        <Button
          variant="outline"
          size="lg"
          className="h-12 rounded-xl px-6 font-black"
          onClick={() => router.push("/teams")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("team.detail.back")}
        </Button>
      }
    >
      <section
        data-reveal="zoom"
        className="relative mb-6 overflow-hidden rounded-[28px] border-2 border-white/15 bg-[#061b3b]/72 p-6 shadow-[0_26px_70px_rgba(0,20,65,0.34)] backdrop-blur-2xl sm:p-8"
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(0,157,255,0.22),transparent_58%)]"
        />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
          <TeamAvatar
            team={team}
            size={96}
            showSourceHint
            className="rounded-2xl border-[#57ffff]/40"
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[clamp(2rem,4.5vw,3.2rem)] font-black leading-[0.95] tracking-[-0.045em] text-white">
                {team.name}
              </h1>
              <span className="rounded-full border border-[#57ffff]/45 bg-[#57ffff]/12 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#57ffff]">
                {team.tag}
              </span>
            </div>
            {team.description && (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">
                {team.description}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-white/45">
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4 text-[#57ffff]" />
                {t("team.detail.members", { count: team.members.length })}
              </span>
              <span className="inline-flex items-center gap-2">
                <Trophy className="h-4 w-4 text-[#57ffff]" />
                {t("team.detail.tournaments", { count: team._count.tournamentTeams })}
              </span>
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#57ffff]" />
                {t("team.detail.createdOn", {
                  date: new Date(team.createdAt).toLocaleDateString(INTL_LOCALE[locale]),
                })}
              </span>
            </div>
          </div>

          {isMember && (
            <div className="flex shrink-0 items-center gap-2">
              {isCaptain && (
                <InviteTeamDialog teamId={team.id} teamName={team.name}>
                  <Button variant="cyan" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    {t("team.detail.invite")}
                  </Button>
                </InviteTeamDialog>
              )}
              <Button variant="destructive" onClick={() => setLeaveOpen(true)}>
                {isOwner ? t("team.detail.disband") : t("team.detail.leave")}
              </Button>
            </div>
          )}
        </div>
      </section>

      {isMember && (
        <LeaveTeamDialog
          teamId={team.id}
          teamName={team.name}
          isOwner={isOwner}
          open={leaveOpen}
          onOpenChange={setLeaveOpen}
        />
      )}

      <TeamScoreboardPanel teamId={team.id} />

      <article className={`${PANEL} mt-6 p-6 sm:p-8`}>
        <div
          aria-hidden
          className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#57ffff]/16 blur-3xl"
        />
        <div className="relative flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-[#57ffff]">
            <Users className="h-5 w-5" />
          </span>
          <h2 className="text-2xl font-black tracking-[-0.03em] text-white">
            {t("team.detail.roster")}
          </h2>
        </div>

        <div className="relative mt-6 space-y-3">
          {team.members.map((member) => (
            <div
              key={member.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/14 bg-white/[0.05] p-4 transition-colors hover:border-[#57ffff]/35"
            >
              <div className="flex min-w-0 items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-[#57ffff]/35">
                  <AvatarImage src={member.user.image || ""} alt={member.user.name} />
                  <AvatarFallback>{member.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-black text-white">{member.user.name}</p>
                    {member.role === "CAPTAIN" && (
                      <Crown className="h-4 w-4 shrink-0 text-[#ffd63d]" />
                    )}
                  </div>
                  <p className="truncate text-sm text-white/48">
                    {member.user.discordTag ||
                      (member.role === "CAPTAIN"
                        ? t("team.detail.captain")
                        : t("team.detail.member"))}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-[#57ffff]/45 font-black text-[#57ffff]">
                  {member.user.elo} ELO
                </Badge>
                <Badge
                  className={
                    member.role === "CAPTAIN"
                      ? "border-0 bg-[#ffd63d] font-black text-[#00152b]"
                      : "border-0 bg-white/12 font-black text-white"
                  }
                >
                  {member.role === "CAPTAIN"
                    ? t("team.detail.captain")
                    : t("team.detail.member")}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t("team.detail.memberOptions")}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {member.user.id === session?.user?.id ? (
                      <DropdownMenuItem
                        className="text-red-500 focus:text-red-500"
                        onSelect={(e) => {
                          e.preventDefault();
                          setLeaveOpen(true);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {isOwner ? t("team.detail.disband") : t("team.detail.leaveFull")}
                      </DropdownMenuItem>
                    ) : isCaptain && member.role !== "CAPTAIN" ? (
                      <DropdownMenuItem
                        className="text-red-500 focus:text-red-500"
                        onSelect={(e) => {
                          e.preventDefault();
                          removeMember(member.user.id);
                        }}
                      >
                        <UserX className="mr-2 h-4 w-4" />
                        {t("team.detail.remove")}
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem disabled>{t("team.detail.noAction")}</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </article>
    </CompetitionPageShell>
  );
}
