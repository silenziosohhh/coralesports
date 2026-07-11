"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-6 text-center">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Accetta invito</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Completa il captcha per entrare nel team.
        </p>

        {siteKey ? (
          <div className="flex justify-center">
            <TurnstileWidget
              siteKey={siteKey}
              onToken={(t) => setCaptchaToken(t)}
              className="flex justify-center"
            />
          </div>
        ) : (
          <p className="text-sm text-red-400">Captcha non configurato.</p>
        )}

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => router.push("/teams")} disabled={submitting}>
            Annulla
          </Button>
          <Button className="flex-1" onClick={acceptInvite} disabled={submitting || !captchaToken || !siteKey}>
            {submitting ? "Verifica..." : "Accetta"}
          </Button>
        </div>
      </div>
    </div>
  );
}
