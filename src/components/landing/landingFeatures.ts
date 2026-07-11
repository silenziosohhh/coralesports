import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import { Award, Shield, TrendingUp, Trophy, Users, Zap } from "lucide-react";

export type LandingFeature = {
  icon: ComponentType<LucideProps>;
  title: string;
  description: string;
  color: string;
};

export const landingFeatures: LandingFeature[] = [
  {
    icon: Trophy,
    title: "Bracket Avanzati",
    description: "Eliminazione singola, doppia e round robin con generazione automatica",
    color: "var(--color-accent)",
  },
  {
    icon: Users,
    title: "Gestione Team",
    description: "Crea team, invita giocatori e gestisci il roster con facilità",
    color: "var(--color-primary)",
  },
  {
    icon: Shield,
    title: "Integrazione Discord",
    description: "Login OAuth seamless con sincronizzazione automatica del profilo",
    color: "var(--color-secondary)",
  },
  {
    icon: TrendingUp,
    title: "Sistema ELO",
    description: "Ranking competitivo che traccia le tue performance",
    color: "var(--color-accent)",
  },
  {
    icon: Zap,
    title: "Aggiornamenti Real-time",
    description: "Punteggi live, notifiche match e progressione istantanea",
    color: "var(--color-primary)",
  },
  {
    icon: Award,
    title: "Statistiche & Analytics",
    description: "Statistiche dettagliate, cronologia match e analytics",
    color: "var(--color-secondary)",
  },
];

