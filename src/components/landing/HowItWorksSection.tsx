"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export function HowItWorksSection({ className }: { className?: string }) {
  const { t } = useI18n();
  const steps = [
    {
      title: t("how.step1.title"),
      description: t("how.step1.desc"),
      caption: t("how.step1.caption"),
    },
    {
      title: t("how.step2.title"),
      description: t("how.step2.desc"),
      caption: t("how.step2.caption"),
    },
    {
      title: t("how.step3.title"),
      description: t("how.step3.desc"),
      caption: t("how.step3.caption"),
    },
  ];
  const sectionRef = useRef<HTMLDivElement>(null);
  const inViewNow = useInView(sectionRef, { margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();
  const [hasScrolledIn, setHasScrolledIn] = useState(false);

  useEffect(() => {
    if (inViewNow) setHasScrolledIn(true);
  }, [inViewNow]);

  const isInView = hasScrolledIn || prefersReducedMotion;

  return (
    <div ref={sectionRef} className={cn("relative", className)}>
      <div className="relative mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/40"
        >
          <span className="text-[var(--color-accent)]">01</span>
          <span className="h-px w-8 bg-white/20" />
          {t("how.tag")}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mt-6 text-4xl font-black uppercase tracking-tight text-white sm:text-5xl md:text-6xl"
        >
          {t("how.titlePre")} <span className="gradient-text">{t("how.titleAccent")}</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-5 text-pretty text-base text-white/50 sm:text-lg"
        >
          {t("how.subtitle")}
        </motion.p>
      </div>

      <div className="relative mt-12">
        <div className="absolute inset-x-0 top-0 hidden md:block">
          <motion.div
            className="absolute h-px"
            style={{
              left: "16.6667%",
              width: "66.6667%",
              transformOrigin: "left center",
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.05), rgba(0,157,255,0.35), rgba(255,255,255,0.05))",
            }}
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : undefined}
            transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
          />
        </div>

        <div className="grid gap-10 pt-8 md:grid-cols-3">
          {steps.map((step, index) => {
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 14 }}
                animate={isInView ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.5, delay: 0.35 + index * 0.15 }}
                className="relative flex flex-col items-center text-center"
              >
                <span
                  className="pointer-events-none absolute -top-8 select-none text-6xl font-black"
                  style={{ color: "rgba(255,255,255,0.05)" }}
                >
                  0{index + 1}
                </span>

                <h3 className="relative z-10 text-2xl font-bold text-white sm:text-[26px]">{step.title}</h3>
                <p className="relative z-10 mt-3 max-w-sm text-base leading-relaxed text-white/60 sm:text-lg">
                  {step.description}
                </p>
                <p className="relative z-10 mt-5 text-xs font-semibold uppercase tracking-wider text-white/35">
                  {step.caption}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
