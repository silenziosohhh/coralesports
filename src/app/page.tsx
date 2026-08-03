"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { VideoIcon, type VideoIconHandle } from "@/components/ui/video-icon";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ParallaxSection } from "@/components/landing/ParallaxSection";
import { VideoParallaxBackdrop } from "@/components/landing/LandingParallaxBackgrounds";
import { FaDiscord } from "react-icons/fa";
import { OceanWave } from "@/components/landing/OceanWave";
import { landingFeatures } from "@/components/landing/landingFeatures";
import { landingCreators } from "@/components/landing/landingCreators";
import { LiveServerStatus } from "@/components/landing/LiveServerStatus";
import { LandingAmbientBackground } from "@/components/landing/LandingAmbientBackground";
import { Reveal } from "@/components/landing/Reveal";
import { SectionWave } from "@/components/landing/SectionWave";
import { useI18n } from "@/lib/i18n";
import { DISCORD_INVITE_URL } from "@/lib/site-links";

const TournamentChampion = dynamic(() =>
  import("@/components/landing/TournamentChampion").then((module) => module.TournamentChampion)
);
const HowItWorksSection = dynamic(() =>
  import("@/components/landing/HowItWorksSection").then((module) => module.HowItWorksSection)
);
const AnimatedStats = dynamic(() =>
  import("@/components/landing/AnimatedStats").then((module) => module.AnimatedStats)
);
const WhyChooseSection = dynamic(() =>
  import("@/components/landing/WhyChooseSection").then((module) => module.WhyChooseSection)
);
const ClipsOfTheWeekSection = dynamic(() =>
  import("@/components/landing/ClipsOfTheWeekSection").then(
    (module) => module.ClipsOfTheWeekSection
  )
);
const CreatorsSection = dynamic(() =>
  import("@/components/landing/CreatorsSection").then((module) => module.CreatorsSection)
);
const DiscordJoinSection = dynamic(() =>
  import("@/components/landing/DiscordJoinSection").then((module) => module.DiscordJoinSection)
);

export default function HomePage() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const tourneiIconRef = useRef<VideoIconHandle>(null);
  const shopIconRef = useRef<VideoIconHandle>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg-primary)]">
      <LandingAmbientBackground />
      <ParallaxSection
        className="relative min-h-[100svh] overflow-hidden bg-[var(--bg-primary)] px-4 pb-24 pt-24 sm:pb-28 sm:pt-28"
        renderBackground={(progress) => (
          <div className="absolute inset-0">
            <div className="animate-cinematic-zoom absolute inset-0 scale-[1.06]">
              <VideoParallaxBackdrop
                progress={progress}
                src="/bg/pvp-background.mp4"
                overlayClassName="bg-black/50"
              />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_left_32%,rgba(10,187,255,0.24),transparent_28%),linear-gradient(90deg,rgba(3,7,18,0.94)_0%,rgba(3,7,18,0.84)_36%,rgba(3,7,18,0.42)_64%,rgba(3,7,18,0.8)_100%)]" />
            <div className="bg-[var(--bg-primary)]/70 absolute inset-x-[-8%] bottom-[-16%] h-[34vh] min-h-[220px] rounded-[100%] blur-3xl sm:min-h-[280px] md:min-h-[360px]" />
            <div className="bg-[var(--color-accent)]/18 absolute bottom-[-10%] left-[-5%] h-48 w-48 rounded-full blur-3xl sm:h-72 sm:w-72" />
            <OceanWave />
          </div>
        )}
      >
        <div
          className={`container relative z-10 mx-auto flex min-h-[calc(100svh-3rem)] items-center transition-all duration-1000 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex w-full flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
            <div
              className={`flex w-full max-w-3xl flex-col items-start text-left transition-all duration-1000 ease-out ${
                mounted ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
              }`}
            >
              <div className="relative mb-6 h-[120px] w-[120px] flex-shrink-0 sm:mb-8 sm:h-[140px] sm:w-[140px] md:h-[150px] md:w-[150px]">
                <div
                  aria-hidden
                  className="bg-[var(--color-accent)]/30 absolute inset-0 -z-10 scale-125 rounded-full blur-3xl"
                />
                <Image
                  src="/logo.png"
                  alt="CoralMC"
                  width={150}
                  height={150}
                  sizes="150px"
                  className="object-contain drop-shadow-[0_8px_30px_rgba(10,187,255,0.35)]"
                  priority
                />
              </div>

              <h1 className="mb-6 text-5xl font-black uppercase leading-[0.95] tracking-tight text-white sm:mb-8 sm:text-6xl md:text-7xl lg:text-8xl">
                {t("hero.title1")}
                <br />
                <span className="gradient-text animate-gradient bg-[length:200%_auto]">
                  {t("hero.title2")}
                </span>
              </h1>

              <p className="mb-10 max-w-2xl text-pretty text-base leading-relaxed text-gray-200 sm:mb-12 sm:text-lg md:text-2xl">
                {t("hero.lead")}
                <span className="font-semibold text-[var(--color-accent)]">
                  {" "}
                  {t("hero.highlight1")}
                </span>
                ,
                <span className="font-semibold text-[var(--color-secondary)]">
                  {" "}
                  {t("hero.highlight2")}
                </span>
                ,
                <span className="font-semibold text-[var(--color-primary)]">
                  {" "}
                  {t("hero.highlight3")}
                </span>
                .
              </p>

              <div className="flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-center">
                <Button
                  size="lg"
                  className="shadow-[var(--color-accent)]/50 group relative h-14 w-full max-w-sm overflow-hidden px-8 text-base font-bold shadow-2xl transition-transform sm:w-auto sm:max-w-none sm:text-lg md:hover:scale-105"
                  asChild
                >
                  <Link
                    href="/tournaments"
                    className="flex items-center gap-2"
                    onMouseEnter={() => tourneiIconRef.current?.play()}
                    onMouseLeave={() => tourneiIconRef.current?.pause()}
                  >
                    <motion.span className="inline-flex" whileHover={{ scale: 1.15 }}>
                      <VideoIcon ref={tourneiIconRef} src="/icons/podium.mp4" className="h-9 w-9" />
                    </motion.span>
                    {t("hero.ctaTournaments")}
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex h-14 w-full max-w-sm items-center gap-2 sm:w-auto sm:max-w-none"
                  asChild
                >
                  <Link
                    href="/shop"
                    onMouseEnter={() => shopIconRef.current?.play()}
                    onMouseLeave={() => shopIconRef.current?.pause()}
                  >
                    <motion.span className="inline-flex" whileHover={{ scale: 1.15 }}>
                      <VideoIcon
                        ref={shopIconRef}
                        src="/icons/shopping-bag.mp4"
                        className="h-9 w-9"
                      />
                    </motion.span>
                    {t("hero.ctaShop")}
                  </Link>
                </Button>
              </div>

              <LiveServerStatus className="mt-6 sm:mt-8" />
            </div>

            <TournamentChampion
              className={`transition-all delay-300 duration-1000 ease-out ${
                mounted ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
              }`}
            />
          </div>
        </div>
      </ParallaxSection>

      <Reveal
        direction="left"
        className="relative px-4 py-10 [contain-intrinsic-size:0_640px] [content-visibility:auto] sm:py-14 md:py-20"
      >
        <div className="container mx-auto">
          <HowItWorksSection />
        </div>
      </Reveal>

      <SectionWave />

      <Reveal
        direction="up"
        scale={0.96}
        className="relative px-4 py-16 [contain-intrinsic-size:0_520px] [content-visibility:auto] sm:py-20 md:py-28"
      >
        <div className="container mx-auto">
          <AnimatedStats />
        </div>
      </Reveal>

      <SectionWave />

      <Reveal
        direction="right"
        className="relative px-4 py-10 [contain-intrinsic-size:0_760px] [content-visibility:auto] sm:py-14 md:py-20"
      >
        <div className="container mx-auto">
          <WhyChooseSection features={landingFeatures} />
        </div>
      </Reveal>

      <SectionWave />

      <Reveal
        direction="left"
        blur
        className="relative py-12 [contain-intrinsic-size:0_620px] [content-visibility:auto] sm:py-16 md:py-24"
      >
        <ClipsOfTheWeekSection />
      </Reveal>

      <SectionWave />

      <Reveal
        direction="right"
        className="relative px-4 py-12 [contain-intrinsic-size:0_700px] [content-visibility:auto] sm:py-16 md:py-24"
      >
        <div className="container mx-auto">
          <CreatorsSection creators={landingCreators} />
        </div>
      </Reveal>

      <DiscordJoinSection
        href={DISCORD_INVITE_URL}
        title={t("discord.title")}
        description={
          <>
            {t("discord.desc1")} {t("discord.desc2")}
          </>
        }
        buttonLabel={t("discord.button")}
        icon={<FaDiscord className="h-5 w-5" />}
      />
    </div>
  );
}
