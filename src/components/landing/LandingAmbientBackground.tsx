"use client";

/**
 * Sfondo ambientale per la landing: gradienti radiali morbidi posizionati a
 * diverse profondità di scroll. Man mano che l'utente scorre, la pagina passa
 * sopra glow di colori diversi (blu → ciano → viola → blu), così il fondo
 * "cambia" invece di restare un blocco scuro piatto.
 *
 * Puramente decorativo: absolute, dietro al contenuto, non intercetta i click.
 */

type Blob = {
  /** Posizione verticale in % dell'altezza totale della pagina. */
  top: string;
  /** Ancoraggio orizzontale. */
  side: "left" | "right";
  offset: string;
  size: string;
  /** Gradiente radiale del glow. */
  gradient: string;
  delay?: string;
};

const blobs: Blob[] = [
  {
    top: "4%",
    side: "left",
    offset: "-10%",
    size: "42rem",
    gradient: "radial-gradient(circle, rgba(0,157,255,0.30), transparent 68%)",
  },
  {
    top: "22%",
    side: "right",
    offset: "-12%",
    size: "46rem",
    gradient: "radial-gradient(circle, rgba(87,255,255,0.22), transparent 66%)",
    delay: "2s",
  },
  {
    top: "40%",
    side: "left",
    offset: "-14%",
    size: "50rem",
    gradient: "radial-gradient(circle, rgba(0,157,255,0.26), transparent 66%)",
    delay: "4s",
  },
  {
    top: "58%",
    side: "right",
    offset: "-10%",
    size: "44rem",
    gradient: "radial-gradient(circle, rgba(139,92,246,0.24), transparent 66%)",
  },
  {
    top: "76%",
    side: "left",
    offset: "-12%",
    size: "46rem",
    gradient: "radial-gradient(circle, rgba(87,255,255,0.20), transparent 66%)",
    delay: "2s",
  },
];

export function LandingAmbientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden" aria-hidden>
      {blobs.map((blob, i) => (
        <div
          key={i}
          className="animate-blob absolute rounded-full blur-[100px] will-change-transform"
          style={{
            top: blob.top,
            [blob.side]: blob.offset,
            width: blob.size,
            height: blob.size,
            background: blob.gradient,
            animationDelay: blob.delay,
            animationDuration: "16s",
          }}
        />
      ))}
    </div>
  );
}
