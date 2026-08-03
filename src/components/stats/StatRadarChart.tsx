"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

gsap.registerPlugin(useGSAP);

export type RadarAxis = {
  label: string;
  value: number;
  max: number;
  inactive?: boolean;
};

const RINGS = [0.25, 0.5, 0.75, 1];

function point(cx: number, cy: number, radius: number, index: number, total: number) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius] as const;
}

function polygon(cx: number, cy: number, radius: number, total: number) {
  return Array.from({ length: total }, (_, index) => point(cx, cy, radius, index, total))
    .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");
}

export function StatRadarChart({
  axes,
  accent = "#57ffff",
  className,
  size = 300,
}: {
  axes: RadarAxis[];
  accent?: string;
  className?: string;
  size?: number;
}) {
  const { t } = useI18n();
  const ref = useRef<SVGSVGElement>(null);
  const total = axes.length;

  const width = size;
  const height = size * 0.88;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.3;

  const values = axes.map((axis) => {
    if (axis.inactive || axis.max <= 0) return 0;
    return Math.max(0.12, Math.min(1, axis.value / axis.max));
  });

  const shape = values
    .map((value, index) => {
      const [x, y] = point(cx, cy, radius * value, index, total);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg || total < 3) return;

      const grid = gsap.utils.toArray<SVGPolygonElement>("[data-radar-grid]", svg);
      const spokes = gsap.utils.toArray<SVGLineElement>("[data-radar-spoke]", svg);
      const dots = gsap.utils.toArray<SVGCircleElement>("[data-radar-dot]", svg);
      const labels = gsap.utils.toArray<SVGGElement>("[data-radar-label]", svg);
      const outline = svg.querySelector<SVGPolygonElement>("[data-radar-outline]");
      const glow = svg.querySelector<SVGPolygonElement>("[data-radar-glow]");
      const area = svg.querySelector<SVGPolygonElement>("[data-radar-area]");
      if (!outline || !glow || !area) return;

      const outlineLength = outline.getTotalLength();
      gsap.set([outline, glow], {
        opacity: 0,
        strokeDasharray: `${outlineLength} ${outlineLength}`,
        strokeDashoffset: outlineLength,
      });
      gsap.set(area, { opacity: 0, scale: 0.9, transformOrigin: "50% 50%" });
      gsap.set(grid, { opacity: 0, scale: 0.92, transformOrigin: "50% 50%" });
      gsap.set(spokes, { opacity: 0 });
      gsap.set(labels, { opacity: 0, y: 6 });
      gsap.set(dots, { attr: { r: 0 }, opacity: 0 });

      const timeline = gsap.timeline({ paused: true });
      timeline
        .to(grid, {
          opacity: 1,
          scale: 1,
          duration: 0.68,
          stagger: 0.08,
          ease: "power3.out",
        })
        .to(
          spokes,
          { opacity: 1, duration: 0.5, stagger: 0.055, ease: "power2.out" },
          "-=0.42",
        )
        .addLabel("points", "-=0.06");

      dots.forEach((dot, index) => {
        timeline.to(
          dot,
          {
            attr: { r: 4 },
            opacity: 1,
            duration: 0.42,
            ease: "power2.out",
          },
          `points+=${index * 0.26}`,
        );
      });

      const connectAt = `points+=${dots.length * 0.26 + 0.5}`;
      timeline
        .to(
          labels,
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.2, ease: "power2.out" },
          "points+=0.12",
        )
        .to(
          glow,
          { opacity: 0.3, strokeDashoffset: 0, duration: 2.25, ease: "power1.inOut" },
          connectAt,
        )
        .to(
          outline,
          { opacity: 1, strokeDashoffset: 0, duration: 2.25, ease: "power1.inOut" },
          connectAt,
        )
        .to(
          area,
          { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out" },
          `${connectAt}+=1.85`,
        )
        .to(glow, { opacity: 0.16, duration: 0.65, ease: "power2.out" }, "-=0.3");

      let wasVisible = false;
      const updateVisibility = () => {
        const rect = svg.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.92 && rect.bottom > window.innerHeight * 0.08;

        if (isVisible && !wasVisible) {
          gsap.ticker.wake();
          timeline.restart(true);
        }
        if (!isVisible && wasVisible) timeline.pause(0, true);
        wasVisible = isVisible;
      };

      window.addEventListener("scroll", updateVisibility, { passive: true });
      window.addEventListener("resize", updateVisibility);
      updateVisibility();

      return () => {
        window.removeEventListener("scroll", updateVisibility);
        window.removeEventListener("resize", updateVisibility);
        timeline.kill();
      };
    },
    { scope: ref, dependencies: [accent, shape, total], revertOnUpdate: true },
  );

  if (total < 3) return null;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("h-auto w-full", className)}
      role="img"
      aria-label={`${t("team.score.statistics")}: ${axes
        .map((axis) => `${axis.label} ${axis.inactive ? t("team.score.unavailable") : axis.value}`)
        .join(", ")}`}
    >
      {RINGS.map((ring) => (
        <polygon
          data-radar-grid
          key={ring}
          points={polygon(cx, cy, radius * ring, total)}
          fill="none"
          stroke="rgba(255,255,255,0.09)"
          strokeWidth={1}
        />
      ))}
      {axes.map((axis, index) => {
        const [x, y] = point(cx, cy, radius, index, total);
        return (
          <line
            data-radar-spoke
            key={axis.label}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />
        );
      })}

      <polygon
        data-radar-area
        points={shape}
        fill={`${accent}1f`}
        stroke="none"
      />
      <polygon
        data-radar-glow
        points={shape}
        fill="none"
        stroke={accent}
        strokeWidth={6}
        style={{ filter: "blur(4px)" }}
      />

      <polygon
        data-radar-outline
        points={shape}
        fill="none"
        stroke={accent}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />

      {values.map((value, index) => {
        const axis = axes[index];
        const [x, y] = point(cx, cy, radius * value, index, total);
        return (
          <circle
            data-radar-dot
            key={axis.label}
            cx={x}
            cy={y}
            r={4}
            fill={axis.inactive ? "#1b2836" : "#04121f"}
            stroke={axis.inactive ? "rgba(255,255,255,0.35)" : accent}
            strokeWidth={2.5}
          />
        );
      })}

      {axes.map((axis, index) => {
        const [x, y] = point(cx, cy, radius * 1.3, index, total);
        const anchor = x > cx + 6 ? "start" : x < cx - 6 ? "end" : "middle";
        return (
          <g
            data-radar-label
            key={`${axis.label}-label`}
          >
            <text
              x={x}
              y={y}
              textAnchor={anchor}
              dominantBaseline="middle"
              className="text-[11px] font-black uppercase tracking-[0.06em]"
              fill={axis.inactive ? "rgba(255,255,255,0.3)" : "#ffffff"}
            >
              {axis.label}
            </text>
            <text
              x={x}
              y={y + 13}
              textAnchor={anchor}
              dominantBaseline="middle"
              className="text-[10px] font-bold"
              fill={axis.inactive ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.45)"}
            >
              {axis.inactive ? t("team.score.inactive") : axis.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
