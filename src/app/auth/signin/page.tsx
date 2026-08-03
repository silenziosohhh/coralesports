"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FaDiscord } from "react-icons/fa";
import Link from "next/link";
import { ArrowLeft, Check, LockKeyhole } from "lucide-react";
import { motion } from "framer-motion";
import { DiscordAuthLayout } from "@/components/auth/DiscordAuthLayout";
import { useI18n } from "@/lib/i18n";

export default function SignInPage() {
  const { t } = useI18n();

  return (
    <DiscordAuthLayout>
      <div className="mx-auto flex w-full max-w-[620px] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[560px] overflow-hidden rounded-[30px] border-2 border-white/20 bg-[#061b3b]/60 p-6 shadow-[0_28px_80px_rgba(0,20,65,0.34)] backdrop-blur-[28px] sm:p-9"
        >
          <div
            aria-hidden
            className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#57ffff]/14 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-32 -left-28 h-64 w-64 rounded-full bg-[#009dff]/15 blur-3xl"
          />

          <div className="relative text-center">
            <div className="mb-7 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.86 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.28, duration: 0.45 }}
                className="grid h-16 w-16 place-items-center rounded-2xl border-[3px] border-[#e0b400] bg-[#ffd63d] text-[#141414] shadow-[0_10px_28px_rgba(255,214,61,0.24)]"
              >
                <FaDiscord className="h-8 w-8" />
              </motion.div>
            </div>

            <h1 className="mx-auto max-w-4xl text-balance text-[clamp(2.15rem,5vw,3.4rem)] font-black uppercase leading-[0.98] tracking-[-0.035em] text-white [text-shadow:3px_4px_0_rgba(0,0,0,0.22)]">
              {t("auth.signIn.title")}
            </h1>
            <p className="mx-auto mt-4 max-w-[42ch] text-pretty text-base leading-relaxed text-white/72 sm:text-lg">
              {t("auth.signIn.description")}
            </p>

            <Button
              size="lg"
              variant="discord"
              className="mt-8 min-h-[4.5rem] w-full gap-3 rounded-[14px] border-[5px] px-7 text-lg font-extrabold shadow-[0_12px_30px_rgba(0,0,0,0.3)] sm:text-xl [&_svg]:h-6 [&_svg]:w-6"
              onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
            >
              <FaDiscord />
              {t("auth.signIn.continue")}
            </Button>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-white/58 sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-[#57ffff]" />
                {t("auth.signIn.synced")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <LockKeyhole className="h-4 w-4 text-[#57ffff]" />
                {t("auth.signIn.noPassword")}
              </span>
            </div>

            <Link
              href="/"
              className="mx-auto mt-8 inline-flex items-center gap-2 text-sm font-bold text-white/65 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Torna alla home
            </Link>
          </div>
        </motion.div>
      </div>
    </DiscordAuthLayout>
  );
}
