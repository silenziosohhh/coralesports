"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimatedNumberProps = {
  value: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  format?: boolean;
};

export function AnimatedNumber({
  value,
  duration = 1.1,
  delay = 0,
  prefix = "",
  suffix = "",
  className,
  format = false,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    setDisplay(0);
    const controls = animate(0, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });

    return () => controls.stop();
  }, [inView, value, duration, delay]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {format ? display.toLocaleString("it-IT") : display}
      {suffix}
    </span>
  );
}
