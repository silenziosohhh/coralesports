"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { CreatorSkin } from "@/components/landing/CreatorSkin";
import type { LandingCreator } from "@/components/landing/landingCreators";
import { useI18n } from "@/lib/i18n";

export function CreatorsSection({ creators, className }: { creators: LandingCreator[]; className?: string }) {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inViewNow = useInView(sectionRef, { margin: "-100px" });
  const [hasScrolledIn, setHasScrolledIn] = useState(false);

  useEffect(() => {
    if (inViewNow) setHasScrolledIn(true);
  }, [inViewNow]);

  return (
    <div ref={sectionRef} className={cn("relative", className)}>
      <div className="relative mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={hasScrolledIn ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-gray-400"
        >
          <span className="text-[var(--color-accent)]">04</span>
          <span className="h-px w-8 bg-[rgba(255,255,255,0.2)]" />
          {t("creators.tag")}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={hasScrolledIn ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mt-6 text-4xl font-black uppercase tracking-tight text-white sm:text-5xl md:text-6xl"
        >
          {t("creators.titlePre")} <span className="gradient-text">{t("creators.titleAccent")}</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={hasScrolledIn ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-5 text-pretty text-base text-gray-300 sm:text-lg"
        >
          {t("creators.subtitle")}
        </motion.p>
      </div>

      <div
        className={cn(
          "mx-auto mt-16 grid max-w-4xl gap-12 sm:mt-20 sm:gap-10",
          creators.length > 1 ? "sm:grid-cols-2" : "max-w-sm",
        )}
      >
        {creators.map((creator, index) => (
          <motion.div
            key={creator.name}
            initial={{ opacity: 0, y: 16 }}
            animate={hasScrolledIn ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.12 }}
            className="group flex flex-col items-center text-center"
          >
            <CreatorSkin
              username={creator.minecraftUsername}
              name={creator.name}
              className="h-[260px] w-full sm:h-[300px]"
            />

            <span className="mt-6 h-px w-full max-w-[280px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.18)] to-transparent" />

            <h3 className="mt-6 text-2xl font-bold text-white">{creator.name}</h3>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              {t("creators.role")}
            </p>

            <div className="mt-5 flex items-center justify-center gap-3 text-sm">
              <span className="inline-flex items-center gap-2 font-semibold text-gray-200">
                <FaYoutube className="h-5 w-5 text-[#ff0033]" aria-hidden />
                {creator.subscribers}
              </span>

              <span className="text-gray-400" aria-hidden>
                ·
              </span>

              <a
                href={creator.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-[var(--color-accent)] transition-opacity hover:opacity-80"
              >
                {t("creators.watch")}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
                <span className="sr-only"> — {creator.name} · YouTube</span>
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
