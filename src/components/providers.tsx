"use client";

import { SessionProvider } from "next-auth/react";
import { MotionConfig } from "framer-motion";
import { useEffect, useState } from "react";
import { I18nProvider } from "@/lib/i18n";
import { CookieConsentProvider } from "@/lib/cookie-consent";

export function Providers({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  return (
    <SessionProvider>
      <I18nProvider>
        <CookieConsentProvider>
          <MotionConfig reducedMotion={hydrated ? "user" : "never"}>{children}</MotionConfig>
        </CookieConsentProvider>
      </I18nProvider>
    </SessionProvider>
  );
}
