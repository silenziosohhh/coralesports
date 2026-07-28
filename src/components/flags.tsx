"use client";

import { useId } from "react";
import type { Locale } from "@/lib/i18n";

type FlagProps = { className?: string };

/** Italy — vertical green / white / red. */
function ItFlag({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 3 2" className={className} aria-hidden preserveAspectRatio="xMidYMid slice">
      <rect width="1" height="2" x="0" fill="#009246" />
      <rect width="1" height="2" x="1" fill="#ffffff" />
      <rect width="1" height="2" x="2" fill="#CE2B37" />
    </svg>
  );
}

/** France — vertical blue / white / red. */
function FrFlag({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 3 2" className={className} aria-hidden preserveAspectRatio="xMidYMid slice">
      <rect width="1" height="2" x="0" fill="#0055A4" />
      <rect width="1" height="2" x="1" fill="#ffffff" />
      <rect width="1" height="2" x="2" fill="#EF4135" />
    </svg>
  );
}

/** Germany — horizontal black / red / gold. */
function DeFlag({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 5 3" className={className} aria-hidden preserveAspectRatio="xMidYMid slice">
      <rect width="5" height="1" y="0" fill="#000000" />
      <rect width="5" height="1" y="1" fill="#DD0000" />
      <rect width="5" height="1" y="2" fill="#FFCE00" />
    </svg>
  );
}

/** Russia — horizontal white / blue / red. */
function RuFlag({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 9 6" className={className} aria-hidden preserveAspectRatio="xMidYMid slice">
      <rect width="9" height="2" y="0" fill="#ffffff" />
      <rect width="9" height="2" y="2" fill="#0039A6" />
      <rect width="9" height="2" y="4" fill="#D52B1E" />
    </svg>
  );
}

/** United Kingdom — Union Jack. */
function GbFlag({ className }: FlagProps) {
  const id = useId();
  const s = `s-${id}`;
  const t = `t-${id}`;
  return (
    <svg viewBox="0 0 60 30" className={className} aria-hidden preserveAspectRatio="xMidYMid slice">
      <clipPath id={s}>
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id={t}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath={`url(#${s})`}>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#${t})`} stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

/** Rounded flag badge for a given locale. */
export function Flag({ code, className }: { code: Locale; className?: string }) {
  const flag =
    code === "it" ? (
      <ItFlag className="h-full w-full" />
    ) : code === "fr" ? (
      <FrFlag className="h-full w-full" />
    ) : code === "de" ? (
      <DeFlag className="h-full w-full" />
    ) : code === "ru" ? (
      <RuFlag className="h-full w-full" />
    ) : (
      <GbFlag className="h-full w-full" />
    );

  return (
    <span
      className={`inline-block overflow-hidden rounded-[3px] shadow-[0_0_0_1px_rgba(255,255,255,0.18)] ${className ?? "h-4 w-6"}`}
    >
      {flag}
    </span>
  );
}
