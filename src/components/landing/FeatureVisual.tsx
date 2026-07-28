"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { LandingFeature } from "@/components/landing/landingFeatures";
import { cn } from "@/lib/utils";

export function FeatureVisual({
  feature,
  className,
  centerContent,
}: {
  feature: LandingFeature;
  className?: string;
  centerContent?: ReactNode;
}) {
  const Icon = feature.icon;

  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.02] shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:aspect-[16/11]",
        className,
      )}
    >
      <div
        className="absolute -right-16 -top-16 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: feature.color, opacity: 0.22 }}
      />
      <div
        className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full blur-3xl"
        style={{ backgroundColor: feature.color, opacity: 0.12 }}
      />

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <Icon
        className="absolute -bottom-8 -right-8 h-48 w-48"
        style={{ color: feature.color, opacity: 0.07 }}
        strokeWidth={1.2}
      />

      <motion.div
        className="absolute h-3 w-3 rounded-full blur-[2px]"
        style={{ backgroundColor: feature.color, top: "18%", left: "16%" }}
        animate={{ y: [0, -10, 0], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute h-2 w-2 rounded-full blur-[1px]"
        style={{ backgroundColor: feature.color, bottom: "22%", right: "20%" }}
        animate={{ y: [0, 10, 0], opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      <div className="relative flex h-full items-center justify-center">
        {centerContent ?? (
          <div
            className="flex h-28 w-28 items-center justify-center rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] sm:h-32 sm:w-32"
            style={{
              background: `linear-gradient(135deg, ${feature.color}, color-mix(in srgb, ${feature.color} 42%, #ffffff))`,
            }}
          >
            <Icon className="h-14 w-14 text-white sm:h-16 sm:w-16" strokeWidth={1.6} />
          </div>
        )}
      </div>
    </div>
  );
}
