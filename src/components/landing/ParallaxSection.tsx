"use client";

import { cn } from "@/lib/utils";
import {
  MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { ReactNode, useMemo, useRef } from "react";

type ParallaxSectionProps = {
  className?: string;
  children: ReactNode;
  renderBackground?: (scrollYProgress: MotionValue<number>) => ReactNode;
  overflow?: "hidden" | "visible";
};

export function ParallaxSection({
  className,
  children,
  renderBackground,
  overflow = "hidden",
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const staticProgress = useMotionValue(0);
  const progress = useMemo(
    () => (prefersReducedMotion ? staticProgress : scrollYProgress),
    [prefersReducedMotion, scrollYProgress, staticProgress],
  );

  return (
    <section
      ref={sectionRef}
      className={cn("relative isolate", overflow === "hidden" ? "overflow-hidden" : "overflow-visible", className)}
    >
      {renderBackground ? (
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          {renderBackground(progress)}
        </div>
      ) : null}
      {children}
    </section>
  );
}

type ParallaxLayerProps = {
  className?: string;
  y: MotionValue<number>;
  children?: ReactNode;
};

export function ParallaxLayer({ className, y, children }: ParallaxLayerProps) {
  return (
    <motion.div
      className={cn("absolute inset-0 will-change-transform", className)}
      style={{ y }}
    >
      {children}
    </motion.div>
  );
}
