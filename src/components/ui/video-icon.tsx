"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

const PROCESS_SIZE = 128;
const WHITE_CUTOFF = 235;
const FEATHER_START = 195;

export type VideoIconHandle = {
  play: () => void;
  pause: () => void;
};

type VideoIconProps = {
  src: string;
  className?: string;
  active?: boolean;
};

const ACTIVE_GRADIENT = [
  [7, 139, 234],
  [19, 174, 242],
  [57, 215, 242],
] as const;

function activeGradientColor(progress: number) {
  const segment = progress < 0.5 ? 0 : 1;
  const localProgress = progress < 0.5 ? progress * 2 : (progress - 0.5) * 2;
  const start = ACTIVE_GRADIENT[segment];
  const end = ACTIVE_GRADIENT[segment + 1];

  return start.map((channel, index) =>
    Math.round(channel + (end[index] - channel) * localProgress),
  );
}

export const VideoIcon = forwardRef<VideoIconHandle, VideoIconProps>(
  ({ src, className, active = false }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number | undefined>(undefined);

    const processFrame = useCallback(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx || video.readyState < 2) return;

      ctx.drawImage(video, 0, 0, PROCESS_SIZE, PROCESS_SIZE);
      const frame = ctx.getImageData(0, 0, PROCESS_SIZE, PROCESS_SIZE);
      const data = frame.data;

      for (let i = 0; i < data.length; i += 4) {
        const min = Math.min(data[i], data[i + 1], data[i + 2]);
        if (min > WHITE_CUTOFF) {
          data[i + 3] = 0;
        } else if (min > FEATHER_START) {
          data[i + 3] = Math.round(((WHITE_CUTOFF - min) / (WHITE_CUTOFF - FEATHER_START)) * data[i + 3]);
        }
        if (active) {
          const pixelX = (i / 4) % PROCESS_SIZE;
          const [red, green, blue] = activeGradientColor(pixelX / (PROCESS_SIZE - 1));
          data[i] = red;
          data[i + 1] = green;
          data[i + 2] = blue;
        } else {
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
        }
      }

      ctx.putImageData(frame, 0, 0);
    }, [active]);

    const loop = useCallback(() => {
      processFrame();
      rafRef.current = requestAnimationFrame(loop);
    }, [processFrame]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = PROCESS_SIZE;
        canvas.height = PROCESS_SIZE;
      }

      const video = videoRef.current;
      if (!video) return;

      video.addEventListener("loadeddata", processFrame);
      if (video.readyState >= 2) {
        processFrame();
      }

      return () => {
        video.removeEventListener("loadeddata", processFrame);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }, [loop, processFrame]);

    useImperativeHandle(
      ref,
      () => ({
        play: () => {
          const video = videoRef.current;
          if (!video) return;
          video.currentTime = 0;
          void video.play();
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(loop);
        },
        pause: () => {
          videoRef.current?.pause();
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = undefined;
          }
        },
      }),
      [loop],
    );

    return (
      <span className={cn("relative inline-block h-8 w-8 shrink-0", className)}>
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          className="hidden"
        />
        <canvas ref={canvasRef} className="h-full w-full object-contain" />
      </span>
    );
  },
);

VideoIcon.displayName = "VideoIcon";
