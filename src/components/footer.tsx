"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { FaDiscord, FaInstagram, FaTiktok, FaTwitch } from "react-icons/fa";

type FooterLink = { label: string; href: string };

const SERVER_IP = "play.coralmc.it";

const quickLinks: FooterLink[] = [
  { label: "Home", href: "/" },
  { label: "Tornei", href: "/tournaments" },
  { label: "Teams", href: "/teams" },
  { label: "Classifica", href: "/leaderboard" },
  { label: "Store", href: "/store" },
];

const socialIcons: { label: string; href: string; icon: JSX.Element }[] = [
  { label: "Instagram", href: "#", icon: <FaInstagram className="h-4 w-4" /> },
  { label: "Twitch", href: "#", icon: <FaTwitch className="h-4 w-4" /> },
  { label: "TikTok", href: "#", icon: <FaTiktok className="h-4 w-4" /> },
];

export function Footer({ className }: { className?: string }) {
  const copyIp = async () => {
    try {
      await navigator.clipboard.writeText(SERVER_IP);
      toast.success("IP copiato negli appunti", { description: SERVER_IP });
    } catch {
      toast.error("Impossibile copiare l'IP");
    }
  };

  return (
    <footer className={cn("relative mt-24 overflow-hidden bg-[var(--bg-primary)]", className)}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/25" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 hidden -translate-x-1/2 -translate-y-1/2 md:block">
        <Image
          src="/logo.png"
          alt=""
          aria-hidden="true"
          width={420}
          height={420}
          className="h-[320px] w-[320px] object-contain opacity-[0.06] lg:h-[380px] lg:w-[380px]"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 pb-8 pt-10 md:pt-12">
        <div className="grid gap-12 md:grid-cols-3 md:items-start">
          {/* Brand + IP server */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 flex-shrink-0">
                <div aria-hidden className="absolute inset-0 -z-10 scale-125 rounded-full bg-[var(--color-accent)]/25 blur-xl" />
                <Image src="/logo.png" alt="CoralMC" width={40} height={40} className="h-10 w-10 object-contain" />
              </div>
              <span className="text-base font-black uppercase tracking-tight text-white">
                CoralMC <span className="text-[var(--color-accent)]">Esports</span>
              </span>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-white/55">
              CoralMC Esports è l&apos;arena competitiva definitiva di Minecraft. Forma il tuo team,
              sfida i migliori giocatori nei tornei ufficiali e scala le classifiche ELO fino alla vetta.
              Bracket avanzati, premi reali e una community che vive per la competizione: qui ogni
              partita conta e ogni vittoria ti avvicina alla gloria.
            </p>
            <button
              type="button"
              onClick={copyIp}
              aria-label={`Copia l'IP del server ${SERVER_IP}`}
              className="group inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold text-white transition-all duration-300 hover:-translate-y-0.5"
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                backgroundColor: "rgba(255,255,255,0.05)",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="font-mono tracking-tight text-white/90">{SERVER_IP}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5 text-[var(--color-accent)]"
                aria-hidden="true"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>

          {/* Community (centrata) */}
          <div className="flex flex-col items-center space-y-5 text-center md:mt-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">Community</h3>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5"
              style={{
                border: "1px solid rgba(88,101,242,0.4)",
                backgroundColor: "rgba(88,101,242,0.12)",
              }}
            >
              <FaDiscord className="h-4 w-4 text-[#5865F2]" />
              <span>Entra su Discord</span>
            </a>
            <div className="flex items-center justify-center gap-3 text-white/55">
              {socialIcons.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:text-white"
                  style={{
                    border: "1px solid rgba(255,255,255,0.1)",
                    backgroundColor: "rgba(255,255,255,0.04)",
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigazione (a destra) */}
          <div className="space-y-5 md:text-right">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">Navigazione</h3>
            <ul className="space-y-3 text-sm text-white/60">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link className="transition-colors hover:text-[var(--color-accent)]" href={l.href}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-6 text-xs text-white/45">
              <Link href="https://sildev.dev" className="transition-colors hover:text-white">
                Website by Sildev
              </Link>
            </div>
          </div>
        </div>

        <div className="my-10 h-px w-full bg-white/10" />

        <div className="flex flex-col gap-5 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="CoralMC" width={26} height={26} className="h-6 w-6 object-contain" />
            <span className="font-semibold text-white/90">CoralMC Esports</span>
          </div>
          <div className="text-center">© {new Date().getFullYear()} TierList CoralMC. Tutti i diritti riservati.</div>
          <div className="md:text-right">v1.7.3</div>
        </div>
      </div>
    </footer>
  );
}
