"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { DiscordWave } from "@/components/landing/DiscordWave";
import { ParallaxDots } from "@/components/landing/ParallaxDots";
import { ParallaxSection } from "@/components/landing/ParallaxSection";
import { SoftParallaxBlobs } from "@/components/landing/LandingParallaxBackgrounds";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Metric = {
  label: string;
  value: string | number;
};

const REVEAL_FROM: Record<string, gsap.TweenVars> = {
  up: { y: 48 },
  down: { y: -48 },
  left: { x: -72 },
  right: { x: 72 },
  zoom: { scale: 0.94 },
};

type CompetitionPageShellProps = {
  eyebrow: string;
  title: string;
  accent?: string;
  description: string;
  metrics?: [Metric, Metric, Metric];
  contentTitle?: string;
  contentDescription?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function CompetitionPageShell({
  eyebrow,
  title,
  accent,
  description,
  metrics,
  contentTitle,
  contentDescription,
  action,
  children,
  className,
}: CompetitionPageShellProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        "[data-competition-hero-copy] > *",
        { opacity: 0, y: 34, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.12,
          clearProps: "filter,transform",
        },
      );

      gsap.fromTo(
        "[data-competition-heading] > *",
        { opacity: 0, x: -48 },
        {
          opacity: 1,
          x: 0,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.1,
          clearProps: "transform",
          scrollTrigger: { trigger: "[data-competition-intro]", start: "top 90%", once: true },
        },
      );
      gsap.fromTo(
        "[data-competition-metric]",
        { opacity: 0, x: 56 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.09,
          clearProps: "transform",
          scrollTrigger: { trigger: "[data-competition-intro]", start: "top 90%", once: true },
        },
      );

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        const from = REVEAL_FROM[element.dataset.reveal || "up"] ?? REVEAL_FROM.up;
        gsap.fromTo(
          element,
          { opacity: 0, ...from },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            delay: Number(element.dataset.revealDelay) || 0,
            clearProps: "transform",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          },
        );
      });

      const cards = gsap.utils
        .toArray<HTMLElement>("[data-competition-content] article")
        .filter((card) => !card.closest("[data-reveal]"));
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 48, scale: 0.955, zIndex: index + 1 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              once: true,
            },
          },
        );
      });

      const media = gsap.matchMedia();
      media.add("(min-width: 1024px)", () => {
        const intro = root.current?.querySelector<HTMLElement>("[data-competition-intro]");
        const heading = root.current?.querySelector<HTMLElement>("[data-competition-heading]");
        if (!intro || !heading) return;

        ScrollTrigger.create({
          trigger: intro,
          start: "top 104px",
          end: "bottom top+=180",
          pin: heading,
          pinSpacing: false,
        });
      });

      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <main
      ref={root}
      className={cn(
        "competition-type relative w-full max-w-full overflow-x-hidden bg-[var(--bg-primary)]",
        className,
      )}
    >
      <ParallaxSection
        overflow="hidden"
        className="discord-join-shell relative isolate min-h-[calc(100vh-5rem)] px-4 pb-40 pt-36 sm:pb-44 sm:pt-40"
        renderBackground={(progress) => (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(87,255,255,0.2),transparent_28%),linear-gradient(115deg,#3b82f6_0%,#397ef0_52%,#2563eb_100%)]" />
            <SoftParallaxBlobs progress={progress} className="opacity-55" />
            <ParallaxDots progress={progress} className="opacity-65" dotAlpha={0.48} dotSizePx={2} gridSizePx={21} />
          </div>
        )}
      >
        <DiscordWave position="top" />
        <DiscordWave position="bottom" />

        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <header data-competition-hero-copy className="mx-auto max-w-6xl text-center">
            <p className="mb-5 text-xs font-black uppercase tracking-[0.24em] text-white/68 sm:text-sm">
              {eyebrow}
            </p>
            <h1 className="mx-auto max-w-6xl text-balance text-[clamp(3rem,7vw,5.7rem)] font-black uppercase leading-[0.9] tracking-[-0.05em] text-white [text-shadow:4px_5px_0_rgba(0,0,0,0.24)]">
              {title}
              {accent ? <span className="text-[#57ffff]"> {accent}</span> : null}
            </h1>
            <p className="mx-auto mt-6 max-w-[62ch] text-pretty text-base leading-relaxed text-white/78 sm:text-xl">
              {description}
            </p>
            {action ? <div className="mt-8 flex flex-wrap justify-center gap-3">{action}</div> : null}
          </header>

          {contentTitle || metrics ? (
            <section
              data-competition-intro
              className="relative mt-12 overflow-hidden rounded-[28px] border-2 border-white/20 bg-[#061b3b]/68 p-6 shadow-[0_26px_70px_rgba(0,20,65,0.34)] backdrop-blur-2xl sm:p-8"
            >
              <div aria-hidden className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-[#57ffff]/20 blur-3xl" />
              <div
                className={cn(
                  "relative grid gap-7 lg:items-center",
                  contentTitle && metrics ? "lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]" : null,
                )}
              >
                {contentTitle ? (
                  <div data-competition-heading>
                    <h2 className="max-w-xl text-3xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-4xl">
                      {contentTitle}
                    </h2>
                    {contentDescription ? (
                      <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/68 sm:text-base">
                        {contentDescription}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {metrics ? (
                  <div className="grid grid-flow-dense grid-cols-3 gap-2 sm:gap-3">
                    {metrics.map((metric) => (
                      <div key={metric.label} data-competition-metric className="min-w-0 rounded-2xl border border-white/14 bg-white/[0.075] px-3 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-transform duration-300 hover:-translate-y-1 sm:px-5 sm:py-5">
                        <div className="truncate text-2xl font-black tracking-[-0.04em] text-white sm:text-4xl">
                          {metric.value}
                        </div>
                        <div className="mt-1 truncate text-[9px] font-black uppercase tracking-[0.13em] text-white/62 sm:text-xs">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}

          <section data-competition-content className={cn("min-w-0", contentTitle || metrics ? "mt-8" : "mt-12")}>
            {children}
          </section>
        </div>
      </ParallaxSection>
    </main>
  );
}
