"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Loader2, QrCode, RefreshCcw, Share2 } from "lucide-react";
import QRCode from "qrcode";

export function InviteTeamDialog({
  teamId,
  teamName,
  children,
}: {
  teamId: string;
  teamName: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string>("");
  const [inviteExpiresAt, setInviteExpiresAt] = useState<string>("");

  const loadExistingInvite = async () => {
    setLoadingExisting(true);
    try {
      const res = await fetch(`/api/teams/${teamId}/invitations`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore nel recupero degli inviti");

      const latest = Array.isArray(data) && data.length > 0 ? data[0] : null;
      if (!latest?.token) return;

      const url = `${window.location.origin}/teams/invite/${teamId}/${latest.token}`;
      setInviteUrl(url);
      setInviteExpiresAt(latest.expiresAt ?? "");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoadingExisting(false);
    }
  };

  const createInvite = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/teams/${teamId}/invitations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore nella creazione dell'invito");

      const url = `${window.location.origin}/teams/invite/${teamId}/${data.token}`;
      setInviteUrl(url);
      setInviteExpiresAt(data.expiresAt ?? "");
      toast.success("Link invito creato");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast.success("Link copiato");
    } catch {
      toast.error("Impossibile copiare il link");
    }
  };

  const shareLink = async () => {
    try {
      if (!navigator.share) {
        await copyLink();
        return;
      }
      await navigator.share({ title: `Invito ${teamName}`, url: inviteUrl });
    } catch {
    }
  };

  const expiresLabel = (() => {
    if (!inviteExpiresAt) return null;
    const d = new Date(inviteExpiresAt);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  })();

  useEffect(() => {
    if (!open) return;
    void loadExistingInvite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          setInviteUrl("");
          setInviteExpiresAt("");
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="gradient-text text-2xl">Invita nel team</DialogTitle>
          <DialogDescription className="text-[var(--text-secondary)]">
            Crea un link invito per <strong>{teamName}</strong>. Puoi condividerlo o far scansionare
            il QR code.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-4">
          {!inviteUrl ? (
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                onClick={loadExistingInvite}
                disabled={loadingExisting || loading}
                className="w-full"
              >
                {(loadingExisting || loading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Mostra link esistente
              </Button>
              <Button
                onClick={createInvite}
                disabled={loading || loadingExisting}
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Genera nuovo link invito
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-[1fr_260px]">
              <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-[var(--text-primary)]">
                      Link invito
                    </div>
                    {expiresLabel && (
                      <div className="text-xs text-[var(--text-secondary)]">
                        Scade: {expiresLabel}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <input
                    readOnly
                    value={inviteUrl}
                    className="w-full truncate rounded-lg bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none ring-1 ring-[var(--border-color)] focus:ring-[var(--color-primary)]"
                  />
                </div>

                <div className="mt-3 grid w-full grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={shareLink}
                    aria-label="Condividi link"
                    disabled={!inviteUrl}
                    className="w-full"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={copyLink}
                    aria-label="Copia link"
                    disabled={!inviteUrl}
                    className="w-full"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    asChild
                    aria-label="Apri link"
                    disabled={!inviteUrl}
                    className="w-full"
                  >
                    <a href={inviteUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>

                <div className="mt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={createInvite}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Rigenera link
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                  <QrCode className="h-4 w-4" />
                  QR Code
                </div>
                <InviteQr inviteUrl={inviteUrl} />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InviteQr({ inviteUrl }: { inviteUrl: string }) {
  const [src, setSrc] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    QRCode.toDataURL(inviteUrl, { margin: 1, width: 220 })
      .then((dataUrl: string) => {
        if (cancelled) return;
        setSrc(dataUrl);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [inviteUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-[var(--text-secondary)]">
        Generazione QR...
      </div>
    );
  }

  if (!src) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-[var(--text-secondary)]">
        QR non disponibile
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <Image
        src={src}
        alt="QR code invito"
        width={220}
        height={220}
        unoptimized
        className="h-[220px] w-[220px] rounded-lg border border-white/10 bg-white p-2"
      />
    </div>
  );
}
