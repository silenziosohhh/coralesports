"use client";

import { useEffect, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type GridMotionBackgroundProps = {
  className?: string;
  maxMovePx?: number;
};

export function GridMotionBackground({
  className,
  maxMovePx = 300,
}: GridMotionBackgroundProps) {
  const rows = 4;
  const cols = 7;

  const mouseX = useMotionValue(0.5);
  const mouseXSpring = useSpring(mouseX, { stiffness: 120, damping: 26, mass: 0.8 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const width = window.innerWidth || 1;
      mouseX.set(Math.max(0, Math.min(1, e.clientX / width)));
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX]);

  const rowIndices = useMemo(() => Array.from({ length: rows }, (_, i) => i), [rows]);
  const colIndices = useMemo(() => Array.from({ length: cols }, (_, i) => i), [cols]);

  const xRow0 = useTransform(mouseXSpring, (v) => v * maxMovePx - maxMovePx / 2);
  const xRow1 = useTransform(mouseXSpring, (v) => -(v * maxMovePx - maxMovePx / 2));
  const xRow2 = useTransform(mouseXSpring, (v) => v * maxMovePx - maxMovePx / 2);
  const xRow3 = useTransform(mouseXSpring, (v) => -(v * maxMovePx - maxMovePx / 2));
  const xByRow = [xRow0, xRow1, xRow2, xRow3] as const;

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)} aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 20%, rgba(255,255,255,0.06) 0%, transparent 45%), radial-gradient(circle at 50% 55%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 55%, var(--bg-secondary) 100%)",
        }}
      />

      <div className="absolute inset-0" style={{ backgroundColor: "var(--bg-secondary)" }} />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative h-[150vh] w-[150vw] rotate-[-15deg] origin-center">
          <div className="grid h-full w-full grid-rows-4 gap-4">
            {rowIndices.map((rowIndex) => {
              return (
                <motion.div
                  key={rowIndex}
                  className="grid grid-cols-7 gap-4 will-change-transform"
                  style={{ x: xByRow[rowIndex] }}
                >
                  {colIndices.map((colIndex) => (
                    <div key={colIndex} className="relative">
                      <div className="h-full w-full overflow-hidden rounded-[12px] border border-white/10 bg-black/25 shadow-[0_24px_60px_rgba(0,0,0,0.25)]">
                        <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:36px_36px]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(77,206,255,0.08)_0%,transparent_55%)]" />
                      </div>
                    </div>
                  ))}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
