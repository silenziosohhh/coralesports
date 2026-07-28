"use client";

import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALES, useI18n } from "@/lib/i18n";
import { Flag } from "@/components/flags";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const active = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          aria-label={`Lingua: ${active.label}`}
          className="h-9 gap-1.5 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.07)] px-2.5 backdrop-blur-md transition-colors hover:bg-[rgba(255,255,255,0.14)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/40"
        >
          <Flag code={active.code} className="h-4 w-6" />
          <ChevronDown className="h-3.5 w-3.5 text-[rgba(255,255,255,0.65)]" />
        </Button>
      </DropdownMenuTrigger>

      {/*
        Liquid glass alla Apple: pannello molto traslucido con blur spinto e
        saturazione, bordo-luce in alto (inset) e riflesso sfumato.
        NB: rgba espliciti — le utility white/N sono inaffidabili in questo tema.
      */}
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="relative w-48 overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.08)] p-1.5 shadow-[0_24px_70px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-[36px] backdrop-saturate-[180%]"
      >
        {/* Riflesso "vetro bagnato" sul bordo superiore */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[18px] bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.03)_38%,transparent_70%)]"
        />

        {LOCALES.map((l) => {
          const isActive = l.code === locale;
          return (
            <DropdownMenuItem
              key={l.code}
              onClick={() => setLocale(l.code)}
              aria-current={isActive}
              // Voce trasparente (override dello sfondo opaco della primitiva base)
              // così il pannello vetro resta uniforme; selezione piena blu in hover, come su macOS.
              className="relative z-10 flex cursor-pointer items-center gap-3 rounded-[11px] bg-transparent px-3 py-2 text-[13.5px] font-medium text-[rgba(255,255,255,0.92)] transition-colors duration-150 hover:bg-[rgba(255,255,255,0.10)] focus:bg-[var(--color-accent)] focus:text-white data-[highlighted]:bg-[var(--color-accent)] data-[highlighted]:text-white"
            >
              <Flag code={l.code} className="h-[15px] w-[22px] flex-shrink-0" />
              <span className="flex-1">{l.label}</span>
              {isActive && <Check className="h-4 w-4 flex-shrink-0" strokeWidth={2.5} />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
