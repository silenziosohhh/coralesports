"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RotateCw, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiscordWave } from "@/components/landing/DiscordWave";
import { ParallaxDots } from "@/components/landing/ParallaxDots";
import { ParallaxSection } from "@/components/landing/ParallaxSection";
import { SoftParallaxBlobs } from "@/components/landing/LandingParallaxBackgrounds";
import { useI18n } from "@/lib/i18n";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="error-experience w-full max-w-full overflow-x-hidden bg-[var(--bg-primary)]">
      <ParallaxSection
        overflow="hidden"
        className="discord-join-shell relative isolate min-h-[calc(100svh-5rem)] px-4 pb-40 pt-36 sm:pb-44 sm:pt-40"
        renderBackground={(progress) => (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(87,255,255,0.2),transparent_30%),linear-gradient(115deg,#3b82f6_0%,#397ef0_52%,#2563eb_100%)]" />
            <SoftParallaxBlobs progress={progress} className="opacity-55" />
            <ParallaxDots progress={progress} className="opacity-65" dotAlpha={0.48} dotSizePx={2} gridSizePx={21} />
          </div>
        )}
      >
        <DiscordWave position="top" />
        <DiscordWave position="bottom" />

        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <header className="mx-auto max-w-6xl text-center">
            <div className="mx-auto mb-5 flex w-fit items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-[#ffd63d]">
              <ShieldAlert className="h-5 w-5" />
              500
            </div>
            <h1 className="mx-auto max-w-6xl text-balance text-[clamp(3rem,7vw,5.7rem)] font-black uppercase leading-[0.9] tracking-[-0.05em] text-white [text-shadow:4px_5px_0_rgba(0,0,0,0.24)]">
              {t("error.hero")}
            </h1>
            <p className="mx-auto mt-6 max-w-[62ch] text-pretty text-base leading-relaxed text-white/78 sm:text-xl">
              {t("error.description")}
            </p>
          </header>

          <div className="mx-auto mt-12 max-w-3xl">
            <section className="relative flex flex-col overflow-hidden rounded-[28px] border-2 border-white/20 bg-[#061b3b]/72 p-7 text-center shadow-[0_26px_70px_rgba(0,20,65,0.34)] backdrop-blur-2xl sm:p-10">
              <div aria-hidden className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#ffd63d]/18 blur-3xl" />
              <div className="relative">
                <p className="text-7xl font-black leading-none tracking-[-0.07em] text-white/14 sm:text-8xl">500</p>
                <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white">{t("error.title")}</h2>
                <p className="mt-4 text-base leading-relaxed text-white/68">{t("error.support")}</p>
                {error.digest ? (
                  <p className="mt-5 font-mono text-xs text-white/42">ID: {error.digest}</p>
                ) : null}
              </div>

              <div className="relative mx-auto mt-8 grid w-full max-w-xl gap-3 sm:grid-cols-2">
                <Button
                  size="lg"
                  onClick={reset}
                  className="min-h-[4rem] w-full gap-3 rounded-[14px] border-[5px] border-[#007fda] bg-[#0bb5ff] text-base font-black text-[#00152b] shadow-[0_10px_0_rgba(0,66,132,0.45)] hover:bg-[#22c0ff]"
                >
                  <RotateCw className="h-5 w-5" />
                  {t("error.retry")}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="min-h-[3.5rem] w-full gap-3 rounded-[14px] border-2 border-white/25 bg-white/[0.06] text-base font-black text-white hover:bg-white/12 hover:text-white"
                >
                  <Link href="/">
                    <Home className="h-5 w-5" />
                    {t("error.home")}
                  </Link>
                </Button>
              </div>
            </section>

          </div>
        </div>
      </ParallaxSection>
    </main>
  );
}
