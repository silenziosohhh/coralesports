"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Cookie, Settings2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useStillAfterHydration } from "@/components/ui/reveal";
import { useCookieConsent, type ConsentCategory } from "@/lib/cookie-consent";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const EASE = [0.16, 1, 0.3, 1] as const;

type CategoryRow = {
  key: ConsentCategory;
  titleKey: string;
  descKey: string;
};

const OPTIONAL_CATEGORIES: CategoryRow[] = [
  { key: "analytics", titleKey: "cookie.analytics.title", descKey: "cookie.analytics.desc" },
  { key: "marketing", titleKey: "cookie.marketing.title", descKey: "cookie.marketing.desc" },
];

function ConsentToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full border-2 transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#57ffff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#061b3b]",
        checked
          ? "border-[#57ffff] bg-[#57ffff]"
          : "border-white/20 bg-white/[0.08] shadow-[inset_0_1px_3px_rgba(0,10,35,0.5)]",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute left-[3px] top-1/2 block h-4 w-4 -translate-y-1/2 rounded-full",
          "transition-transform duration-200 ease-out motion-reduce:transition-none",
          checked ? "translate-x-5 bg-[#00204a]" : "translate-x-0 bg-white/85",
        )}
      />
    </button>
  );
}

export function CookieConsentBanner() {
  const { isOpen, consent, acceptAll, rejectAll, save, closePreferences } = useCookieConsent();
  const { t } = useI18n();
  const still = useStillAfterHydration();
  const [showDetails, setShowDetails] = useState(false);
  const [choices, setChoices] = useState<Record<ConsentCategory, boolean>>({
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    if (!isOpen) return;
    setChoices({
      analytics: Boolean(consent?.analytics),
      marketing: Boolean(consent?.marketing),
    });
    setShowDetails(false);
  }, [isOpen, consent]);

  const dismissable = consent !== null;

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-consent-title"
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={still ? { duration: 0 } : { duration: 0.5, ease: EASE }}
          className="fixed bottom-0 right-0 z-[100] w-full max-w-[340px] origin-bottom-right p-3 sm:p-4"
        >
          <div
            className={cn(
              "competition-type relative overflow-hidden rounded-[22px] p-4",
              "border border-white/25 bg-gradient-to-b from-white/[0.16] to-white/[0.06]",
              "backdrop-blur-2xl backdrop-saturate-150",
              "shadow-[0_20px_50px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(255,255,255,0.1)]",
            )}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(120%_100%_at_50%_0%,rgba(255,255,255,0.22),transparent_70%)]"
            />

            <div className="relative flex items-start gap-2.5">
              <Cookie
                aria-hidden="true"
                className="mt-0.5 h-6 w-6 shrink-0 text-[#57ffff] drop-shadow-[0_2px_8px_rgba(87,255,255,0.35)]"
              />
              <div className="min-w-0 flex-1">
                <h2
                  id="cookie-consent-title"
                  className="text-[13px] font-black tracking-[-0.02em] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.55)]"
                >
                  {t("cookie.title")}
                </h2>
                <p className="mt-1 text-[11px] leading-snug text-white/85 [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                  {t("cookie.description")}
                </p>
              </div>
              {dismissable ? (
                <button
                  type="button"
                  onClick={closePreferences}
                  aria-label={t("cookie.close")}
                  className="-mr-1 -mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-md text-white/60 transition-colors hover:bg-white/[0.14] hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              ) : null}
            </div>

            <AnimatePresence initial={false}>
              {showDetails ? (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={still ? { duration: 0 } : { duration: 0.35, ease: EASE }}
                  className="relative overflow-hidden"
                >
                  <div className="mt-3 space-y-1.5 border-t border-white/12 pt-3">
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/20 bg-white/[0.1] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-white">
                          {t("cookie.necessary.title")}
                        </p>
                        <p className="mt-0.5 text-[10px] leading-snug text-white/65 [text-shadow:0_1px_2px_rgba(0,0,0,0.45)]">
                          {t("cookie.necessary.desc")}
                        </p>
                      </div>
                      <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.1em] text-[#57ffff]">
                        {t("cookie.alwaysOn")}
                      </span>
                    </div>

                    {OPTIONAL_CATEGORIES.map((category) => (
                      <div
                        key={category.key}
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/20 bg-white/[0.1] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]"
                      >
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-white">{t(category.titleKey)}</p>
                          <p className="mt-0.5 text-[10px] leading-snug text-white/65 [text-shadow:0_1px_2px_rgba(0,0,0,0.45)]">
                            {t(category.descKey)}
                          </p>
                        </div>
                        <ConsentToggle
                          checked={choices[category.key]}
                          label={t(category.titleKey)}
                          onChange={(next) =>
                            setChoices((current) => ({ ...current, [category.key]: next }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="relative mt-3.5 space-y-1.5">
              <Button
                type="button"
                variant="cyan"
                onClick={showDetails ? () => save(choices) : acceptAll}
                className="h-12 w-full rounded-xl border-[5px] px-5 text-sm font-black uppercase tracking-[0.06em]"
              >
                {showDetails ? t("cookie.saveChoices") : t("cookie.acceptAll")}
              </Button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={rejectAll}
                  className="h-8 flex-1 rounded-lg border border-white/20 bg-white/[0.05] text-[10px] font-bold text-white/80 transition-colors hover:border-white/35 hover:text-white"
                >
                  {t("cookie.rejectAll")}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDetails((open) => !open)}
                  aria-expanded={showDetails}
                  className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-[10px] font-bold text-white/50 transition-colors hover:text-white"
                >
                  <Settings2 className="h-3 w-3" />
                  {showDetails ? t("cookie.hideDetails") : t("cookie.customize")}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
