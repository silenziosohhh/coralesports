"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, RotateCw } from "lucide-react";
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
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_-10%,rgba(255,80,80,0.16),transparent_55%),linear-gradient(180deg,var(--bg-primary)_0%,#0a0406_70%,#000_100%)] px-4 py-24 text-center">
      {/* Broken block */}
      <div aria-hidden className="relative mb-8 h-24 w-24">
        <div className="broken">
          <div className="mc-block">
            <span className="crack c1" />
            <span className="crack c2" />
            <span className="crack c3" />
          </div>
        </div>
        <div className="absolute -bottom-6 left-1/2 h-6 w-24 -translate-x-1/2 rounded-[100%] bg-red-500/20 blur-xl" />
      </div>

      <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
        {t("error.badge")}
      </span>

      <h1 className="glitch mb-4 text-7xl font-black uppercase leading-none tracking-tight text-white sm:text-8xl md:text-9xl">
        500
      </h1>

      <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
        {t("error.title")}
      </h2>

      <p className="mb-6 max-w-md text-pretty text-base leading-relaxed text-gray-300">
        {t("error.description")}
      </p>

      {error?.message ? (
        <p className="mb-8 max-w-md break-all rounded-lg border border-white/10 bg-black/40 px-4 py-3 font-mono text-xs text-gray-400">
          {error.message}
        </p>
      ) : null}

      <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
        <Button size="lg" onClick={reset} className="h-12 gap-2 px-6 font-bold">
          <RotateCw className="h-5 w-5" />
          {t("error.retry")}
        </Button>
        <Button size="lg" variant="outline" asChild className="h-12 gap-2 px-6">
          <Link href="/">
            <Home className="h-5 w-5" />
            {t("error.home")}
          </Link>
        </Button>
      </div>

      <style jsx>{`
        .broken {
          animation: shake 2.6s ease-in-out infinite;
        }
        .mc-block {
          position: relative;
          width: 84px;
          height: 84px;
          margin: 0 auto;
          border-radius: 8px;
          background: linear-gradient(160deg, #7a4b46 0%, #5a3330 100%);
          box-shadow:
            inset 0 0 0 3px rgba(0, 0, 0, 0.22),
            0 14px 30px rgba(0, 0, 0, 0.45),
            0 0 34px rgba(255, 70, 70, 0.25);
        }
        .crack {
          position: absolute;
          background: rgba(0, 0, 0, 0.55);
        }
        .crack.c1 {
          top: 8px;
          left: 40px;
          width: 3px;
          height: 34px;
          transform: rotate(18deg);
        }
        .crack.c2 {
          top: 38px;
          left: 18px;
          width: 32px;
          height: 3px;
          transform: rotate(-12deg);
        }
        .crack.c3 {
          bottom: 10px;
          right: 20px;
          width: 3px;
          height: 26px;
          transform: rotate(24deg);
        }
        .glitch {
          text-shadow:
            0.04em 0 0 rgba(255, 70, 70, 0.55),
            -0.04em -0.02em 0 rgba(255, 160, 60, 0.5),
            0 0 24px rgba(255, 70, 70, 0.2);
          animation: glitch 3.5s steps(2, end) infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-3px, 1px) rotate(-3deg); }
          50% { transform: translate(3px, -1px) rotate(3deg); }
          75% { transform: translate(-2px, 0) rotate(-1.5deg); }
        }
        @keyframes glitch {
          0%, 92%, 100% { transform: translate(0, 0); }
          93% { transform: translate(-2px, 1px); }
          95% { transform: translate(2px, -1px); }
          97% { transform: translate(-1px, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .broken,
          .glitch {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}
