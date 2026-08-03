"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "coralmc-cookie-consent";
const CONSENT_VERSION = 1;

export type ConsentCategory = "analytics" | "marketing";

export type CookieConsent = {
  version: number;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
};

type CookieConsentContextValue = {
  consent: CookieConsent | null;
  ready: boolean;
  isOpen: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  save: (choices: Record<ConsentCategory, boolean>) => void;
  openPreferences: () => void;
  closePreferences: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

function readStored(): CookieConsent | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookieConsent>;
    if (parsed.version !== CONSENT_VERSION) return null;
    return {
      version: CONSENT_VERSION,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      decidedAt: typeof parsed.decidedAt === "string" ? parsed.decidedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [ready, setReady] = useState(false);
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    setConsent(readStored());
    setReady(true);
  }, []);

  const persist = useCallback((analytics: boolean, marketing: boolean) => {
    const next: CookieConsent = {
      version: CONSENT_VERSION,
      analytics,
      marketing,
      decidedAt: new Date().toISOString(),
    };
    setConsent(next);
    setReopened(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
    }
  }, []);

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      consent,
      ready,
      isOpen: ready && (consent === null || reopened),
      acceptAll: () => persist(true, true),
      rejectAll: () => persist(false, false),
      save: (choices) => persist(choices.analytics, choices.marketing),
      openPreferences: () => setReopened(true),
      closePreferences: () => setReopened(false),
    }),
    [consent, ready, reopened, persist],
  );

  return (
    <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error("useCookieConsent va usato dentro <CookieConsentProvider>");
  }
  return context;
}

export function useConsentFor(category: ConsentCategory) {
  const { consent } = useCookieConsent();
  return Boolean(consent?.[category]);
}
