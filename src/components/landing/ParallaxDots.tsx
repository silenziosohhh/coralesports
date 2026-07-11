"use client";

import { MotionValue, motion, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type ParallaxDotsProps = {
  progress: MotionValue<number>;
  className?: string;
  fromOpacity?: number;
  toOpacity?: number;
  dotAlpha?: number;
  dotSizePx?: number;
  gridSizePx?: number;
};

export function ParallaxDots({
  progress,
  className,
  fromOpacity = 1,
  toOpacity = 1,
  dotAlpha = 0.28,
  dotSizePx = 1,
  gridSizePx = 18,
}: ParallaxDotsProps) {
  const opacity = useTransform(progress, [0, 1], [fromOpacity, toOpacity]);
  const resolvedDotAlpha = Math.max(0, Math.min(1, dotAlpha));
  const resolvedDotSize = Math.max(1, Math.round(dotSizePx));
  const resolvedGridSize = Math.max(6, Math.round(gridSizePx));

  return (
    <motion.div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        opacity,
        backgroundImage: `radial-gradient(rgba(255,255,255,${resolvedDotAlpha}) ${resolvedDotSize}px, transparent ${resolvedDotSize}px)`,
        backgroundSize: `${resolvedGridSize}px ${resolvedGridSize}px`,
      }}
    />
  );
}
