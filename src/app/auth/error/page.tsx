"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DiscordAuthLayout } from "@/components/auth/DiscordAuthLayout";
import { AlertCircle, ArrowLeft } from "lucide-react";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, { title: string; description: string }> = {
    Configuration: {
      title: "Errore di configurazione",
      description: "C'è un problema nella configurazione del server. Contatta lo staff.",
    },
    AccessDenied: {
      title: "Accesso negato",
      description: "Non hai i permessi per accedere.",
    },
    Verification: {
      title: "Errore di verifica",
      description: "Il token di verifica è scaduto oppure è già stato usato.",
    },
    OAuthSignin: {
      title: "Errore di accesso OAuth",
      description: "Non è stato possibile costruire l'URL di autorizzazione Discord.",
    },
    OAuthCallback: {
      title: "Errore nel callback OAuth",
      description: "Non è stato possibile gestire la risposta di Discord.",
    },
    OAuthCreateAccount: {
      title: "Errore nella creazione account",
      description: "Non è stato possibile creare l'utente collegato a Discord.",
    },
    EmailCreateAccount: {
      title: "Errore account email",
      description: "Non è stato possibile creare l'utente con l'indirizzo email.",
    },
    Callback: {
      title: "Errore di callback",
      description: "Si è verificato un errore nella rotta di callback.",
    },
    OAuthAccountNotLinked: {
      title: "Account non collegato",
      description: "Questa email è già associata a un altro account.",
    },
    EmailSignin: {
      title: "Errore di accesso via email",
      description: "Controlla il tuo indirizzo email.",
    },
    CredentialsSignin: {
      title: "Accesso non riuscito",
      description: "Verifica che i dati inseriti siano corretti.",
    },
    SessionRequired: {
      title: "Accesso richiesto",
      description: "Devi effettuare l'accesso per vedere questa pagina.",
    },
    Default: {
      title: "Errore di autenticazione",
      description: "Si è verificato un errore durante l'autenticazione.",
    },
  };

  const errorInfo = errorMessages[error || "Default"] || errorMessages.Default;

  return (
    <div className="mx-auto flex w-full max-w-[620px] items-center justify-center">
      <section className="relative w-full overflow-hidden rounded-[28px] border-2 border-white/20 bg-[#061b3b]/68 p-7 shadow-[0_26px_70px_rgba(0,20,65,0.34)] backdrop-blur-2xl sm:p-9">
        <div aria-hidden className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-red-500/18 blur-3xl" />

        <div className="relative text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border-2 border-red-500/35 bg-red-500/12 text-red-400">
            <AlertCircle className="h-8 w-8" />
          </span>
          <h1 className="mt-5 text-balance text-[clamp(1.8rem,4vw,2.6rem)] font-black uppercase leading-[0.95] tracking-[-0.04em] text-white [text-shadow:3px_4px_0_rgba(0,0,0,0.24)]">
            {errorInfo.title}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-pretty leading-relaxed text-white/72">
            {errorInfo.description}
          </p>
        </div>

        {error && (
          <p className="relative mt-6 rounded-2xl border border-white/14 bg-white/[0.05] px-4 py-3 text-center font-mono text-sm text-white/62">
            Codice errore: <span className="font-bold text-red-400">{error}</span>
          </p>
        )}

        <div className="relative mt-6 rounded-2xl border border-white/14 bg-white/[0.05] p-5">
          <h2 className="text-[10px] font-black uppercase tracking-[0.14em] text-white/52">Cosa puoi provare</h2>
          <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm leading-relaxed text-white/62">
            <li>Verifica che il redirect URI Discord punti a questo sito</li>
            <li>Controlla che il database sia inizializzato</li>
            <li>Assicurati che le variabili d’ambiente siano impostate</li>
            <li>Riavvia il server e riprova ad accedere</li>
          </ul>
        </div>

        <div className="relative mt-6 grid gap-2">
          <Button variant="cyan" size="lg" className="min-h-[3.5rem] w-full rounded-[14px] font-black" asChild>
            <Link href="/auth/signin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Riprova ad accedere
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="min-h-[3.25rem] w-full rounded-[14px] font-black" asChild>
            <Link href="/">Torna alla home</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <DiscordAuthLayout>
      <Suspense
        fallback={
          <div className="mx-auto flex w-full max-w-[620px] items-center justify-center">
            <section className="relative w-full overflow-hidden rounded-[28px] border-2 border-white/20 bg-[#061b3b]/68 p-9 text-center shadow-[0_26px_70px_rgba(0,20,65,0.34)] backdrop-blur-2xl">
              <h1 className="text-2xl font-black tracking-[-0.03em] text-white">Caricamento…</h1>
              <p className="mt-2 text-white/62">Stiamo preparando i dettagli dell’errore.</p>
            </section>
          </div>
        }
      >
        <AuthErrorContent />
      </Suspense>
    </DiscordAuthLayout>
  );
}
