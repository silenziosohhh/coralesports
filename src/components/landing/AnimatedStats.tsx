"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { cn } from "@/lib/utils";
import { INTL_LOCALE, useI18n, type Locale } from "@/lib/i18n";

type Stats = {
  players: number;
  tournaments: number;
  prizePool: number;
};

type StatDefinition = {
  key: keyof Stats;
  labelKey: string;
  highlight?: boolean;
  format: (value: number, locale: Locale) => string;
};

// Mostrati finché il database non restituisce dati reali (es. DB non raggiungibile).
const placeholderStats: Stats = {
  players: 1247,
  tournaments: 38,
  prizePool: 5200,
};

const statDefinitions: StatDefinition[] = [
  {
    key: "players",
    labelKey: "stats.players",
    format: (value, locale) => value.toLocaleString(INTL_LOCALE[locale]),
  },
  {
    key: "tournaments",
    labelKey: "stats.tournaments",
    highlight: true,
    format: (value, locale) => value.toLocaleString(INTL_LOCALE[locale]),
  },
  {
    key: "prizePool",
    labelKey: "stats.prizes",
    format: (value, locale) => `${value.toLocaleString(INTL_LOCALE[locale])}€`,
  },
];

function CountUp({ value, format, active }: { value: number; format: (value: number) => string; active: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;

    const controls = animate(0, value, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });

    return () => controls.stop();
  }, [active, value]);

  return (
    <>
      <span className="sr-only">{format(value)}</span>
      <span aria-hidden>{format(display)}</span>
    </>
  );
}

export function AnimatedStats({ className }: { className?: string }) {
  const { t, locale } = useI18n();
  const [stats, setStats] = useState<Stats | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });

  useEffect(() => {
    let cancelled = false;

    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;

        const real: Stats = {
          players: data.players ?? 0,
          tournaments: data.tournaments ?? 0,
          prizePool: data.prizePool ?? 0,
        };
        const hasRealData =
          !data.error && (real.players > 0 || real.tournaments > 0 || real.prizePool > 0);

        setStats(hasRealData ? real : placeholderStats);
      })
      .catch((error) => {
        console.error("Error fetching stats:", error);
        if (!cancelled) setStats(placeholderStats);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="grid gap-16 sm:grid-cols-3 sm:gap-8">
        {statDefinitions.map((def, index) => {
          const value = Math.round(stats?.[def.key] ?? 0);

          return (
            <motion.div
              key={def.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="text-center"
            >
              <p
                className={cn(
                  "text-6xl font-black leading-none tracking-tight tabular-nums sm:text-7xl md:text-8xl",
                  def.highlight ? "gradient-text" : "text-white/85",
                )}
              >
                <CountUp
                  value={value}
                  format={(v) => def.format(v, locale)}
                  active={isInView && stats !== null}
                />
              </p>
              <p className="mt-6 text-lg font-medium text-white/55 sm:text-xl">{t(def.labelKey)}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
