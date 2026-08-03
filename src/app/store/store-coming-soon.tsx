"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Home, RotateCw, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiscordWave } from "@/components/landing/DiscordWave";
import { ParallaxDots } from "@/components/landing/ParallaxDots";
import { ParallaxSection } from "@/components/landing/ParallaxSection";
import { SoftParallaxBlobs } from "@/components/landing/LandingParallaxBackgrounds";
import { useI18n } from "@/lib/i18n";

gsap.registerPlugin(useGSAP);

export function StoreComingSoon() {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-store-coming-copy] > *",
        { opacity: 0, y: 34, filter: "blur(9px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.14,
          ease: "power3.out",
          clearProps: "filter,transform",
        },
      );
    },
    { scope: root },
  );

  return (
    <main
      ref={root}
      className="competition-type w-full max-w-full overflow-x-hidden bg-[var(--bg-primary)]"
    >
      <ParallaxSection
        overflow="hidden"
        className="discord-join-shell relative isolate min-h-[calc(100svh-5rem)] px-4 pb-40 pt-36 sm:pb-44 sm:pt-40"
        renderBackground={(progress) => (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(87,255,255,0.24),transparent_30%),linear-gradient(115deg,#3b82f6_0%,#397ef0_52%,#2563eb_100%)]" />
            <SoftParallaxBlobs progress={progress} className="opacity-55" />
            <ParallaxDots
              progress={progress}
              className="opacity-65"
              dotAlpha={0.48}
              dotSizePx={2}
              gridSizePx={21}
            />
          </div>
        )}
      >
        <DiscordWave position="top" />
        <DiscordWave position="bottom" />

        <section
          data-store-coming-copy
          className="relative z-10 mx-auto flex min-h-[58svh] w-full max-w-5xl flex-col items-center justify-center text-center"
        >
          <ShoppingBag
            aria-hidden="true"
            className="mb-7 h-12 w-12 text-[#57ffff] drop-shadow-[0_8px_24px_rgba(87,255,255,0.35)]"
          />
          <p className="text-sm font-black uppercase tracking-[0.22em] text-white/72">
            {t("store.comingEyebrow")}
          </p>
          <h1 className="mx-auto mt-6 max-w-5xl text-balance text-[clamp(3.2rem,7vw,6.4rem)] font-black uppercase leading-[0.88] tracking-[-0.055em] text-white [text-shadow:4px_5px_0_rgba(0,0,0,0.24)]">
            {t("store.comingTitlePre")}{" "}
            <span className="text-[#57ffff]">{t("store.comingTitleAccent")}</span>
          </h1>
          <p className="mx-auto mt-7 max-w-[62ch] text-pretty text-base leading-relaxed text-white/78 sm:text-xl">
            {t("store.comingDescription")}
          </p>

          <div className="mt-10 flex w-full max-w-xl flex-col justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              onClick={() => window.location.reload()}
              className="min-h-[4rem] flex-1 gap-3 rounded-[14px] border-[5px] border-[#007fda] bg-[#0bb5ff] text-base font-black text-[#00152b] shadow-[0_10px_0_rgba(0,66,132,0.45)] hover:bg-[#22c0ff]"
            >
              <RotateCw className="h-5 w-5" />
              {t("error.retry")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="min-h-[4rem] flex-1 gap-3 rounded-[14px] border-2 border-white/25 bg-white/[0.06] text-base font-black text-white hover:bg-white/12 hover:text-white"
            >
              <Link href="/">
                <Home className="h-5 w-5" />
                {t("error.home")}
              </Link>
            </Button>
          </div>
        </section>
      </ParallaxSection>
    </main>
  );
}
