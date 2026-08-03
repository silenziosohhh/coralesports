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
import { Loader2, AlertTriangle } from "lucide-react";

interface DeleteTournamentDialogProps {
  tournamentId: string;
  tournamentName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteTournamentDialog({
  tournamentId,
  tournamentName,
  open,
  onOpenChange,
}: DeleteTournamentDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/tournaments/${tournamentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete tournament");
      }

      toast.success("Torneo eliminato con successo!");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting tournament:", error);
      toast.error("Errore durante l'eliminazione del torneo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <DialogTitle>Elimina Torneo</DialogTitle>
          </div>
          <DialogDescription>
            Sei sicuro di voler eliminare il torneo <strong>{tournamentName}</strong>?
            Questa azione non può essere annullata.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">
            ⚠️ Attenzione: Eliminando questo torneo verranno eliminati anche tutti i match,
            le registrazioni dei team e i dati associati.
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Annulla
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Elimina Definitivamente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
