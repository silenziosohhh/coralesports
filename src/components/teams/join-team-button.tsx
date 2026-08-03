"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import { Check, Clock3, Loader2, LogIn, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

type JoinState = "idle" | "sending" | "pending" | "member";

export function JoinTeamButton({
  teamId,
  teamName,
  isMember,
  hasPendingRequest = false,
  isFull = false,
  className,
}: {
  teamId: string;
  teamName: string;
  isMember: boolean;
  hasPendingRequest?: boolean;
  isFull?: boolean;
  className?: string;
}) {
  const { status } = useSession();
  const [state, setState] = useState<JoinState>(
    isMember ? "member" : hasPendingRequest ? "pending" : "idle",
  );

  const base = cn(
    "inline-flex min-h-[2.75rem] w-full items-center justify-center gap-2 rounded-xl border-2 px-4 text-sm font-black transition-all duration-300",
    className,
  );

  if (status === "unauthenticated") {
    return (
      <Link
        href="/auth/signin"
        className={cn(base, "border-white/25 bg-white/[0.07] text-white hover:border-[#57ffff]/60 hover:text-[#57ffff]")}
      >
        <LogIn className="h-4 w-4" />
        Accedi per entrare
      </Link>
    );
  }

  if (state === "member") {
    return (
      <span className={cn(base, "cursor-default border-emerald-400/40 bg-emerald-400/10 text-emerald-300")}>
        <Check className="h-4 w-4" />
        Sei in questo team
      </span>
    );
  }

  if (state === "pending") {
    return (
      <span className={cn(base, "cursor-default border-amber-400/40 bg-amber-400/10 text-amber-300")}>
        <Clock3 className="h-4 w-4" />
        Richiesta inviata
      </span>
    );
  }

  const requestJoin = async () => {
    setState("sending");
    try {
      const res = await fetch(`/api/teams/${teamId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Impossibile inviare la richiesta");

      setState("pending");
      toast.success(`Richiesta inviata a ${teamName}`);
    } catch (error: any) {
      setState("idle");
      toast.error(error.message);
    }
  };

  return (
    <button
      type="button"
      onClick={requestJoin}
      disabled={state === "sending" || isFull}
      className={cn(
        base,
        "border-[#007fda] bg-[#0bb5ff] text-[#00152b] shadow-[0_5px_0_rgba(0,66,132,0.45)] hover:scale-[1.02] active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100",
      )}
    >
      {state === "sending" ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <UserPlus className="h-4 w-4" />
      )}
      {isFull ? "Roster completo" : "Chiedi di entrare"}
    </button>
  );
}
