"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n";

export type LoadingMessageKey =
  | "loading.default"
  | "loading.tournament"
  | "loading.team"
  | "loading.invite";

type CoralLoadingScreenProps = {
  messageKey?: LoadingMessageKey;
};

export function CoralLoadingScreen({ messageKey = "loading.default" }: CoralLoadingScreenProps) {
  const { t } = useI18n();

  return (
    <main
      role="status"
      aria-label={t("loading.aria")}
      className="flex min-h-[calc(100svh-5rem)] w-full items-center justify-center overflow-hidden bg-[#001126] px-4"
    >
      <Image
        src="/loading.gif"
        alt=""
        width={480}
        height={480}
        priority
        unoptimized
        className="h-48 w-48 mix-blend-screen sm:h-56 sm:w-56"
      />
      <span className="sr-only">{t(messageKey)}</span>
    </main>
  );
}
