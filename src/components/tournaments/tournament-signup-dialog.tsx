"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buildCustomQrDataUrl } from "@/lib/qr";

type EligibleUser = {
  id: string;
  name: string | null;
  image: string | null;
  discordTag: string | null;
  minecraftUsername: string | null;
};

type MyEntryResponse = {
  entry: null | {
    id: string;
    status: "PENDING" | "REGISTERED" | "CHECKED_IN" | "DISQUALIFIED" | "WITHDRAWN";
    team: { id: string; name: string; tag: string; createdById: string };
    players: Array<{
      user: {
        id: string;
        name: string | null;
        discordTag: string | null;
        image: string | null;
        minecraftUsername: string | null;
      };
    }>;
    invites: Array<{
      token: string;
      status: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED";
      expiresAt: string;
      createdAt: string;
      invitedUser: {
        id: string;
        name: string | null;
        discordTag: string | null;
        image: string | null;
        minecraftUsername: string | null;
      };
    }>;
    tournament: {
      id: string;
      teamMode: "SOLO" | "DUO" | "TRIO";
      status: string;
      startDate: string;
    };
  };
};

function playersPerTeamFromMode(mode: "SOLO" | "DUO" | "TRIO") {
  if (mode === "TRIO") return 3;
  if (mode === "DUO") return 2;
  return 1;
}

function userLabel(u: EligibleUser) {
  return u.minecraftUsername || u.discordTag || u.name || u.id;
}

function pickableUsers({
  eligibleUsers,
  selectedIds,
  index,
}: {
  eligibleUsers: EligibleUser[];
  selectedIds: string[];
  index: number;
}) {
  const chosen = new Set(selectedIds.filter(Boolean));
  const current = selectedIds[index] ?? "";
  return current ? eligibleUsers : eligibleUsers.filter((u) => !chosen.has(u.id));
}

export function TournamentSignupDialog({
  tournamentId,
  teamMode,
  children,
}: {
  tournamentId: string;
  teamMode: "SOLO" | "DUO" | "TRIO";
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [eligibleUsers, setEligibleUsers] = useState<EligibleUser[]>([]);
  const [myEntry, setMyEntry] = useState<MyEntryResponse["entry"]>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [qrByToken, setQrByToken] = useState<Record<string, string>>({});
  const [inviteDelivery, setInviteDelivery] = useState<"SITE" | "LINK" | "QR">("SITE");

  const requiredPlayers = playersPerTeamFromMode(teamMode);
  const acceptedPlayersCount = myEntry?.players.length ?? 0;
  const missingPlayers = Math.max(0, requiredPlayers - acceptedPlayersCount);
  const canManage =
    !!session?.user?.id && (!!myEntry ? myEntry.status === "PENDING" : true) && missingPlayers >= 0;

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    (async () => {
      try {
        const [entryRes, eligibleRes] = await Promise.all([
          fetch(`/api/tournaments/${tournamentId}/my-entry`, { cache: "no-store" }),
          fetch(`/api/tournaments/${tournamentId}/eligible-users`, { cache: "no-store" }),
        ]);

        const entryData = (await entryRes.json()) as MyEntryResponse;
        if (!entryRes.ok)
          throw new Error((entryData as any)?.error || "Errore nel recupero iscrizione");

        const eligibleData = (await eligibleRes.json()) as EligibleUser[];
        if (!eligibleRes.ok)
          throw new Error((eligibleData as any)?.error || "Errore nel recupero utenti");

        setMyEntry(entryData.entry);
        setEligibleUsers(eligibleData);
      } catch (e: any) {
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, tournamentId]);

  useEffect(() => {
    if (!open) return;
    setSelectedIds((prev) => Array.from({ length: missingPlayers }, (_, i) => prev[i] ?? ""));
  }, [missingPlayers, open]);

  const inviteUrlForToken = useCallback(
    (token: string) =>
      typeof window === "undefined" ? "" : `${window.location.origin}/tournament-invites/${token}`,
    []
  );

  const ensureQr = useCallback(
    async (token: string) => {
      if (qrByToken[token]) return;
      const url = inviteUrlForToken(token);
      if (!url) return;
      const dataUrl = await buildCustomQrDataUrl({
        text: url,
        size: 240,
        foreground: "#06b6d4",
        background: "#ffffff",
        logoUrl: "/logo.png",
      });
      setQrByToken((prev) => ({ ...prev, [token]: dataUrl }));
    },
    [inviteUrlForToken, qrByToken]
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      toast.error("Devi effettuare l'accesso");
      return;
    }

    if (requiredPlayers === 1) {
      setSubmitting(true);
      try {
        const res = await fetch(`/api/tournaments/${tournamentId}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inviteeIds: [] }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Errore iscrizione");
        toast.success("Iscrizione completata!");
        setOpen(false);
        router.refresh();
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setSubmitting(false);
      }
      return;
    }

    const picked = selectedIds.map((v) => v.trim()).filter(Boolean);
    const unique = new Set(picked);
    if (picked.length !== missingPlayers || unique.size !== picked.length) {
      toast.error(`Seleziona esattamente ${missingPlayers} utenti diversi`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteeIds: picked }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore iscrizione");

      toast.success("Inviti inviati!");

      const entryRes = await fetch(`/api/tournaments/${tournamentId}/my-entry`, {
        cache: "no-store",
      });
      const entryData = (await entryRes.json()) as MyEntryResponse;
      if (entryRes.ok) {
        setMyEntry(entryData.entry);
      }

      if (inviteDelivery === "QR") {
        const tokens: string[] = Array.isArray((data as any)?.invites)
          ? (data as any).invites.map((i: any) => i?.token).filter(Boolean)
          : [];
        await Promise.all(tokens.map((t) => ensureQr(t)));
      }

      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const pendingInvites = (myEntry?.invites ?? []).filter((i) => i.status === "PENDING");
  const pendingTokensKey = useMemo(
    () =>
      pendingInvites
        .map((i) => i.token)
        .sort()
        .join(","),
    [pendingInvites]
  );

  useEffect(() => {
    if (!open) return;
    if (inviteDelivery !== "QR") return;
    const tokens = pendingTokensKey ? pendingTokensKey.split(",").filter(Boolean) : [];
    if (tokens.length === 0) return;
    void Promise.all(tokens.map((t) => ensureQr(t)));
  }, [ensureQr, inviteDelivery, open, pendingTokensKey]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle className="gradient-text text-2xl">Iscriviti</DialogTitle>
          <DialogDescription className="text-[var(--text-secondary)]">
            Torneo {teamMode} • {requiredPlayers} player richiesti.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-[var(--text-secondary)]">Caricamento...</div>
        ) : (
          <div className="space-y-5">
            {!session?.user?.minecraftUsername && (
              <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3 text-sm text-yellow-200">
                Collega prima il nick Minecraft in <span className="font-semibold">Settings</span>{" "}
                per poter iscriverti o essere invitato.
              </div>
            )}

            {myEntry?.status === "REGISTERED" && (
              <div className="border-cyan/20 bg-cyan/10 rounded-lg border p-3 text-sm text-cyan-100">
                Iscrizione completa. Sei già registrato per questo torneo.
              </div>
            )}

            {myEntry?.status === "PENDING" && (
              <div className="rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-[var(--text-secondary)]">
                Iscrizione in sospeso: mancano {missingPlayers} player.
              </div>
            )}

            <form onSubmit={submit} className="space-y-4">
              {requiredPlayers === 1 ? (
                <Button
                  type="submit"
                  className="w-full"
                  variant="cyan"
                  disabled={submitting || myEntry?.status === "REGISTERED"}
                >
                  {submitting ? "Iscrizione..." : "Conferma Iscrizione"}
                </Button>
              ) : (
                <>
                  <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                    <div className="mb-2 text-sm font-semibold text-white">Metodo invito</div>
                    <div className="text-xs text-[var(--text-secondary)]">
                      L’invito arriva sempre come{" "}
                      <span className="font-semibold text-white">notifica sul sito</span>. In più
                      puoi copiare un link o mostrare un QR.
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={inviteDelivery === "SITE" ? "cyan" : "outline"}
                        onClick={() => setInviteDelivery("SITE")}
                      >
                        Notifica (default)
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={inviteDelivery === "LINK" ? "cyan" : "outline"}
                        onClick={() => setInviteDelivery("LINK")}
                      >
                        Link invito
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={inviteDelivery === "QR" ? "cyan" : "outline"}
                        onClick={() => setInviteDelivery("QR")}
                      >
                        QR code
                      </Button>
                    </div>
                  </div>

                  {Array.from({ length: missingPlayers }).map((_, idx) => (
                    <div key={idx}>
                      <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                        {missingPlayers === 1 ? "Scegli 1 compagno" : `Scegli compagno ${idx + 1}`}
                      </label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-between"
                            disabled={!canManage || submitting || myEntry?.status === "REGISTERED"}
                          >
                            <span className="truncate">
                              {(() => {
                                const id = selectedIds[idx] ?? "";
                                if (!id) return "Seleziona utente";
                                const u = eligibleUsers.find((x) => x.id === id);
                                return u ? userLabel(u) : "Seleziona utente";
                              })()}
                            </span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="max-h-[360px] w-[min(520px,calc(100vw-2rem))] overflow-y-auto">
                          <DropdownMenuLabel>Seleziona utente</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              setSelectedIds((prev) => {
                                const next = [...prev];
                                next[idx] = "";
                                return next;
                              })
                            }
                          >
                            Rimuovi selezione
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioGroup
                            value={selectedIds[idx] ?? ""}
                            onValueChange={(value) =>
                              setSelectedIds((prev) => {
                                const next = [...prev];
                                next[idx] = value;
                                return next;
                              })
                            }
                          >
                            {pickableUsers({ eligibleUsers, selectedIds, index: idx }).map((u) => (
                              <DropdownMenuRadioItem key={u.id} value={u.id}>
                                {userLabel(u)}
                              </DropdownMenuRadioItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}

                  <Button
                    type="submit"
                    className="w-full"
                    variant="cyan"
                    disabled={
                      submitting || myEntry?.status === "REGISTERED" || missingPlayers === 0
                    }
                  >
                    {submitting ? "Invio inviti..." : "Invia Inviti"}
                  </Button>
                </>
              )}
            </form>

            {pendingInvites.length > 0 && (
              <div className="space-y-3 rounded-lg border border-white/10 bg-black/20 p-4">
                <div className="text-sm font-semibold text-white">Inviti pendenti</div>
                <div className="space-y-3">
                  {pendingInvites.map((inv) => {
                    const url = inviteUrlForToken(inv.token);
                    return (
                      <div
                        key={inv.token}
                        className="rounded-md border border-white/10 bg-black/10 p-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="text-sm text-white">
                            {inv.invitedUser.minecraftUsername ||
                              inv.invitedUser.discordTag ||
                              inv.invitedUser.id}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={async () => {
                                await navigator.clipboard.writeText(url);
                                toast.success("Link copiato!");
                              }}
                            >
                              Copia link
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={async () => {
                                await ensureQr(inv.token);
                              }}
                            >
                              QR
                            </Button>
                          </div>
                        </div>

                        {inviteDelivery === "LINK" && (
                          <div className="overflow-wrap-anywhere mt-3 rounded-md border border-white/10 bg-black/15 p-2 text-xs text-[var(--text-secondary)]">
                            {url}
                          </div>
                        )}

                        {inviteDelivery === "QR" && qrByToken[inv.token] && (
                          <div className="mt-3 flex items-center justify-center">
                            <Image
                              src={qrByToken[inv.token]}
                              alt="QR Code invito"
                              width={240}
                              height={240}
                              unoptimized
                              className="h-[240px] w-[240px] rounded bg-white p-2"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
