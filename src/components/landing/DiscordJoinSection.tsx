"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ParallaxSection } from "@/components/landing/ParallaxSection";
import { SoftParallaxBlobs } from "@/components/landing/LandingParallaxBackgrounds";
import { ParallaxDots } from "@/components/landing/ParallaxDots";
import { WavyEdge } from "@/components/landing/WavyEdge";
import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

type DiscordJoinSectionProps = {
  className?: string;
  title?: string;
  description?: ReactNode;
  buttonLabel?: string;
  onClick?: () => void;
  href?: string;
  icon?: ReactNode;
  showImage?: boolean;
  imageSrc?: string;
  imageAlt?: string;
};

export function DiscordJoinSection({
  className,
  title = "JOIN OUR DISCORD",
  description = (
    <>
      Entra nella community Discord, chatta con altri giocatori, ricevi aggiornamenti in tempo reale e supporto
      dallo staff.
    </>
  ),
  buttonLabel = "Join Discord",
  onClick,
  href,
  icon,
  showImage = true,
  imageSrc = "/discord.png",
  imageAlt = "Discord",
}: DiscordJoinSectionProps) {
  const isInternalHref = Boolean(href && href.startsWith("/"));

  return (
    <ParallaxSection
      className={cn("relative py-32 sm:py-40", className)}
      renderBackground={(progress) => (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#3b82f6]" />
          <SoftParallaxBlobs progress={progress} className="opacity-70" />
          <ParallaxDots
            progress={progress}
            fromOpacity={0.3}
            toOpacity={0.18}
            dotAlpha={0.42}
            className="mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-black/20" />
          <WavyEdge position="top" />
          <WavyEdge position="bottom" />
        </div>
      )}
    >
      <div className="container relative mx-auto grid items-center gap-12 px-4 md:grid-cols-2">
        {showImage ? (
          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                priority={false}
                className="object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.45)]"
              />
            </div>
          </div>
        ) : (
          <div />
        )}

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-3 text-sm font-semibold tracking-widest text-white/90">
            {icon ? <span className="grid h-8 w-8 place-items-center">{icon}</span> : null}
            {title}
          </div>
          <p className="mb-8 max-w-xl text-pretty text-lg leading-relaxed text-white/85">{description}</p>

          <div className="flex">
            {href ? (
              <Button
                asChild
                size="lg"
                variant="discord"
                className="h-14 w-full max-w-md gap-3 rounded-xl text-base font-bold shadow-2xl shadow-black/30"
              >
                {isInternalHref ? (
                  <Link href={href} className="flex items-center justify-center gap-3">
                    {icon}
                    {buttonLabel}
                  </Link>
                ) : (
                  <a href={href} className="flex items-center justify-center gap-3">
                    {icon}
                    {buttonLabel}
                  </a>
                )}
              </Button>
            ) : (
              <Button
                size="lg"
                variant="discord"
                className="h-14 w-full max-w-md gap-3 rounded-xl text-base font-bold shadow-2xl shadow-black/30"
                onClick={onClick}
                type="button"
              >
                {icon}
                {buttonLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </ParallaxSection>
  );
}
