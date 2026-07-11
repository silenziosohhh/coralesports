"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import { FaDiscord, FaInstagram, FaTiktok, FaTwitch } from "react-icons/fa";

type FooterLink = { label: string; href: string };

const quickLinks: FooterLink[] = [
  { label: "Home", href: "/" },
  { label: "Store", href: "/store" },
  { label: "Tornei", href: "/tournaments" }, 
  { label: "Teams", href: "/teams" },
  { label: "Classifica", href: "/leaderboard" },
];

const legalLinks: FooterLink[] = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Rules", href: "#" },
];

const socials: { label: string; href: string; icon: JSX.Element }[] = [
  { label: "Discord", href: "#", icon: <FaDiscord className="h-5 w-5" /> },
  { label: "Instagram", href: "#", icon: <FaInstagram className="h-5 w-5" /> },
  { label: "Twitch", href: "#", icon: <FaTwitch className="h-5 w-5" /> },
  { label: "TikTok", href: "#", icon: <FaTiktok className="h-5 w-5" /> },
];

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("relative mt-24 bg-[var(--bg-primary)]", className)}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/25" />

      <div className="relative container mx-auto px-4 pb-8 pt-14">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="CoralMC" width={72} height={72} className="rounded-2xl" />
              <div>
                <div className="text-lg font-black tracking-tight text-white">CoralMC</div>
                <div className="text-sm text-white/60">eSports</div>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-white/60">
              CoralMC è un server Minecraft con varie modalità (BedWars, KitPvP, Survival, Prison e SMP). Unisciti
              a noi per un&apos;esperienza unica e competitiva.
            </p>
            <div className="flex items-center gap-3 text-white/55">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4 md:justify-self-center">
            <h3 className="text-sm font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm text-white/60">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link className="hover:text-white transition-colors" href={l.href}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 md:justify-self-end md:text-right">
            <h3 className="text-sm font-semibold text-white">Support us</h3>
            <p className="max-w-md text-sm leading-relaxed text-white/60 md:ml-auto">
              Supporta il server per ottenere vantaggi esclusivi e sostenere lo sviluppo.
            </p>
            <div className="flex md:justify-end">
              <Button
                variant="cyan"
                className="h-11 w-full max-w-xs gap-2 rounded-lg bg-[var(--color-primary)] text-[var(--bg-primary)] shadow-lg shadow-black/25"
                asChild
              >
                <Link href="/store" className="flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4" />
                  Store
                </Link>
              </Button>
            </div> 
            <div className="text-xs text-white/50"><Link href="https://sildev.dev" className="hover:text-white transition-colors">by Sildev</Link></div>
          </div>
        </div>

        <div className="my-10 h-px w-full bg-white/15" />

        <div className="flex flex-col gap-4 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} CoralMC. All rights reserved. Not affiliated with Mojang Studios.</div>
          <div className="flex items-center gap-6 md:justify-center">
            {legalLinks.map((l) => (
              <Link key={l.label} href={l.href} className="hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
          <div className="md:text-right">v1.7.3</div>
        </div>
      </div>
    </footer>
  );
}
