"use client";

import { cn } from "@/lib/utils";
import { DiscordWave } from "@/components/landing/DiscordWave";
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
        "discord-join-shell relative isolate flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden px-4 py-36 sm:py-40 lg:py-44",
        className,
      )}
      renderBackground={(progress) => (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_36%,rgba(87,255,255,0.16),transparent_28%),linear-gradient(115deg,#3b82f6_0%,#397ef0_52%,#2563eb_100%)]" />
          <SoftParallaxBlobs progress={progress} className="opacity-55" />
          <ParallaxDots
            progress={progress}
            className="opacity-70"
            dotAlpha={0.5}
            dotSizePx={2}
            gridSizePx={21}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#06162c]/5 via-transparent to-[#06162c]/10" />
        </div>
      )}
    >
      <DiscordWave position="top" />
      <DiscordWave position="bottom" />
      <div className="relative z-10 w-full">{children}</div>
    </ParallaxSection>
  );
}
