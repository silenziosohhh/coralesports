"use client";

import { useEffect } from "react";

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
      <body className="global-error-body">
        <div className="global-error-dots" aria-hidden />
        <div className="global-error-wave global-error-wave-top" aria-hidden />
        <main className="global-error-card">
          <div className="global-error-code">500</div>
          <h1>Server fuori dall&apos;arena</h1>
          <p>Si è verificato un errore critico. Ricarica la pagina per rientrare in partita.</p>
          {error.digest ? <small>ID: {error.digest}</small> : null}
          <button type="button" onClick={reset}>Ricarica la pagina</button>
        </main>
        <div className="global-error-wave global-error-wave-bottom" aria-hidden />
        <style>{`
          * { box-sizing: border-box; }
          .global-error-body { margin: 0; min-height: 100vh; display: grid; place-items: center; overflow: hidden; padding: 72px 20px; color: #fff; font-family: "Cabinet Grotesk", "Segoe UI", sans-serif; background: linear-gradient(115deg,#3b82f6,#397ef0 52%,#2563eb); }
          .global-error-dots { position: fixed; inset: 0; pointer-events: none; opacity: .55; background-image: radial-gradient(rgba(255,255,255,.48) 2px,transparent 2px); background-size: 21px 21px; }
          .global-error-card { position: relative; z-index: 2; width: min(640px,100%); padding: 42px; text-align: center; border: 2px solid rgba(255,255,255,.24); border-radius: 28px; background: rgba(6,27,59,.72); box-shadow: 0 26px 70px rgba(0,20,65,.34); backdrop-filter: blur(22px); }
          .global-error-code { font-size: clamp(4rem,12vw,8rem); font-weight: 900; line-height: .8; color: #57ffff; text-shadow: 4px 5px 0 rgba(0,0,0,.24); }
          h1 { margin: 30px 0 0; font-size: clamp(2rem,5vw,3.5rem); line-height: .95; text-transform: uppercase; }
          p { margin: 20px auto 0; max-width: 500px; color: rgba(255,255,255,.74); font-size: 1.05rem; line-height: 1.65; }
          small { display: block; margin-top: 16px; color: rgba(255,255,255,.45); }
          button { width: 100%; min-height: 60px; margin-top: 30px; cursor: pointer; border: 5px solid #007fda; border-radius: 14px; background: #0bb5ff; color: #00152b; font-size: 1rem; font-weight: 900; box-shadow: 0 9px 0 rgba(0,66,132,.45); }
          .global-error-wave { position: fixed; left: -5%; width: 110%; height: 110px; pointer-events: none; background: #001028; border-radius: 45% 55% 50% 50%; box-shadow: 0 18px 0 #174b80,0 34px 0 #3b82c4; }
          .global-error-wave-top { top: -72px; }
          .global-error-wave-bottom { bottom: -72px; transform: scaleY(-1); }
          @media (max-width: 560px) { .global-error-card { padding: 30px 22px; } }
        `}</style>
      </body>
    </html>
  );
}
