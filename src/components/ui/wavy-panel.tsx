"use client";

import { useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";


function wave(
  from: [number, number],
  to: [number, number],
  bulge: number,
  axis: "x" | "y",
) {
  const midX = (from[0] + to[0]) / 2;
  const midY = (from[1] + to[1]) / 2;
  const controlX = axis === "y" ? midX + bulge * 2 : midX;
  const controlY = axis === "x" ? midY + bulge * 2 : midY;
  return `Q ${controlX.toFixed(2)} ${controlY.toFixed(2)} ${to[0].toFixed(2)} ${to[1].toFixed(2)}`;
}

function buildWavyPath(width: number, height: number, amplitude: number, wavelength: number) {
  const a = amplitude;
  const left = a;
  const right = width - a;
  const top = a;
  const bottom = height - a;

  const countFor = (length: number) => Math.max(2, Math.round(length / wavelength / 2) * 2);
  const horizontalWaves = countFor(right - left);
  const verticalWaves = countFor(bottom - top);
  const stepX = (right - left) / horizontalWaves;
  const stepY = (bottom - top) / verticalWaves;

  const segments: string[] = [`M ${left.toFixed(2)} ${top.toFixed(2)}`];

  for (let i = 0; i < horizontalWaves; i += 1) {
    const x0 = left + stepX * i;
    const x1 = x0 + stepX;
    segments.push(wave([x0, top], [x1, top], i % 2 === 0 ? -a : a, "x"));
  }
  for (let i = 0; i < verticalWaves; i += 1) {
    const y0 = top + stepY * i;
    const y1 = y0 + stepY;
    segments.push(wave([right, y0], [right, y1], i % 2 === 0 ? a : -a, "y"));
  }
  for (let i = 0; i < horizontalWaves; i += 1) {
    const x0 = right - stepX * i;
    const x1 = x0 - stepX;
    segments.push(wave([x0, bottom], [x1, bottom], i % 2 === 0 ? a : -a, "x"));
  }
  for (let i = 0; i < verticalWaves; i += 1) {
    const y0 = bottom - stepY * i;
    const y1 = y0 - stepY;
    segments.push(wave([left, y0], [left, y1], i % 2 === 0 ? -a : a, "y"));
  }

  segments.push("Z");
  return segments.join(" ");
}

export function WavyPanel({
  children,
  className,
  contentClassName,
  fill = "rgba(4,18,42,0.88)",
  fillGradient,
  stroke = "rgba(255,255,255,0.22)",
  strokeWidth = 2,
  innerStroke,
  innerInset = 7,
  amplitude = 7,
  wavelength = 46,
  glow,
  style,
}: {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  fill?: string;
  fillGradient?: [string, string];
  stroke?: string;
  strokeWidth?: number;
  innerStroke?: string;
  innerInset?: number;
  amplitude?: number;
  wavelength?: number;
  glow?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const gradientId = `wavy-${useId().replace(/:/g, "")}`;

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    const measure = () => {
      const rect = node.getBoundingClientRect();
      setSize({ width: Math.round(rect.width), height: Math.round(rect.height) });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const ready = size.width > 0 && size.height > 0;
  const path = ready ? buildWavyPath(size.width, size.height, amplitude, wavelength) : "";
  const innerTransform =
    ready && innerStroke
      ? `translate(${innerInset} ${innerInset}) scale(${
          (size.width - innerInset * 2) / size.width
        } ${(size.height - innerInset * 2) / size.height})`
      : "";

  return (
    <div ref={ref} className={cn("relative", className)} style={style}>
      {ready ? (
        <svg
          aria-hidden
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          className="absolute inset-0 h-full w-full"
          style={glow ? { filter: `drop-shadow(0 10px 26px ${glow})` } : undefined}
        >
          {fillGradient ? (
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={fillGradient[0]} />
                <stop offset="100%" stopColor={fillGradient[1]} />
              </linearGradient>
            </defs>
          ) : null}
          <path
            d={path}
            fill={fillGradient ? `url(#${gradientId})` : fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          {innerStroke ? (
            <g transform={innerTransform}>
              <path
                d={path}
                fill="none"
                stroke={innerStroke}
                strokeWidth={1}
                strokeLinejoin="round"
              />
            </g>
          ) : null}
        </svg>
      ) : null}
      <div className={cn("relative", contentClassName)}>{children}</div>
    </div>
  );
}
