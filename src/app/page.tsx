"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trophy, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ParallaxSection } from "@/components/landing/ParallaxSection";
import {
  HeroParallaxBackdrop,
  SoftParallaxBlobs,
  VideoParallaxBackdrop,
} from "@/components/landing/LandingParallaxBackgrounds";
import { WavyEdge } from "@/components/landing/WavyEdge";
import { DiscordJoinSection } from "@/components/landing/DiscordJoinSection";
import { FaDiscord } from "react-icons/fa";
import { landingFeatures } from "@/components/landing/landingFeatures";
import { LandingFeatureCard } from "@/components/landing/LandingFeatureCard";
import { WhyChooseSection } from "@/components/landing/WhyChooseSection";

export default function HomePage() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <ParallaxSection
        className="min-h-[100svh] flex flex-col bg-[var(--bg-primary)] items-center justify-center px-4 py-20 sm:py-24"
        renderBackground={(progress) => <HeroParallaxBackdrop progress={progress} />}
      >
        <div
          className={`container relative mx-auto text-center transition-all duration-1000 z-10 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="relative mb-10 flex flex-col items-center justify-center gap-6 sm:mb-12 sm:flex-row">
            <div className="relative h-[150px] w-[150px] flex-shrink-0">
              <Image
                src="/logo.png"
                alt="CoralMC"
                width={150}
                height={150}
                sizes="150px"
                className="rounded-full shadow-2xl shadow-[var(--color-accent)]/50"
                priority
              />
            </div>
          </div>
          
          <p className="mb-10 max-w-3xl mx-auto text-pretty text-base leading-relaxed text-gray-300 sm:mb-12 sm:text-lg md:text-2xl">
            Entra nell&apos;arena competitiva più avanzata di Minecraft. 
            <span className="text-[var(--color-accent)] font-semibold"> Crea team</span>, 
            <span className="text-[var(--color-secondary)] font-semibold"> domina i tornei</span>, 
            <span className="text-[var(--color-primary)] font-semibold"> scala le classifiche</span>.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button 
              size="lg" 
              className="group relative h-14 w-full max-w-sm overflow-hidden px-8 text-base font-bold shadow-2xl shadow-[var(--color-accent)]/50 transition-transform sm:w-auto sm:max-w-none sm:text-lg md:hover:scale-105"
              asChild
            >
              <Link href="/tournaments" className="flex items-center gap-2">
                <Trophy className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Esplora Tornei
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="flex items-center gap-2 h-14 w-full max-w-sm sm:w-auto sm:max-w-none" asChild>
              <Link href="/shop">
                <ShoppingBag className="w-5 h-5" />
                Apri Shop
              </Link>
            </Button>
          </div>
        </div>
      </ParallaxSection>

      {/* Clip Section - Background Video Between Sections */}
      <ParallaxSection
        className="relative h-[60vh] min-h-[360px] overflow-hidden sm:h-[70vh] sm:min-h-[420px] md:h-[80vh] md:min-h-[520px]"
        renderBackground={(progress) => (
          <div className="absolute inset-0">
            <VideoParallaxBackdrop
              progress={progress}
              videoId="ccx7DrhsdbQ"
              start={10}
              title="CoralMC Clip"
              overlayClassName="bg-black/55"
            />
            <WavyEdge
              position="top"
              heightClassName="h-[48px] sm:h-[56px] md:h-[64px]"
              borderClassName="text-[#072434] opacity-35"
              borderOffsetClassName="translate-y-[6px]"
              fillClassName="text-[var(--bg-primary)]"
            />
            <WavyEdge
              position="bottom"
              heightClassName="h-[48px] sm:h-[56px] md:h-[64px]"
              borderClassName="text-[#072434] opacity-35"
              borderOffsetClassName="-translate-y-[6px]"
              fillClassName="text-[var(--bg-primary)]"
            />
          </div>
        )}
      >
        <div className="relative h-full" />
      </ParallaxSection>

      {/* Features Section */}
      <ParallaxSection
        className="container mx-auto px-4 py-20 sm:py-28 md:py-32"
        renderBackground={(progress) => (
          <div className="absolute inset-0">
            <SoftParallaxBlobs progress={progress} />
          </div>
        )}
      >
        <WhyChooseSection features={landingFeatures} />
      </ParallaxSection>

      <DiscordJoinSection
        href="/auth/signin"
        title="Unisciti alla nostra community Discord"
        description={
          <>
            Entra ora nel nostro server Discord per rimanere aggiornato su tornei, eventi e novità esclusive.
            <br />
            Connettiti con altri giocatori, forma team e partecipa a discussioni dedicate. Divertiti con noi!
          </>
        }
        buttonLabel="Entra nel nostro server"
        icon={<FaDiscord className="h-5 w-5" />}
      />
    </div>
  );
}
