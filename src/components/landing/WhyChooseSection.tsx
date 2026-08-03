"use client";

import { motion } from "framer-motion";
import type { LandingFeature } from "@/components/landing/landingFeatures";
import { FeatureVisual } from "@/components/landing/FeatureVisual";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

type WhyChooseSectionProps = {
  features: LandingFeature[];
  className?: string;
};

const featureImages: Record<LandingFeature["slug"], string> = {
  brackets: "/brackets.png",
  teams: "/gestione-team.png",
  prizes: "/premi-reali.png",
};

export function WhyChooseSection({ features, className }: WhyChooseSectionProps) {
  const { t } = useI18n();
  return (
    <div className={cn("relative", className)}>
      <div className="relative mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="inline-flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/40"
        >
          <span className="text-[var(--color-accent)]">02</span>
          <span className="h-px w-8 bg-white/20" />
          {t("why.tag")}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mt-6 text-4xl font-black uppercase tracking-tight text-white sm:text-5xl md:text-6xl"
        >
          {t("why.titlePre")} <span className="gradient-text">CoralMC</span>?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-5 text-pretty text-base text-white/70 sm:text-lg"
        >
          {t("why.subtitle")}
        </motion.p>
      </div>

      <div className="mt-8 sm:mt-12">
        {features.map((feature, index) => {
          const reversed = index % 2 === 1;
          const featureTitle = t(`feature.${feature.slug}.title`);
          const featureDesc = t(`feature.${feature.slug}.desc`);

          return (
            <div
              key={feature.title}
              className="flex min-h-[52vh] items-center py-10 md:min-h-[58vh]"
            >
              <div
                className={cn(
                  "flex w-full flex-col items-center gap-10 md:flex-row md:gap-16",
                  reversed && "md:flex-row-reverse",
                )}
              >
                <motion.div
                  initial={{ opacity: 0, x: reversed ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="w-full md:w-1/2"
                >
                  <span
                    className="text-xs font-semibold uppercase tracking-[0.3em]"
                    style={{ color: feature.color }}
                  >
                    0{index + 1}
                  </span>
                  <h3 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                    {featureTitle}
                  </h3>
                  <p className="mt-5 max-w-md text-base leading-relaxed text-white/60 sm:text-lg">
                    {featureDesc}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: reversed ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="w-full md:w-1/2"
                >
                  {featureImages[feature.slug] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={featureImages[feature.slug]}
                      alt={featureTitle}
                      className="w-full object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.5)]"
                    />
                  ) : (
                    <FeatureVisual feature={feature} />
                  )}
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
