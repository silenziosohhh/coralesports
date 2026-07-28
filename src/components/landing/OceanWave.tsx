"use client";

import { cn } from "@/lib/utils";

/**
 * OceanWave – animated CSS wave divider.
 * Replaces the static linear-gradient fade at the bottom of the hero section.
 * The wave fill colour matches --bg-primary (hsl 216 100% 6.3% ≈ #000d20).
 */
export function OceanWave({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "ocean pointer-events-none absolute bottom-0 left-0 right-0 z-20",
        className,
      )}
    >
      <div className="wave" />
      <div className="wave wave--slow" />
    </div>
  );
}
