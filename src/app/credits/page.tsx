"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Code2,
  Database,
  ExternalLink,
  MonitorSmartphone,
  Palette,
  ServerCog,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiscordWave } from "@/components/landing/DiscordWave";
import { ParallaxDots } from "@/components/landing/ParallaxDots";
import { ParallaxSection } from "@/components/landing/ParallaxSection";
import { SoftParallaxBlobs } from "@/components/landing/LandingParallaxBackgrounds";

const creators = [
  {
    name: "Sildev",
    minecraftName: "Silenziosoh",
    avatar: "https://avyra-skin-api.vercel.app/api/avatar/Silenziosoh?size=512",
    role: "Backend development",
    description:
      "Ha sviluppato il backend di CoralMC eSpots, occupandosi della logica, dei dati e delle integrazioni che fanno funzionare la piattaforma.",
    portfolio: "https://sildev.dev",
    buttonLabel: "Apri il portfolio di Sildev",
    variant: "cyan" as const,
    buttonOffset: "top-4",
    accent: "#57ffff",
    contributions: [
      { icon: ServerCog, label: "Backend e logica server" },
      { icon: Database, label: "Dati e persistenza" },
      { icon: Code2, label: "API e integrazioni" },
    ],
  },
  {
    name: "MrJak3s",
    minecraftName: "MrJak3s",
    avatar: "https://avyra-skin-api.vercel.app/api/avatar/MrJak3s?size=512",
    role: "Frontend development",
    description:
      "Ha realizzato il frontend di CoralMC eSpots, costruendo l’interfaccia, lo stile responsive e le animazioni visibili in tutto il sito.",
    portfolio: "https://mrjak3s.vercel.app/",
    buttonLabel: "Apri il portfolio di MrJak3s",
    variant: "discord" as const,
    buttonOffset: "top-2",
    accent: "#ffd63d",
    contributions: [
      { icon: Palette, label: "Interfaccia e stile visivo" },
      { icon: MonitorSmartphone, label: "Frontend responsive" },
      { icon: Sparkles, label: "Animazioni e interazioni" },
    ],
  },
];

export default function CreditsPage() {
  return (
    <main className="w-full max-w-full overflow-x-hidden">
      <ParallaxSection
        overflow="hidden"
        className="discord-join-shell relative isolate min-h-[calc(100vh-5rem)] px-4 py-40 sm:py-44"
        renderBackground={(progress) => (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(87,255,255,0.18),transparent_30%),linear-gradient(115deg,#3b82f6_0%,#397ef0_52%,#2563eb_100%)]" />
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

        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-5xl text-center"
          >
            <h1 className="text-balance text-[clamp(2.7rem,7vw,5.5rem)] font-black uppercase leading-[0.92] tracking-[-0.045em] text-white [text-shadow:4px_5px_0_rgba(0,0,0,0.24)]">
              Le persone dietro il sito di CoralMC eSpots
            </h1>
            <p className="mx-auto mt-6 max-w-[62ch] text-pretty text-lg leading-relaxed text-white/78 sm:text-xl">
              Due competenze diverse, una sola identità. Scopri chi ha costruito ogni parte del progetto e scegli
              quale portfolio visitare.
            </p>
          </motion.div>

          <div className="mt-14 grid grid-flow-dense gap-6 md:grid-cols-2">
            {creators.map((creator, index) => {
              return (
                <motion.article
                  key={creator.name}
                  initial={{ opacity: 0, scale: 0.94, y: 34 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.62, delay: 0.14 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -8 }}
                  className="group relative flex min-h-[570px] flex-col overflow-hidden rounded-[28px] border-2 border-white/20 bg-[#061b3b]/68 p-7 shadow-[0_26px_70px_rgba(0,20,65,0.34)] backdrop-blur-2xl sm:p-9"
                >
                  <div className="relative flex h-full flex-col">
                    <div
                      className="relative h-24 w-24 overflow-hidden rounded-2xl border-[3px] bg-[#06162c] shadow-[0_12px_30px_rgba(0,0,0,0.28)]"
                      style={{ borderColor: creator.accent }}
                    >
                      <Image
                        src={creator.avatar}
                        alt={`Testa Minecraft di ${creator.minecraftName}`}
                        fill
                        sizes="96px"
                        className="object-cover [image-rendering:pixelated]"
                      />
                    </div>

                    <h2 className="mt-7 text-4xl font-black uppercase tracking-[-0.03em] text-white sm:text-5xl">
                      {creator.name}
                    </h2>
                    <p className="mt-2 font-bold uppercase tracking-[0.14em]" style={{ color: creator.accent }}>
                      {creator.role}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white/48">Minecraft: {creator.minecraftName}</p>
                    <p className="mt-5 text-base leading-relaxed text-white/68 sm:text-lg">{creator.description}</p>

                    <ul className="mt-7 space-y-3">
                      {creator.contributions.map(({ icon: ContributionIcon, label }) => (
                        <li key={label} className="flex items-center gap-3 text-sm font-semibold text-white/86 sm:text-base">
                          <span
                            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[0.06]"
                            style={{ color: creator.accent }}
                          >
                            <ContributionIcon className="h-4 w-4" />
                          </span>
                          <span>{label}</span>
                          <Check className="ml-auto h-4 w-4 text-white/30" />
                        </li>
                      ))}
                    </ul>

                    <Button
                      asChild
                      variant={creator.variant}
                      size="lg"
                      className={`mt-auto min-h-[4.25rem] w-full gap-3 rounded-[14px] border-[5px] px-5 text-base font-extrabold sm:text-lg [&_svg]:h-5 [&_svg]:w-5 ${creator.buttonOffset}`}
                    >
                      <a href={creator.portfolio} target="_blank" rel="noreferrer">
                        {creator.buttonLabel}
                        <ExternalLink />
                      </a>
                    </Button>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-white/70 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Torna alla home
            </Link>
          </div>
        </div>
      </ParallaxSection>
    </main>
  );
}
