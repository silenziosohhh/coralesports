"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertTriangle, Loader2 } from "lucide-react";

export function LeaveTeamDialog({
  teamId,
  teamName,
  isOwner,
  open,
  onOpenChange,
}: {
  teamId: string;
  teamName: string;
  isOwner: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLeave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/teams/${teamId}/leave`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore durante l'uscita dal team");

      toast.success(isOwner ? "Team sciolto con successo" : "Sei uscito dal team");
      onOpenChange(false);
      router.push("/teams");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Errore durante l'uscita dal team");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <DialogTitle>{isOwner ? "Sciogli Team" : "Esci dal Team"}</DialogTitle>
          </div>
          <DialogDescription>
            {isOwner ? (
              <>
                Stai per sciogliere il team <strong>{teamName}</strong>. Questa azione non può essere annullata.
              </>
            ) : (
              <>
                Vuoi uscire dal team <strong>{teamName}</strong>?
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {isOwner && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-sm text-red-400">
              Uscendo da owner il team verrà sciolto e i membri verranno rimossi.
            </p>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Annulla
          </Button>
          <Button type="button" variant="destructive" onClick={handleLeave} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isOwner ? "Sciogli" : "Esci"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

