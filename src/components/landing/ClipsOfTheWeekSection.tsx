"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import type { Clip } from "@/app/api/clips/route";

const fallbackClips: Clip[] = [
  { id: "demo-1", url: "/bg/pvp-background.mp4", author: "Itors" },
  { id: "demo-2", url: "/bg/pvp-background.mp4", author: "endighrd" },
  { id: "demo-3", url: "/bg/pvp-background.mp4", author: "NutSardina" },
  { id: "demo-4", url: "/bg/pvp-background.mp4", author: "kvnyewest" },
  { id: "demo-5", url: "/bg/pvp-background.mp4", author: "P0RC00" },
  { id: "demo-6", url: "/bg/pvp-background.mp4", author: "Toccamy" },
];

const MIN_BELT_CARDS = 12;
const SECONDS_PER_CARD = 11;

type ClipCardProps = {
  clip: Clip;
  instanceKey: string;
  isAudible: boolean;
  playAllowed: boolean;
  onHoverChange: (instanceKey: string | null) => void;
  onToggleAudio: (instanceKey: string) => void;
};

function ClipCard({ clip, instanceKey, isAudible, playAllowed, onHoverChange, onToggleAudio }: ClipCardProps) {
  const { t } = useI18n();
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isOnScreen, setIsOnScreen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = !isAudible;
  }, [isAudible]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(([entry]) => setIsOnScreen(entry.isIntersecting));
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isOnScreen && playAllowed) {
      video.play().catch(() => { });
    } else {
      video.pause();
    }
  }, [isOnScreen, playAllowed]);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => onHoverChange(instanceKey)}
      onMouseLeave={() => onHoverChange(null)}
      className="group relative z-0 mr-5 w-[320px] flex-shrink-0 overflow-hidden rounded-[18px] bg-[#000] shadow-[0_18px_45px_rgba(0,0,0,0.45)] transition-[transform,box-shadow] duration-300 ease-out hover:z-20 hover:scale-[1.16] hover:shadow-[0_28px_70px_rgba(0,0,0,0.6)] sm:mr-7 sm:w-[460px] sm:rounded-[22px] lg:mr-8 lg:w-[560px]"
    >
      <video
        ref={videoRef}
        src={clip.url}
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        className="aspect-video w-full scale-[1.08] object-cover"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[rgba(0,0,0,0.8)] to-transparent" />

      <button
        type="button"
        onClick={() => onToggleAudio(instanceKey)}
        aria-label={`${isAudible ? t("clips.audioOff") : t("clips.audioOn")}${clip.author ? ` · ${clip.author}` : ""}`}
        className={cn(
          "absolute bottom-3 left-3 z-10 grid h-10 w-10 place-items-center rounded-full border text-white backdrop-blur-sm transition-colors",
          isAudible
            ? "border-cyan-300 bg-cyan-200"
            : "border-[rgba(255,255,255,0.18)] bg-[rgba(0,0,0,0.55)] hover:bg-[rgba(0,0,0,0.75)]",
        )}
      >
        {isAudible ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      </button>

      {clip.author ? (
        <span className="pointer-events-none absolute bottom-4 right-4 z-10 max-w-[45%] truncate text-sm font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          {clip.author}
        </span>
      ) : null}
    </div>
  );
}

export function ClipsOfTheWeekSection({ className }: { className?: string }) {
  const { t } = useI18n();
  const [clips, setClips] = useState<Clip[] | null>(null);
  const [audibleKey, setAudibleKey] = useState<string | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const beltRef = useRef<HTMLDivElement>(null);
  const headerInViewNow = useInView(headerRef, { margin: "-100px" });
  const beltInView = useInView(beltRef);
  const [hasScrolledIn, setHasScrolledIn] = useState(false);

  useEffect(() => {
    if (headerInViewNow) setHasScrolledIn(true);
  }, [headerInViewNow]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/clips")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data?.clips) ? (data.clips as Clip[]) : [];
        setClips(list.length > 0 ? list : fallbackClips);
      })
      .catch((error) => {
        console.error("Error fetching clips:", error);
        if (!cancelled) setClips(fallbackClips);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const belt = useMemo(() => {
    if (!clips || clips.length === 0) return [];
    const tiled: Clip[] = [];
    while (tiled.length < MIN_BELT_CARDS) tiled.push(...clips);
    return tiled;
  }, [clips]);

  const track = useMemo(() => [...belt, ...belt], [belt]);

  return (
    <div className={cn("relative", className)}>
      <div ref={headerRef} className="container relative mx-auto max-w-3xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={hasScrolledIn ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/40"
        >
          <span className="text-[var(--color-accent)]">03</span>
          <span className="h-px w-8 bg-white/20" />
          {t("clips.tag")}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={hasScrolledIn ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mt-6 text-4xl font-black uppercase tracking-tight text-white sm:text-5xl md:text-6xl"
        >
          {t("clips.titlePre")} <span className="gradient-text">{t("clips.titleAccent")}</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={hasScrolledIn ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-5 text-pretty text-base text-white/50 sm:text-lg"
        >
          {t("clips.subtitle")}
        </motion.p>
      </div>

      <div ref={beltRef} className="relative mt-10 overflow-hidden sm:mt-12">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-30 w-10 bg-gradient-to-r from-[var(--bg-primary)] to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-30 w-10 bg-gradient-to-l from-[var(--bg-primary)] to-transparent sm:w-24" />

        {clips === null ? (
          <div className="flex gap-5 py-12 pl-4 sm:gap-7 lg:gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="aspect-video w-[320px] flex-shrink-0 animate-pulse rounded-[18px] bg-[rgba(255,255,255,0.04)] sm:w-[460px] sm:rounded-[22px] lg:w-[560px]"
              />
            ))}
          </div>
        ) : (
          <div
            className={cn("clips-conveyor flex w-max py-12", !beltInView && "clips-conveyor--paused")}
            style={{ ["--clips-conveyor-duration" as string]: `${belt.length * SECONDS_PER_CARD}s` }}
          >
            {track.map((clip, index) => {
              const instanceKey = `clip-${clip.id}-${index}`;
              return (
                <ClipCard
                  key={instanceKey}
                  clip={clip}
                  instanceKey={instanceKey}
                  isAudible={audibleKey === instanceKey}
                  playAllowed={beltInView && (hoveredKey === null || hoveredKey === instanceKey)}
                  onHoverChange={setHoveredKey}
                  onToggleAudio={(key) => setAudibleKey((current) => (current === key ? null : key))}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
