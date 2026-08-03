"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompetitionPageShell } from "@/components/competition/competition-page-shell";
import { buildCustomQrDataUrl } from "@/lib/qr";
import { CoralLoadingScreen } from "@/components/ui/coral-loading-screen";

const PANEL =
  "relative overflow-hidden rounded-[28px] border-2 border-white/20 bg-[#061b3b]/68 shadow-[0_26px_70px_rgba(0,20,65,0.34)] backdrop-blur-2xl";

type InvitePayload = {
  invitation: {
    token: string;
    status: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED";
    expiresAt: string;
    createdAt: string;
    respondedAt: string | null;
    invitedUserId: string;
    invitedBy: { id: string; name: string | null; discordTag: string | null; image: string | null };
    tournament: { id: string; name: string; teamMode: "SOLO" | "DUO" | "TRIO"; startDate: string; status: string };
  };
  viewer: { userId: string | null; isRecipient: boolean };
};

export default function TournamentInvitePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const token = params?.token as string;

  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState<InvitePayload | null>(null);
  const [responding, setResponding] = useState(false);
  const [qr, setQr] = useState<string>("");

  const inviteUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/tournament-invites/${token}`;
  }, [token]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/tournament-invites/${token}`, { cache: "no-store" });
        const data = (await res.json()) as InvitePayload;
        if (!res.ok) throw new Error((data as any)?.error || "Errore nel recupero invito");
        setPayload(data);
      } catch (e: any) {
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (!inviteUrl) return;
    buildCustomQrDataUrl({
      text: inviteUrl,
      size: 280,
      foreground: "#06b6d4",
      background: "#ffffff",
      logoUrl: "/logo.png",
    })
      .then((d: string) => setQr(d))
      .catch(() => setQr(""));
  }, [inviteUrl]);

  const respond = async (action: "accept" | "decline") => {
    if (!session?.user?.id) {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(`/tournament-invites/${token}`)}`);
      return;
    }
    setResponding(true);
    try {
      const res = await fetch(`/api/tournament-invites/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore");
      toast.success(action === "accept" ? "Invito accettato!" : "Invito rifiutato");
      router.refresh();
      const refreshed = await fetch(`/api/tournament-invites/${token}`, { cache: "no-store" });
      const refreshedData = (await refreshed.json()) as InvitePayload;
      if (refreshed.ok) setPayload(refreshedData);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setResponding(false);
    }
  };

  if (loading) {
    return <CoralLoadingScreen messageKey="loading.invite" />;
  }

  if (!payload) {
    return (
      <CompetitionPageShell
        eyebrow="Invito a un torneo"
        title="Invito"
        accent="non disponibile"
        description="Questo invito non esiste più, è scaduto oppure il link non è corretto."
      >
        <article className={`${PANEL} mx-auto max-w-2xl px-6 py-16 text-center`}>
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,157,255,0.14),transparent_52%)]"
          />
          <Ticket className="relative mx-auto h-10 w-10 text-cyan-300/60" />
          <h2 className="relative mt-5 text-2xl font-black text-white">Invito non trovato</h2>
          <p className="relative mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/45">
            Chiedi a chi ti ha invitato di generare un nuovo link.
          </p>
        </article>
      </CompetitionPageShell>
    );
  }

  const inv = payload.invitation;
  const isRecipient = session?.user?.id ? inv.invitedUserId === session.user.id : payload.viewer.isRecipient;
  const canRespond = !responding && inv.status === "PENDING" && !(status === "authenticated" && !isRecipient);

  return (
    <CompetitionPageShell
      eyebrow="Invito a un torneo"
      title={inv.tournament.name}
      description={`Sei stato invitato da ${
        inv.invitedBy.discordTag || inv.invitedBy.name || inv.invitedBy.id
      } a partecipare in modalità ${inv.tournament.teamMode}.`}
      action={
        <Button
          variant="outline"
          size="lg"
          className="h-12 rounded-xl px-6 font-black"
          onClick={() => router.push(`/tournaments/${inv.tournament.id}`)}
        >
          Vai al torneo
        </Button>
      }
    >
      <article className={`${PANEL} mx-auto max-w-2xl p-6 sm:p-8`}>
        <div aria-hidden className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#57ffff]/16 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-[#57ffff]">
            <Ticket className="h-5 w-5" />
          </span>
          <h2 className="text-2xl font-black tracking-[-0.03em] text-white">Dettagli invito</h2>
        </div>

        <div className="relative mt-6 space-y-2">
          {[
            { label: "Torneo", value: inv.tournament.name },
            { label: "Modalità", value: inv.tournament.teamMode },
            {
              label: "Invitato da",
              value: inv.invitedBy.discordTag || inv.invitedBy.name || inv.invitedBy.id,
            },
            { label: "Stato invito", value: inv.status },
            { label: "Scade il", value: new Date(inv.expiresAt).toLocaleString("it-IT") },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between gap-3 rounded-2xl border border-white/14 bg-white/[0.05] px-4 py-3"
            >
              <span className="text-sm font-semibold text-white/58">{label}</span>
              <span className="text-right font-black text-white">{value}</span>
            </div>
          ))}
        </div>

        <div className="relative mt-6 flex flex-wrap gap-2">
          <Button
            variant="cyan"
            size="lg"
            className="rounded-xl font-black"
            onClick={() => respond("accept")}
            disabled={!canRespond}
          >
            Accetta
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-xl font-black"
            onClick={() => respond("decline")}
            disabled={!canRespond}
          >
            Rifiuta
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-xl font-black"
            onClick={async () => {
              await navigator.clipboard.writeText(inviteUrl);
              toast.success("Link copiato!");
            }}
          >
            Copia link
          </Button>
        </div>

        {qr && (
          <div className="relative mt-8">
            <div className="text-[10px] font-black uppercase tracking-[0.14em] text-white/52">QR code</div>
            <div className="mt-3 flex justify-center rounded-2xl border border-white/14 bg-white/[0.05] p-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr} alt="QR code dell'invito" className="h-[280px] w-[280px] rounded-xl bg-white p-2" />
            </div>
          </div>
        )}
      </article>
    </CompetitionPageShell>
  );
}
