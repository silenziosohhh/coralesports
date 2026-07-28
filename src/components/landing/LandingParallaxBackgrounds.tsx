"use client";

import { cn } from "@/lib/utils";
import { MotionValue, motion, useTransform } from "framer-motion";
import { ParallaxLayer } from "./ParallaxSection";
import { GridMotionBackground } from "@/components/landing/GridMotionBackground";

type HeroParallaxBackdropProps = {
  progress: MotionValue<number>;
  className?: string;
};

export function HeroParallaxBackdrop({ progress, className }: HeroParallaxBackdropProps) {
  const bgY = useTransform(progress, [0, 1], [-80, 80]);
  const glowY = useTransform(progress, [0, 1], [-40, 40]);
  const gridY = useTransform(progress, [0, 1], [-20, 20]);

  return (
    <div className={cn("relative h-full w-full", className)}>
      <ParallaxLayer y={bgY} className="scale-110">
        <GridMotionBackground className="absolute inset-0 opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-[var(--bg-primary)]" />
      </ParallaxLayer>

      <ParallaxLayer y={gridY}>
        <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(to_right,var(--bg-primary)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(0,0,0,0)_0%,var(--bg-primary)_60%,var(--bg-primary)_100%)]" />
      </ParallaxLayer>

      <ParallaxLayer y={glowY}>
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[var(--color-accent)]/25 blur-3xl" />
        <div className="absolute top-40 left-[12%] h-[360px] w-[360px] rounded-full bg-[var(--color-primary)]/20 blur-3xl" />
        <div className="absolute top-64 right-[10%] h-[420px] w-[420px] rounded-full bg-[var(--color-secondary)]/20 blur-3xl" />
      </ParallaxLayer>
    </div>
  );
}

type SoftParallaxBlobsProps = {
  progress: MotionValue<number>;
  className?: string;
};

export function SoftParallaxBlobs({ progress, className }: SoftParallaxBlobsProps) {
  const y1 = useTransform(progress, [0, 1], [-60, 60]);
  const y2 = useTransform(progress, [0, 1], [-25, 25]);
  const y3 = useTransform(progress, [0, 1], [40, -40]);

  return (
    <div className={cn("relative h-full w-full", className)}>
      <ParallaxLayer y={y1}>
        <div className="absolute -top-40 left-[-10%] h-[520px] w-[520px] rounded-full bg-[var(--color-accent)]/10 blur-3xl" />
        <div className="absolute top-10 right-[-12%] h-[520px] w-[520px] rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
      </ParallaxLayer>

      <ParallaxLayer y={y2}>
        <div className="absolute bottom-[-35%] left-[20%] h-[520px] w-[520px] rounded-full bg-[var(--color-secondary)]/10 blur-3xl" />
      </ParallaxLayer>

      <ParallaxLayer y={y3}>
        <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35)_0%,transparent_42%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.25)_0%,transparent_45%),radial-gradient(circle_at_60%_80%,rgba(255,255,255,0.22)_0%,transparent_40%)]" />
      </ParallaxLayer>
    </div>
  );
}

type VideoParallaxBackdropProps = {
  progress: MotionValue<number>;
  src: string;
  poster?: string;
  className?: string;
  overlayClassName?: string;
};

export function VideoParallaxBackdrop({
  progress,
  src,
  poster,
  className,
  overlayClassName,
}: VideoParallaxBackdropProps) {
  const y = useTransform(progress, [0, 1], [-80, 80]);
  const scale = useTransform(progress, [0, 1], [1.08, 1.08]);

  return (
    <div className={cn("relative h-full w-full", className)}>
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <video
          className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover"
          src={src}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
        />
      </motion.div>
      <div className={cn("absolute inset-0 bg-black/60", overlayClassName)} />
    </div>
  );
}
