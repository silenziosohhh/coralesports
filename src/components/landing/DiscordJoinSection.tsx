"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ParallaxSection } from "@/components/landing/ParallaxSection";
import { DiscordWave } from "@/components/landing/DiscordWave";
import { motion } from "framer-motion";
import { useStillAfterHydration } from "@/components/ui/reveal";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

const ENTER_EASE = [0.16, 1, 0.3, 1] as const;
const ENTER_VIEWPORT = { once: false, margin: "-80px" } as const;

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
  title = "UNISCITI AL NOSTRO DISCORD",
  description = (
    <>
      Entra a far parte della nostra community Discord! Chatta con altri giocatori, ricevi aggiornamenti in tempo
      reale, partecipa agli eventi esclusivi e ottieni supporto rapido dal nostro staff.
    </>
  ),
  buttonLabel = "Unisciti al Discord",
  onClick,
  href,
  icon,
  showImage = true,
  imageSrc = "/discord.png",
  imageAlt = "Discord",
}: DiscordJoinSectionProps) {
  const isInternalHref = Boolean(href && href.startsWith("/"));
  const still = useStillAfterHydration();
  const enterFrom = (x: number) => ({ opacity: 0, x });

  return (
    <ParallaxSection
      overflow="visible"
      className={cn("discord-join-shell relative z-[2] py-32 sm:py-40", className)}
      renderBackground={() => (
        <>
          <div className="discord-join-dots absolute inset-0" />
          <div aria-hidden className="discord-join-shapes absolute inset-0">
            <span className="absolute right-[16%] top-[25%] h-4 w-4 rounded-full bg-white/20" />
            <span className="absolute right-[8%] top-[34%] h-7 w-7 rotate-12 border border-white/15" />
            <span className="absolute right-[17%] top-[51%] h-4 w-4 rotate-45 border border-white/10" />
            <span className="absolute right-[5%] top-[67%] h-5 w-5 rounded-full bg-[#b5b7ff]/35" />
          </div>
        </>
      )}
    >
      <DiscordWave position="top" />
      <DiscordWave position="bottom" />

      <div className="container relative z-[2] mx-auto grid items-center gap-10 px-4 md:grid-cols-2 md:gap-12">
        {showImage ? (
          <motion.div
            className="relative mx-auto w-full max-w-[520px]"
            initial={enterFrom(-64)}
            whileInView={{ opacity: 1, x: 0 }}
            animate={still ? { opacity: 1, x: 0 } : undefined}
            viewport={ENTER_VIEWPORT}
            transition={still ? { duration: 0 } : { duration: 0.7, ease: ENTER_EASE }}
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                priority={false}
                className="scale-[1.15] object-contain drop-shadow-[0_26px_40px_rgba(0,0,0,0.45)] [image-rendering:pixelated] 2xl:scale-[1.28]"
              />
            </div>
          </motion.div>
        ) : (
          <div />
        )}

        <motion.div
          className="relative text-center md:text-left"
          initial={enterFrom(64)}
          whileInView={{ opacity: 1, x: 0 }}
          animate={still ? { opacity: 1, x: 0 } : undefined}
          viewport={ENTER_VIEWPORT}
          transition={still ? { duration: 0 } : { duration: 0.7, delay: 0.1, ease: ENTER_EASE }}
        >
          <div className="mb-4 inline-flex items-center gap-3 text-white">
            {icon ? <span className="grid h-9 w-9 shrink-0 place-items-center 2xl:h-10 2xl:w-10 [&_svg]:h-8 [&_svg]:w-8 2xl:[&_svg]:h-9 2xl:[&_svg]:w-9">{icon}</span> : null}
            <h2 className="text-balance text-[clamp(1.5rem,2.7vw,2.15rem)] font-extrabold uppercase leading-tight tracking-[-0.01em] [text-shadow:2px_3px_0_rgba(0,0,0,0.28)] 2xl:text-[2.4rem]">
              {title}
            </h2>
          </div>
          <p className="mx-auto mb-8 max-w-[52ch] text-pretty text-xl leading-[1.6] text-white/90 [text-shadow:1px_1px_0_rgba(0,0,0,0.2)] md:mx-0 2xl:text-[1.375rem]">
            {description}
          </p>

          <div className="flex justify-center md:justify-start">
            {href ? (
              <Button
                asChild
                size="lg"
                variant="discord"
                className="h-auto min-h-[4.75rem] w-full max-w-[560px] gap-3 rounded-[14px] border-[5px] px-8 py-5 text-[1.375rem] font-extrabold 2xl:min-h-[5.5rem] 2xl:max-w-[620px] 2xl:px-10 2xl:py-6 2xl:text-2xl [&_svg]:h-7 [&_svg]:w-7 2xl:[&_svg]:h-8 2xl:[&_svg]:w-8"
              >
                {isInternalHref ? (
                  <Link href={href} className="flex items-center justify-center gap-3">
                    {icon}
                    {buttonLabel}
                  </Link>
                ) : (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-3"
                  >
                    {icon}
                    {buttonLabel}
                  </a>
                )}
              </Button>
            ) : (
              <Button
                size="lg"
                variant="discord"
                className="h-auto min-h-[4.75rem] w-full max-w-[560px] gap-3 rounded-[14px] border-[5px] px-8 py-5 text-[1.375rem] font-extrabold 2xl:min-h-[5.5rem] 2xl:max-w-[620px] 2xl:px-10 2xl:py-6 2xl:text-2xl [&_svg]:h-7 [&_svg]:w-7 2xl:[&_svg]:h-8 2xl:[&_svg]:w-8"
                onClick={onClick}
                type="button"
              >
                {icon}
                {buttonLabel}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </ParallaxSection>
  );
}
