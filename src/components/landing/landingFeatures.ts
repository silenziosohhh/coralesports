import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import { Gift, Trophy, Users } from "lucide-react";

export type LandingFeature = {
  /** Stable identifier — used for i18n keys and image lookup. */
  slug: "brackets" | "teams" | "prizes";
  icon: ComponentType<LucideProps>;
  /** Fallback title (translated at render via feature.<slug>.title). */
  title: string;
  description: string;
  color: string;
};

export const landingFeatures: LandingFeature[] = [
  {
    slug: "brackets",
    icon: Trophy,
    title: "Bracket Avanzati",
    description: "Eliminazione singola, doppia e round robin con generazione automatica",
    color: "var(--color-accent)",
  },
  {
    slug: "teams",
    icon: Users,
    title: "Gestione Team",
    description: "Crea team, invita giocatori e gestisci il roster con facilità",
    color: "var(--color-primary)",
  },
  {
    slug: "prizes",
    icon: Gift,
    title: "Premi Reali",
    description: "Monta premi in palio in ogni torneo: vinci le sfide e conquista ricompense concrete, non solo gloria",
    color: "var(--color-secondary)",
  },
];

