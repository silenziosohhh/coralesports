"use client";

import { cn } from "@/lib/utils";
import { WaveDivider } from "@/components/landing/WaveDivider";

type WavyEdgeProps = {
  className?: string;
  position: "top" | "bottom";
  mode?: "cutout" | "fill";
  fillClassName?: string;
  borderClassName?: string;
  borderOffsetClassName?: string;
  heightClassName?: string;
  flipY?: boolean;
};

export function WavyEdge({
  className,
  position,
  mode = "cutout",
  fillClassName,
  borderClassName,
  borderOffsetClassName,
  heightClassName,
  flipY,
}: WavyEdgeProps) {
  const isTop = position === "top";
  const resolvedFlipY = flipY ?? isTop;

  const resolvedFillClassName = fillClassName ?? (mode === "fill" ? "text-[#2563eb]" : "text-[var(--bg-primary)]");
  const resolvedBorderClassName = borderClassName ?? (mode === "fill" ? "text-[#1e40af]" : "text-[#072434]");
  const resolvedBorderOffsetClassName = borderOffsetClassName ?? (isTop ? "translate-y-[12px]" : "-translate-y-[12px]");
  const resolvedHeightClassName = heightClassName ?? "h-24 sm:h-28 md:h-32";

  return (
    <div
      className={cn(
        "pointer-events-none absolute left-0 right-0 z-40",
        isTop ? "top-0" : "bottom-0",
        className,
      )}
    >
      <WaveDivider
        className={cn(
          isTop ? "-top-px" : "-bottom-px",
          resolvedBorderClassName,
          resolvedBorderOffsetClassName,
        )}
        flipY={resolvedFlipY}
        heightClassName={resolvedHeightClassName}
      />
      <WaveDivider
        className={cn(isTop ? "-top-px" : "-bottom-px", resolvedFillClassName)}
        flipY={resolvedFlipY}
        heightClassName={resolvedHeightClassName}
      />
    </div>
  );
}
