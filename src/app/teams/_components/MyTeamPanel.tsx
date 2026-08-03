"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Check, Crown, Inbox, Loader2, UserPlus, X } from "lucide-react";
import { InviteTeamDialog } from "@/components/teams/invite-team-dialog";
import { TeamAvatar } from "@/components/teams/team-avatar";
import type { DirectoryTeam } from "./TeamDirectory";

type JoinRequest = {
  id: string;
  message: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
    discordTag: string | null;
    minecraftUsername: string | null;
    elo: number;
  };
};

export function MyTeamPanel({ team, isCaptain }: { team: DirectoryTeam; isCaptain: boolean }) {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    if (!isCaptain) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/teams/${team.id}/join`);
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) setRequests(data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [isCaptain, team.id]);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const resolve = async (requestId: string, action: "accept" | "decline") => {
    setBusyId(requestId);
    try {
      const res = await fetch(`/api/teams/${team.id}/join/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Operazione non riuscita");

      setRequests((current) => current.filter((request) => request.id !== requestId));
      toast.success(action === "accept" ? "Giocatore aggiunto al team" : "Richiesta rifiutata");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section
      aria-label="Il tuo team"
      className="mb-6 overflow-hidden rounded-[26px] border-2 border-[#57ffff]/35 bg-[linear-gradient(120deg,rgba(87,255,255,0.09),rgba(6,27,59,0.78))] shadow-[0_22px_60px_rgba(0,20,65,0.3)] backdrop-blur-2xl"
    >
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <TeamAvatar team={team} size={62} showSourceHint />
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#57ffff]">
              Il tuo team
            </p>
            <h2 className="mt-0.5 truncate text-2xl font-black tracking-[-0.03em] text-white">
              {team.name}
            </h2>
            <p className="mt-0.5 text-xs font-semibold text-white/45">
              {team.tag} · {team.members.length} giocatori · {team.elo} ELO
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          {isCaptain ? (
            <InviteTeamDialog teamId={team.id} teamName={team.name}>
              <button
                type="button"
                className="inline-flex h-11 items-center gap-2 rounded-xl border-[3px] border-[#007fda] bg-[#0bb5ff] px-4 text-sm font-black text-[#00152b] shadow-[0_5px_0_rgba(0,66,132,0.45)] transition-transform hover:scale-[1.02] active:translate-y-0.5"
              >
                <UserPlus className="h-4 w-4" />
                Invita giocatori
              </button>
            </InviteTeamDialog>
          ) : null}
          <Link
            href={`/teams/${team.id}`}
            className="inline-flex h-11 items-center gap-2 rounded-xl border-2 border-white/25 bg-white/[0.07] px-4 text-sm font-black text-white transition-colors hover:border-[#57ffff]/60 hover:text-[#57ffff]"
          >
            Gestisci
          </Link>
        </div>
      </div>

      {isCaptain ? (
        <div className="border-t border-white/12 bg-[rgba(3,14,35,0.35)] px-5 py-4">
          <div className="mb-3 flex items-center gap-2">
            <Inbox className="h-4 w-4 text-[#57ffff]" />
            <span className="text-[11px] font-black uppercase tracking-[0.16em] text-white/55">
              Richieste di ingresso
            </span>
            {requests.length ? (
              <span className="rounded-full bg-[#57ffff] px-2 py-0.5 text-[10px] font-black text-[#00204a]">
                {requests.length}
              </span>
            ) : null}
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin text-white/35" /> : null}
          </div>

          {requests.length ? (
            <ul className="space-y-2">
              <AnimatePresence initial={false}>
                {requests.map((request) => {
                  const label =
                    request.user.minecraftUsername ||
                    request.user.discordTag ||
                    request.user.name ||
                    request.user.id;
                  return (
                    <motion.li
                      key={request.id}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 24 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/[0.05] p-2.5"
                    >
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white/20 bg-[#0b233b]">
                        {request.user.image ? (
                          <Image
                            src={request.user.image}
                            alt={label}
                            fill
                            sizes="40px"
                            className="object-cover [image-rendering:pixelated]"
                          />
                        ) : (
                          <span className="absolute inset-0 grid place-items-center text-[10px] font-black text-white/50">
                            {label.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-white">{label}</p>
                        <p className="truncate text-[11px] text-white/40">
                          {request.user.elo} ELO
                          {request.message ? ` · ${request.message}` : ""}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1.5">
                        <button
                          type="button"
                          onClick={() => resolve(request.id, "accept")}
                          disabled={busyId === request.id}
                          aria-label={`Accetta ${label}`}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-emerald-400/45 bg-emerald-400/12 text-emerald-300 transition-colors hover:bg-emerald-400/25 disabled:opacity-45"
                        >
                          {busyId === request.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => resolve(request.id, "decline")}
                          disabled={busyId === request.id}
                          aria-label={`Rifiuta ${label}`}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-rose-400/45 bg-rose-400/12 text-rose-300 transition-colors hover:bg-rose-400/25 disabled:opacity-45"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          ) : (
            <p className="text-xs text-white/38">
              Nessuna richiesta in sospeso. Condividi un link invito per far entrare i tuoi
              compagni.
            </p>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 border-t border-white/12 bg-[rgba(3,14,35,0.35)] px-5 py-3 text-xs font-semibold text-white/45">
          <Crown className="h-3.5 w-3.5 text-[#ffd63d]" />
          Solo i capitani possono invitare o accettare nuovi giocatori.
        </div>
      )}
    </section>
  );
}
