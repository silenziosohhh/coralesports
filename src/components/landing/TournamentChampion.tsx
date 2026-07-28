"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { INTL_LOCALE, useI18n } from "@/lib/i18n";
import type { Champion } from "@/app/api/champion/route";

/**
 * Skin del giocatore in posa "cheer". La GIF va servita non ottimizzata:
 * l'optimizer di next/image ricodifica l'immagine e perde l'animazione.
 */
function skinUrl(username: string) {
  const params = new URLSearchParams({
    size: "1024",
    emote: "cheer",
    format: "gif",
    quality: "ultra",
    fallback: "false",
  });
  return `https://avyra-skin-api.vercel.app/api/body/${encodeURIComponent(username)}?${params}`;
}

export function TournamentChampion({ className }: { className?: string }) {
  const { t, locale } = useI18n();
  const [champion, setChampion] = useState<Champion | null>(null);
  const [skinFailed, setSkinFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/champion")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data?.champion) setChampion(data.champion as Champion);
      })
      .catch((error) => {
        console.error("Error fetching champion:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Senza nome Minecraft non c'è skin da mostrare: meglio non occupare il posto.
  if (!champion || !champion.username || skinFailed) return null;

  return (
    <div className={cn("flex w-full flex-col items-center lg:w-auto", className)}>
      <div className="relative aspect-square w-[300px] sm:w-[400px] lg:w-[400px] xl:w-[480px]">
        <Image
          src={skinUrl(champion.username)}
          alt={`Skin di ${champion.displayName}, primo classificato`}
          fill
          unoptimized
          sizes="480px"
          className="object-contain drop-shadow-[0_18px_35px_rgba(0,0,0,0.55)]"
          onError={() => setSkinFailed(true)}
        />
      </div>

      <Link
        href="/leaderboard"
        aria-label={`${champion.displayName}, primo classificato — vai alla classifica`}
        className="group mt-4 rounded-2xl px-6 py-4 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5"
        style={{
          border: "1px solid rgba(255,255,255,0.1)",
          backgroundColor: "rgba(255,255,255,0.04)",
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-secondary)]">
          #1 · {champion.tournamentName}
        </p>
        <p className="mt-2 text-2xl font-black text-white">{champion.displayName}</p>
        <p className="mt-1 text-sm font-medium text-gray-300">
          {champion.elo.toLocaleString(INTL_LOCALE[locale])} ELO · {champion.wins} {t("champion.wins")}
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {t("champion.view")}
        </span>
      </Link>
    </div>
  );
}
