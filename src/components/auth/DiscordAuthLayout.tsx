"use client";

import { cn } from "@/lib/utils";
import { WavyEdge } from "@/components/landing/WavyEdge";
import { ReactNode } from "react";
import { ParallaxSection } from "@/components/landing/ParallaxSection";
import { SoftParallaxBlobs } from "@/components/landing/LandingParallaxBackgrounds";
import { ParallaxDots } from "@/components/landing/ParallaxDots";

type DiscordAuthLayoutProps = {
  className?: string;
  children: ReactNode;
};

export function DiscordAuthLayout({ className, children }: DiscordAuthLayoutProps) {
  return (
    <ParallaxSection
      overflow="hidden"
      className={cn(
        "relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bg-primary)] px-4 py-16",
        className,
      )}
      renderBackground={(progress) => (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#3b82f6]" />
          <SoftParallaxBlobs progress={progress} className="opacity-70" />
          <ParallaxDots progress={progress} />
          <div className="absolute inset-0 bg-black/25" />
          <WavyEdge position="top" />
          <WavyEdge position="bottom" />
        </div>
      )}
    >
      <div className="relative w-full">{children}</div>
    </ParallaxSection>
  );
}
