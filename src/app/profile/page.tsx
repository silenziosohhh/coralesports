import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Calendar,
  Crown,
  Flame,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { getDemoProfile } from "@/lib/demo-content";
import { CompetitionPageShell } from "@/components/competition/competition-page-shell";
import { Button } from "@/components/ui/button";
import { WavyPanel } from "@/components/ui/wavy-panel";
import { WaveDivider } from "@/components/ui/wave-divider";

const activityStyles: Record<string, { icon: typeof Trophy; color: string }> = {
  WIN: { icon: Trophy, color: "#4ade80" },
  MVP: { icon: Star, color: "#ffd63d" },
  STREAK: { icon: Flame, color: "#fb923c" },
};
const activityFallback = { icon: Calendar, color: "#57ffff" };

const achievementIcons: Record<string, typeof Trophy> = {
  "achievement-1": Crown,
  "achievement-2": Flame,
  "achievement-3": Users,
};

export default async function ProfilePage() {
  const user = getDemoProfile();

  const totalMatches = user.wins + user.losses;
  const winRate = totalMatches > 0 ? ((user.wins / totalMatches) * 100).toFixed(1) : "0.0";

  const stats = [
    { label: "ELO", value: String(user.elo), accent: "#57ffff", icon: Trophy },
    { label: "Vittorie", value: String(user.wins), accent: "#4ade80", icon: Target },
    { label: "Sconfitte", value: String(user.losses), accent: "#ff8f8f", icon: TrendingUp },
    { label: "Win rate", value: `${winRate}%`, accent: "#ffd63d", icon: Award },
  ];

  return (
    <CompetitionPageShell
      eyebrow="Profilo giocatore"
      title="Il tuo"
      accent="profilo"
      description="Statistiche, traguardi e attività recente: tutto quello che racconta la tua stagione competitiva su CoralMC."
      metrics={[
        { value: user.elo, label: "ELO" },
        { value: `#${user.rank}`, label: "In classifica" },
        { value: `${winRate}%`, label: "Win rate" },
      ]}
      contentTitle="La tua stagione, in un colpo d'occhio"
      contentDescription="Segui l'andamento dei tuoi match, controlla il team e scopri quali traguardi ti mancano ancora."
    >
      <DemoNotice />

      <section
        data-reveal="zoom"
        className="relative overflow-hidden rounded-[28px] border-2 border-white/20 bg-[#061b3b]/72 shadow-[0_26px_70px_rgba(0,20,65,0.34)] backdrop-blur-2xl"
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(0,157,255,0.22),transparent_58%)]"
        />
        <div className="relative flex flex-col items-center gap-6 p-6 text-center sm:p-8 md:flex-row md:items-start md:text-left">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[26px] border-[3px] border-[#57ffff]/45 bg-[#03142b] shadow-[0_18px_44px_rgba(87,255,255,0.18)] sm:h-32 sm:w-32">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                fill
                unoptimized
                sizes="128px"
                className="object-cover [image-rendering:pixelated]"
              />
            ) : (
              <span className="grid h-full w-full place-items-center text-4xl font-black text-[#57ffff]">
                {user.name.slice(0, 1)}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col items-center gap-3 md:flex-row md:items-center">
              <h2 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
                {user.name}
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Chip accent="#57ffff">{user.role}</Chip>
                <Chip accent={user.status === "ACTIVE" ? "#4ade80" : "#ff8f8f"}>{user.status}</Chip>
                <Chip accent="#ffd63d">#{user.rank} in classifica</Chip>
              </div>
            </div>

            <p className="mt-3 text-sm font-semibold text-white/60">
              {user.discordTag || "Discord non collegato"}
              <span className="mx-2 text-white/20">·</span>
              Minecraft: {user.minecraftUsername || "non configurato"}
            </p>

            <WaveDivider className="my-5 text-[#57ffff]/40" />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((stat) => (
                <WavyPanel
                  key={stat.label}
                  contentClassName="px-3 py-4 text-center"
                  fillGradient={["rgba(10,32,64,0.92)", "rgba(4,16,38,0.95)"]}
                  stroke={`${stat.accent}66`}
                  strokeWidth={2}
                  innerStroke={`${stat.accent}26`}
                  innerInset={7}
                  amplitude={5}
                  wavelength={34}
                  glow={`${stat.accent}26`}
                >
                  <stat.icon
                    className="mx-auto mb-1.5 h-4 w-4"
                    style={{ color: stat.accent }}
                    aria-hidden
                  />
                  <div className="text-2xl font-black tracking-[-0.04em] text-white">
                    {stat.value}
                  </div>
                  <div className="mt-0.5 text-[9px] font-black uppercase tracking-[0.14em] text-white/45">
                    {stat.label}
                  </div>
                </WavyPanel>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel icon={Trophy} title="Statistiche" description="Riepilogo delle prestazioni">
          <dl className="space-y-3">
            {[
              { label: "Match totali", value: String(totalMatches) },
              { label: "ELO attuale", value: String(user.elo), accent: true },
              { label: "Win rate", value: `${winRate}%` },
              { label: "Posizione", value: `#${user.rank}` },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3"
              >
                <dt className="text-sm font-semibold text-white/55">{row.label}</dt>
                <dd
                  className={
                    row.accent
                      ? "text-base font-black text-[#57ffff]"
                      : "text-base font-black text-white"
                  }
                >
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          {totalMatches > 0 ? (
            <div className="mt-4 rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3.5">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.14em]">
                <span className="text-[#4ade80]">{user.wins} vittorie</span>
                <span className="text-[#ff8f8f]">{user.losses} sconfitte</span>
              </div>
              <div
                className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-[#ff8f8f]/25"
                role="img"
                aria-label={`Win rate ${winRate}%: ${user.wins} vittorie su ${totalMatches} match`}
              >
                <div
                  className="h-full rounded-full bg-[#4ade80] shadow-[0_0_12px_rgba(74,222,128,0.5)]"
                  style={{ width: `${winRate}%` }}
                />
              </div>
            </div>
          ) : null}
        </Panel>

        <Panel
          icon={Calendar}
          title="Attività recente"
          description="Ultimi match ed eventi"
          revealDelay={0.1}
        >
          {user.recentActivity.length ? (
            <ul className="space-y-3">
              {user.recentActivity.map((activity) => {
                const { icon: ActivityIcon, color } =
                  activityStyles[activity.type] ?? activityFallback;

                return (
                  <li
                    key={activity.id}
                    className="rounded-xl border border-white/12 bg-white/[0.04] p-4 transition-colors hover:border-[#57ffff]/35"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
                        style={{ backgroundColor: `${color}1f`, color }}
                      >
                        <ActivityIcon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-white">{activity.title}</p>
                        <p className="mt-0.5 text-sm text-white/55">{activity.description}</p>
                        <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/30">
                          {activity.date}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState icon={Calendar} title="Ancora nessuna attività">
              I tuoi match, gli MVP e le serie positive compariranno qui.
            </EmptyState>
          )}
        </Panel>

        <Panel
          icon={Users}
          title="Team"
          description="Team principale del giocatore"
          revealDelay={0.2}
        >
          <div className="flex h-full flex-col rounded-2xl border border-white/12 bg-white/[0.04] p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border-2 border-[#57ffff]/50 bg-[#03142b] text-sm font-black text-[#57ffff]">
                {user.team.tag}
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-black text-white">{user.team.name}</p>
                <p className="text-sm font-semibold text-white/45">{user.team.role}</p>
              </div>
            </div>
            <div className="mt-auto pt-5">
              <Button asChild variant="cyan" className="w-full font-black">
                <Link href={`/teams/${user.team.id}`}>Apri il team</Link>
              </Button>
            </div>
          </div>
        </Panel>

        <div className="lg:col-span-3">
          <Panel icon={Award} title="Traguardi" description="Badge e obiettivi raggiunti">
            {user.achievements.length ? (
              <div className="grid gap-4 sm:grid-cols-3">
                {user.achievements.map((achievement) => {
                  const AchievementIcon = achievementIcons[achievement.id] ?? Shield;

                  return (
                    <WavyPanel
                      key={achievement.id}
                      contentClassName="px-5 py-6 text-center"
                      fillGradient={["rgba(10,32,64,0.9)", "rgba(4,16,38,0.94)"]}
                      stroke="rgba(87,255,255,0.4)"
                      strokeWidth={2}
                      innerStroke="rgba(87,255,255,0.16)"
                      innerInset={8}
                      amplitude={6}
                      wavelength={40}
                      glow="rgba(87,255,255,0.16)"
                    >
                      <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-[#57ffff]/30 bg-[#57ffff]/10 text-[#57ffff]">
                        <AchievementIcon className="h-6 w-6" />
                      </span>
                      <p className="mt-3 font-black text-white">{achievement.name}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/45">
                        {achievement.description}
                      </p>
                    </WavyPanel>
                  );
                })}
              </div>
            ) : (
              <EmptyState icon={Award} title="Nessun traguardo sbloccato">
                Gioca i tornei ufficiali per iniziare a collezionare badge.
              </EmptyState>
            )}
          </Panel>
        </div>
      </div>
    </CompetitionPageShell>
  );
}

function Chip({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em]"
      style={{ borderColor: `${accent}59`, backgroundColor: `${accent}1a`, color: accent }}
    >
      {children}
    </span>
  );
}

function Panel({
  icon: Icon,
  title,
  description,
  revealDelay = 0,
  children,
}: {
  icon: typeof Trophy;
  title: string;
  description: string;
  revealDelay?: number;
  children: React.ReactNode;
}) {
  return (
    <section
      data-reveal="up"
      data-reveal-delay={revealDelay}
      className="flex h-full flex-col rounded-[26px] border-2 border-white/20 bg-[#061b3b]/68 p-5 shadow-[0_22px_60px_rgba(0,20,65,0.28)] backdrop-blur-2xl sm:p-6"
    >
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-[#57ffff]" />
          <h3 className="text-lg font-black tracking-[-0.02em] text-white">{title}</h3>
        </div>
        <p className="mt-1 text-sm text-white/45">{description}</p>
      </div>
      {children}
    </section>
  );
}

function EmptyState({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Trophy;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/12 bg-white/[0.04] px-5 py-10 text-center">
      <Icon className="mx-auto h-8 w-8 text-[#57ffff]/50" />
      <p className="mt-3 font-black text-white">{title}</p>
      <p className="mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-white/45">{children}</p>
    </div>
  );
}

function DemoNotice() {
  return (
    <div
      className="mb-6 flex items-start gap-3 rounded-2xl border border-[#ffd63d]/30 bg-[#ffd63d]/[0.08] px-5 py-4 backdrop-blur-xl"
    >
      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#ffd63d]" />
      <p className="text-sm font-semibold leading-relaxed text-[#ffe982]">
        Anteprima con dati demo: il login non è ancora collegato, quindi il profilo mostra un
        giocatore di esempio. Appena la sessione sarà attiva vedrai qui i tuoi dati reali.
      </p>
    </div>
  );
}
