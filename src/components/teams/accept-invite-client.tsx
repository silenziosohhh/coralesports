"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompetitionPageShell } from "@/components/competition/competition-page-shell";
import { TurnstileWidget } from "@/components/security/turnstile-widget";

export function AcceptInviteClient({ token, teamId }: { token: string; teamId: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  useEffect(() => {
    setCaptchaToken("");
  }, [token]);

  const acceptInvite = async () => {
    if (submitting) return;
    if (!siteKey) {
      toast.error("Captcha non configurato");
      return;
    }
    if (!captchaToken) {
      toast.error("Completa il captcha");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/team-invitations/${token}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ captchaToken, teamId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore");
      toast.success("Invito accettato!");
      router.replace(`/teams/${data.teamId}`);
    } catch (e: any) {
      toast.error(e.message);
      setCaptchaToken("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CompetitionPageShell
      eyebrow="Invito a un team"
      title="Accetta"
      accent="l'invito"
      description="Un passaggio di verifica e sei dentro: completa il captcha per unirti al team che ti ha invitato."
    >
      <article className="relative mx-auto max-w-md overflow-hidden rounded-[28px] border-2 border-white/20 bg-[#061b3b]/68 p-7 text-center shadow-[0_26px_70px_rgba(0,20,65,0.34)] backdrop-blur-2xl sm:p-8">
        <div aria-hidden className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#57ffff]/16 blur-3xl" />

        <span className="relative mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.06] text-[#57ffff]">
          <UserPlus className="h-6 w-6" />
        </span>
        <h2 className="relative mt-4 text-2xl font-black tracking-[-0.03em] text-white">Accetta invito</h2>
        <p className="relative mt-2 text-sm leading-relaxed text-white/62">
          Completa il captcha per entrare nel team.
        </p>

        {siteKey ? (
          <div className="relative mt-6 flex justify-center">
            <TurnstileWidget
              siteKey={siteKey}
              onToken={(t) => setCaptchaToken(t)}
              className="flex justify-center"
            />
          </div>
        ) : (
          <p className="relative mt-6 rounded-2xl border border-red-500/25 bg-red-500/[0.08] px-4 py-3 text-sm font-semibold text-red-300">
            Captcha non configurato.
          </p>
        )}

        <div className="relative mt-6 flex gap-2">
          <Button
            variant="outline"
            className="flex-1 rounded-xl font-black"
            onClick={() => router.push("/teams")}
            disabled={submitting}
          >
            Annulla
          </Button>
          <Button
            variant="cyan"
            className="flex-1 rounded-xl font-black"
            onClick={acceptInvite}
            disabled={submitting || !captchaToken || !siteKey}
          >
            {submitting ? "Verifica…" : "Accetta"}
          </Button>
        </div>
      </article>
    </CompetitionPageShell>
  );
}
