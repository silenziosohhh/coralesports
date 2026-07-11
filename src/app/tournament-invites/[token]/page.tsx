"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buildCustomQrDataUrl } from "@/lib/qr";

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
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-[var(--text-secondary)]">Caricamento...</div>
      </div>
    );
  }

  if (!payload) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-[var(--text-secondary)]">Invito non disponibile.</div>
      </div>
    );
  }

  const inv = payload.invitation;
  const isRecipient = session?.user?.id ? inv.invitedUserId === session.user.id : payload.viewer.isRecipient;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <Card className="glass-card border-cyan/20">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Invito Torneo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-[var(--text-secondary)]">
              Torneo: <span className="font-semibold text-white">{inv.tournament.name}</span> • Modalità{" "}
              <span className="font-semibold text-white">{inv.tournament.teamMode}</span>
            </div>
            <div className="text-sm text-[var(--text-secondary)]">
              Invitato da:{" "}
              <span className="font-semibold text-white">
                {inv.invitedBy.discordTag || inv.invitedBy.name || inv.invitedBy.id}
              </span>
            </div>
            <div className="text-sm text-[var(--text-secondary)]">
              Stato invito: <span className="font-semibold text-white">{inv.status}</span>
            </div>
            <div className="text-sm text-[var(--text-secondary)]">
              Scade:{" "}
              <span className="font-semibold text-white">
                {new Date(inv.expiresAt).toLocaleString("it-IT")}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                variant="cyan"
                onClick={() => respond("accept")}
                disabled={responding || inv.status !== "PENDING" || (status === "authenticated" && !isRecipient)}
              >
                Accetta
              </Button>
              <Button
                variant="outline"
                onClick={() => respond("decline")}
                disabled={responding || inv.status !== "PENDING" || (status === "authenticated" && !isRecipient)}
              >
                Rifiuta
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  await navigator.clipboard.writeText(inviteUrl);
                  toast.success("Link copiato!");
                }}
              >
                Copia link
              </Button>
              <Button variant="ghost" onClick={() => router.push(`/tournaments/${inv.tournament.id}`)}>
                Vai al torneo
              </Button>
            </div>

            {qr && (
              <div className="pt-4">
                <div className="mb-2 text-sm font-semibold text-white">QR Code</div>
                <div className="flex justify-center">
                  <img src={qr} alt="QR Code invito" className="h-[280px] w-[280px] rounded bg-white p-2" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
