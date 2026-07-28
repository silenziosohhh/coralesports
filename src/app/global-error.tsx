"use client";

import { useEffect } from "react";

/**
 * Catastrophic fallback shown when the root layout itself fails.
 * It replaces the layout entirely, so no providers, i18n or global CSS are
 * available here — everything is inlined and copy is kept bilingual.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="it">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "2rem",
          textAlign: "center",
          fontFamily:
            "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          color: "#fff",
          background:
            "radial-gradient(circle at 50% -10%, rgba(255,80,80,0.16), transparent 55%), linear-gradient(180deg, #030712 0%, #0a0406 70%, #000 100%)",
        }}
      >
        <div
          style={{
            fontSize: "5rem",
            fontWeight: 900,
            lineHeight: 1,
            textShadow: "0 0 24px rgba(255,70,70,0.3)",
          }}
        >
          500
        </div>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>
          Qualcosa è andato storto · Something went wrong
        </h1>
        <p style={{ margin: 0, maxWidth: 420, color: "#cbd5e1" }}>
          Il server ha incontrato un errore critico. Ricarica la pagina.
          <br />
          The server hit a critical error. Please reload.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "0.5rem",
            cursor: "pointer",
            borderRadius: "0.5rem",
            border: "none",
            background: "#009DFF",
            color: "#001018",
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            fontWeight: 700,
          }}
        >
          Ricarica · Reload
        </button>
      </body>
    </html>
  );
}
