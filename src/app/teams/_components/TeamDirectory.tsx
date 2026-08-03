"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Crown, Search, Shield, Sparkles, Swords, Users } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { JoinTeamButton } from "@/components/teams/join-team-button";
import { TeamAvatar } from "@/components/teams/team-avatar";
import { getTeamAvatar } from "@/lib/team-avatar";
import { cn } from "@/lib/utils";

export type DirectoryMember = {
  id: string;
  role: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
    minecraftUsername: string | null;
    discordTag: string | null;
    elo: number;
  };
};

export type DirectoryTeam = {
  id: string;
  name: string;
  tag: string;
  description: string | null;
  logo: string | null;
  createdById: string | null;
  elo: number;
  wins: number;
  losses: number;
  tournaments: number;
  members: DirectoryMember[];
};

function memberLabel(user: DirectoryMember["user"]) {
  return user.minecraftUsername || user.discordTag || user.name || user.id;
}

const sortOptions = [
  { value: "elo", label: "ELO" },
  { value: "members", label: "Giocatori" },
  { value: "name", label: "Nome" },
] as const;

type SortValue = (typeof sortOptions)[number]["value"];

export function TeamDirectory({
  teams,
  currentUserId,
  maxRosterSize,
}: {
  teams: DirectoryTeam[];
  currentUserId: string | null;
  maxRosterSize?: number;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortValue>("elo");

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    const filtered = needle
      ? teams.filter(
          (team) =>
            team.name.toLocaleLowerCase().includes(needle) ||
            team.tag.toLocaleLowerCase().includes(needle) ||
            team.members.some((member) =>
              memberLabel(member.user).toLocaleLowerCase().includes(needle),
            ),
        )
      : teams;

    return [...filtered].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "members") return b.members.length - a.members.length;
      return b.elo - a.elo;
    });
  }, [query, sort, teams]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 rounded-[24px] border-2 border-white/20 bg-[#061b3b]/68 p-5 shadow-[0_22px_60px_rgba(0,20,65,0.26)] backdrop-blur-2xl lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cerca un team, un tag o un giocatore…"
            aria-label="Cerca team"
            className="h-11 w-full rounded-xl border border-white/20 bg-[#03162f]/60 pl-10 pr-4 text-sm font-semibold text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#57ffff]/60"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-black uppercase tracking-[0.14em] text-white/35">
            Ordina
          </span>
          <div className="flex gap-1 rounded-xl border border-white/20 bg-[#03162f]/50 p-1">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSort(option.value)}
                aria-pressed={sort === option.value}
                className={cn(
                  "relative inline-flex h-9 items-center rounded-lg px-3.5 text-xs font-black transition-all duration-300",
                  sort === option.value
                    ? "bg-[#57ffff] text-[#00204a] shadow-[0_3px_12px_rgba(87,255,255,0.28)]"
                    : "text-white/60 hover:bg-white/[0.08] hover:text-white",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {visible.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((team, index) => (
            <TeamCard
              key={team.id}
              team={team}
              index={index}
              currentUserId={currentUserId}
              maxRosterSize={maxRosterSize}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[24px] border-2 border-dashed border-white/20 bg-[#061b3b]/45 px-6 py-16 text-center">
          <Search className="mx-auto h-9 w-9 text-cyan-300/50" />
          <p className="mt-4 text-lg font-black text-white">Nessun team trovato</p>
          <p className="mt-1.5 text-sm text-white/45">Prova con un altro nome o tag.</p>
        </div>
      )}
    </div>
  );
}

function TeamCard({
  team,
  index,
  currentUserId,
  maxRosterSize,
}: {
  team: DirectoryTeam;
  index: number;
  currentUserId: string | null;
  maxRosterSize?: number;
}) {
  const avatar = getTeamAvatar(team);
  const isMember = Boolean(currentUserId) && team.members.some((m) => m.user.id === currentUserId);
  const captain = team.members.find((member) => member.role === "CAPTAIN") ?? team.members[0];
  const games = team.wins + team.losses;
  const winRate = games ? Math.round((team.wins / games) * 100) : 0;
  const isFull = Boolean(maxRosterSize) && team.members.length >= (maxRosterSize as number);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index, 8) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-[26px] border-2 border-white/20 bg-[#061b3b]/72 shadow-[0_22px_60px_rgba(0,20,65,0.28)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1.5 hover:border-[#57ffff]/45"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#57ffff]/12 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="relative flex items-start gap-4 border-b border-white/12 p-5">
        <TeamAvatar team={team} size={64} showSourceHint className="rounded-2xl" />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-[#57ffff]/35 bg-[#57ffff]/10 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#8ff]">
              {team.tag}
            </span>
            {avatar.source === "logo" ? (
              <Sparkles className="h-3.5 w-3.5 text-white/25" />
            ) : null}
          </div>
          <h3 className="mt-1.5 truncate text-xl font-black tracking-[-0.03em] text-white">
            {team.name}
          </h3>
          {captain ? (
            <p className="mt-0.5 flex items-center gap-1.5 truncate text-[11px] font-semibold text-white/40">
              <Crown className="h-3 w-3 shrink-0 text-[#ffd63d]" />
              {memberLabel(captain.user)}
            </p>
          ) : null}
        </div>

        <Link
          href={`/teams/${team.id}`}
          aria-label={`Apri ${team.name}`}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/20 bg-white/[0.06] text-white transition-all duration-300 hover:border-[#57ffff]/60 hover:text-[#57ffff] group-hover:rotate-12"
        >
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="relative grid grid-cols-3 divide-x divide-white/10 border-b border-white/12">
        {[
          { label: "ELO", value: team.elo, icon: Shield },
          { label: "Vittorie", value: team.wins, icon: Swords },
          { label: "Tornei", value: team.tournaments, icon: Users },
        ].map((stat) => (
          <div key={stat.label} className="px-3 py-3.5 text-center">
            <div className="text-lg font-black tracking-[-0.03em] text-white">
              <AnimatedNumber value={stat.value} format delay={0.1} />
            </div>
            <div className="mt-0.5 text-[9px] font-black uppercase tracking-[0.12em] text-white/38">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex flex-1 flex-col p-5">
        {team.description ? (
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-white/58">
            {team.description}
          </p>
        ) : null}

        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.12em] text-white/38">
            <span>Roster · {team.members.length}{maxRosterSize ? `/${maxRosterSize}` : ""}</span>
            {games ? <span>{winRate}% win rate</span> : null}
          </div>
          <div className="flex -space-x-2.5">
            {team.members.slice(0, 6).map((member, memberIndex) => {
              const label = memberLabel(member.user);
              return (
                <div
                  key={member.id}
                  title={`${label}${member.role === "CAPTAIN" ? " · capitano" : ""}`}
                  className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl border-2 bg-[#0b233b] text-[10px] font-black text-white/70 transition-transform duration-300 hover:z-10 hover:-translate-y-1"
                  style={{
                    borderColor:
                      member.role === "CAPTAIN"
                        ? "rgba(255,214,61,0.65)"
                        : "rgba(87,255,255,0.4)",
                    zIndex: 6 - memberIndex,
                  }}
                >
                  {member.user.image ? (
                    <Image
                      src={member.user.image}
                      alt={label}
                      fill
                      sizes="40px"
                      className="object-cover [image-rendering:pixelated]"
                    />
                  ) : (
                    label.slice(0, 2).toUpperCase()
                  )}
                </div>
              );
            })}
            {team.members.length > 6 ? (
              <div className="grid h-10 w-10 place-items-center rounded-xl border-2 border-white/20 bg-[#03162f] text-[10px] font-black text-white/60">
                +{team.members.length - 6}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-auto">
          <JoinTeamButton
            teamId={team.id}
            teamName={team.name}
            isMember={isMember}
            isFull={isFull}
          />
        </div>
      </div>
    </motion.article>
  );
}
