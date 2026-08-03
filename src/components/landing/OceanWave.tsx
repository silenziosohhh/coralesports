"use client";

import { cn } from "@/lib/utils";

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
