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
import { CheckCircle2, Loader2 } from "lucide-react";

type Props = {
  tournamentId: string;
  tournamentName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function FinishTournamentDialog({ tournamentId, tournamentName, open, onOpenChange }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/tournaments/${tournamentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "FINISHED",
          endDate: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to finish tournament");

      toast.success("Torneo terminato con successo!");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error finishing tournament:", error);
      toast.error("Errore durante la chiusura del torneo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <DialogTitle>Termina evento</DialogTitle>
          </div>
          <DialogDescription>
            Vuoi segnare <strong>{tournamentName}</strong> come <strong>FINISHED</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-white/70">
            Questa azione chiude l&apos;evento e imposta la data di fine a &quot;adesso&quot;.
          </p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Annulla
          </Button>
          <Button type="button" className="bg-green-500 text-black hover:bg-green-500/90" onClick={handleFinish} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Termina
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

