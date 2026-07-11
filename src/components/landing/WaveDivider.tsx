"use client";

import { cn } from "@/lib/utils";

type WaveDividerProps = {
  className?: string;
  flipY?: boolean;
  heightClassName?: string;
};

export function WaveDivider({ className, flipY, heightClassName }: WaveDividerProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute left-0 right-0 z-10 overflow-hidden", className)}
      style={flipY ? { transform: "scaleY(-1)" } : undefined}
    >
      <svg
        className={cn("block w-[120%] -translate-x-[10%]", heightClassName ?? "h-20 sm:h-24 md:h-28")}
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,52 C90,8 180,8 270,52 C360,96 450,96 540,52 C630,8 720,8 810,52 C900,96 990,96 1080,52 C1170,8 1260,8 1350,52 C1410,80 1440,80 1440,52 L1440,120 L0,120 Z"
        />
      </svg>
    </div>
  );
}
