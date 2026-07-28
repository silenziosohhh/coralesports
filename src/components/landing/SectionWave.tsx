"use client";

import { cn } from "@/lib/utils";

/**
 * Separatore decorativo a onda (tema Coral/mare) tra una sezione e l'altra.
 * Linea ondulata con gradient stroke che sfuma ai bordi: leggibile anche su
 * sfondo uniforme, dove un'onda "piena" non si distinguerebbe.
 */
export function SectionWave({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("relative flex justify-center py-6 sm:py-8", className)}>
      <svg
        className="section-wave h-8 w-full max-w-4xl opacity-70"
        viewBox="0 0 1200 40"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="section-wave-gradient" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--color-accent)" stopOpacity="0" />
            <stop offset="0.5" stopColor="var(--color-accent)" stopOpacity="0.9" />
            <stop offset="1" stopColor="var(--color-secondary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 20 C 75 4, 150 4, 225 20 S 375 36, 450 20 S 600 4, 675 20 S 825 36, 900 20 S 1050 4, 1125 20 S 1200 20, 1200 20"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
