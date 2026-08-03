"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { INTL_LOCALE, useI18n } from "@/lib/i18n";

const SERVER_IP = "play.coralmc.it";

type ServerStatus = {
  online: boolean;
  players: { online: number; max: number };
  version: string | null;
};

async function fetchStatus(signal: AbortSignal): Promise<ServerStatus | null> {
  const res = await fetch(
    `https://api.mcstatus.io/v2/status/java/${SERVER_IP}`,
    { signal, cache: "no-store" },
  );
  if (!res.ok) return null;
  const data = await res.json();
  return {
    online: Boolean(data?.online),
    players: {
      online: Number(data?.players?.online ?? 0),
      max: Number(data?.players?.max ?? 0),
    },
    version: data?.version?.name_clean ?? null,
  };
}

function useCountUp(target: number, active: boolean, durationMs = 1200) {
  const [value, setValue] = useState(0);
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [target, active, durationMs]);

  return value;
}

export function LiveServerStatus({ className }: { className?: string }) {
  const { t, locale } = useI18n();
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const load = () => {
      fetchStatus(controller.signal)
        .then((data) => {
          if (controller.signal.aborted) return;
          if (data) {
            setStatus(data);
            setFailed(false);
          } else {
            setFailed(true);
          }
        })
        .catch((error) => {
          if (!controller.signal.aborted) {
            console.error("Error fetching server status:", error);
            setFailed(true);
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    };

    load();
    const interval = setInterval(load, 60_000);

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  const isOnline = Boolean(status?.online);
  const playerCount = useCountUp(status?.players.online ?? 0, isOnline);

  const copyIp = async () => {
    try {
      await navigator.clipboard.writeText(SERVER_IP);
      toast.success(t("server.copied"), { description: SERVER_IP });
    } catch {
      toast.error(t("server.copyError"));
    }
  };

  if (failed && !status) return null;

  return (
    <div
      className={cn(
        "flex w-full max-w-md flex-col gap-3 rounded-2xl px-5 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      style={{
        border: "1px solid rgba(255,255,255,0.1)",
        backgroundColor: "rgba(255,255,255,0.04)",
      }}
    >
      <div className="flex items-center gap-3">
        <span className="relative flex h-3 w-3 flex-shrink-0">
          {isOnline && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          )}
          <span
            className={cn(
              "relative inline-flex h-3 w-3 rounded-full",
              isOnline ? "bg-emerald-400" : "bg-gray-500",
            )}
          />
        </span>

        <div className="leading-tight">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gray-300">
            {loading
              ? t("server.connecting")
              : isOnline
                ? t("server.online")
                : t("server.offline")}
          </p>
          <p className="text-sm font-medium text-white">
            {isOnline ? (
              <>
                <span className="text-lg font-black text-[var(--color-accent)]">
                  {playerCount.toLocaleString(INTL_LOCALE[locale])}
                </span>{" "}
                {t("server.playersOnline")}
              </>
            ) : loading ? (
              <span className="text-gray-400">{t("server.fetching")}</span>
            ) : (
              <span className="text-gray-400">{t("server.retryLater")}</span>
            )}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={copyIp}
        aria-label={`${t("server.copyAria")} ${SERVER_IP}`}
        className="group flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5"
        style={{
          border: "1px solid rgba(255,255,255,0.14)",
          backgroundColor: "rgba(255,255,255,0.06)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-[var(--color-accent)]"
          aria-hidden="true"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <span className="font-mono tracking-tight">{SERVER_IP}</span>
      </button>
    </div>
  );
}
