"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, TimerReset, Zap } from "lucide-react";
import type { LandingFeature } from "@/components/landing/landingFeatures";
import { LandingFeatureCard } from "@/components/landing/LandingFeatureCard";
import { cn } from "@/lib/utils";

type WhyChooseSectionProps = {
  features: LandingFeature[];
  className?: string;
};

const pillars = [
  {
    title: "Real-time",
    description: "Aggiornamenti istantanei.",
    icon: Zap,
  },
  {
    title: "Affidabile",
    description: "Flusso stabile e consistente.",
    icon: ShieldCheck,
  },
  {
    title: "Performance",
    description: "Veloce su ogni device.",
    icon: TimerReset,
  },
  {
    title: "Premium UX",
    description: "UI pulita e moderna.",
    icon: Sparkles,
  },
] as const;

export function WhyChooseSection({ features, className }: WhyChooseSectionProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="relative mx-auto max-w-3xl text-center">

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl"
        >
          Perché scegliere <span className="gradient-text">CoralMC</span>?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-5 text-pretty text-base text-white/70 sm:text-lg"
        >
          Una piattaforma pensata per competere: gestione team, bracket avanzati e un&apos;esperienza fluida dal login
          alla finale.
        </motion.p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: Math.min(index, 5) * 0.05 }}
          >
            <LandingFeatureCard feature={feature} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
