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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { playersPerTeamFromMode, validateTournamentDates } from "@/lib/tournament-rules";

function toLocalDatetimeInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

interface Tournament {
  id: string;
  name: string;
  description: string | null;
  banner: string | null;
  format: string;
  teamMode: string;
  playersPerTeam: number;
  maxTeams: number;
  prizePool: string | null;
  registrationStart: Date | string | null;
  registrationEnd: Date | string | null;
  startDate: Date | string;
  endDate: Date | string | null;
  status: string;
  rules: string | null;
}

interface EditTournamentDialogProps {
  tournament: Tournament;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTournamentDialog({
  tournament,
  open,
  onOpenChange,
}: EditTournamentDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: tournament.name,
    banner: tournament.banner || "",
    description: tournament.description || "",
    format: tournament.format,
    teamMode: tournament.teamMode,
    playersPerTeam: tournament.playersPerTeam.toString(),
    prizePool: tournament.prizePool || "",
    registrationStart: tournament.registrationStart
      ? toLocalDatetimeInputValue(new Date(tournament.registrationStart))
      : "",
    registrationEnd: tournament.registrationEnd
      ? toLocalDatetimeInputValue(new Date(tournament.registrationEnd))
      : "",
    startDate: toLocalDatetimeInputValue(new Date(tournament.startDate)),
    endDate: tournament.endDate ? toLocalDatetimeInputValue(new Date(tournament.endDate)) : "",
    status: tournament.status,
    rules: tournament.rules || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resolvedTeamMode =
        formData.teamMode === "SOLO" || formData.teamMode === "DUO" || formData.teamMode === "TRIO"
          ? (formData.teamMode as "SOLO" | "DUO" | "TRIO")
          : null;
      if (!resolvedTeamMode) {
        throw new Error("Modalità team non valida");
      }

      const dateValidation = validateTournamentDates({
        registrationStart: formData.registrationStart ? new Date(formData.registrationStart) : null,
        registrationEnd: formData.registrationEnd ? new Date(formData.registrationEnd) : null,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
      });
      if (!dateValidation.ok) throw new Error(dateValidation.error);

      const response = await fetch(`/api/tournaments/${tournament.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          banner: formData.banner,
          description: formData.description || null,
          format: formData.format,
          teamMode: resolvedTeamMode,
          playersPerTeam: playersPerTeamFromMode(resolvedTeamMode),
          prizePool: formData.prizePool || null,
          registrationStart: formData.registrationStart || null,
          registrationEnd: formData.registrationEnd || null,
          startDate: formData.startDate,
          endDate: formData.endDate,
          status: formData.status,
          rules: formData.rules || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update tournament");
      }

      toast.success("Torneo aggiornato con successo!");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating tournament:", error);
      toast.error("Errore durante l'aggiornamento del torneo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifica Torneo</DialogTitle>
          <DialogDescription>Modifica i dettagli del torneo</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="banner">Banner URL *</Label>
              <Input
                id="banner"
                type="url"
                value={formData.banner}
                onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Nome Torneo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrizione</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="format">Formato *</Label>
              <Select
                value={formData.format}
                onValueChange={(value) => setFormData({ ...formData, format: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SINGLE_ELIMINATION">Eliminazione Singola</SelectItem>
                  <SelectItem value="DOUBLE_ELIMINATION">Doppia Eliminazione</SelectItem>
                  <SelectItem value="ROUND_ROBIN">Round Robin</SelectItem>
                  <SelectItem value="SWISS">Swiss</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="prizePool">Prize Pool</Label>
                <Input
                  id="prizePool"
                  value={formData.prizePool}
                  onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                  placeholder="es. €1000"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="teamMode">Modalità Team *</Label>
              <Select
                value={formData.teamMode}
                onValueChange={(value) => {
                  const playersPerTeam = value === "TRIO" ? "3" : value === "DUO" ? "2" : "1";
                  setFormData({ ...formData, teamMode: value, playersPerTeam });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOLO">SOLO</SelectItem>
                  <SelectItem value="DUO">DUO</SelectItem>
                  <SelectItem value="TRIO">TRIO</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="playersPerTeam">Player per Team *</Label>
              <Input id="playersPerTeam" type="number" value={formData.playersPerTeam} readOnly />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="registrationStart">Inizio Iscrizioni</Label>
                <Input
                  id="registrationStart"
                  type="datetime-local"
                  value={formData.registrationStart}
                  onChange={(e) => setFormData({ ...formData, registrationStart: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="registrationEnd">Fine Iscrizioni</Label>
                <Input
                  id="registrationEnd"
                  type="datetime-local"
                  value={formData.registrationEnd}
                  onChange={(e) => setFormData({ ...formData, registrationEnd: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Inizio Evento *</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="endDate">Fine Evento *</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="rules">Ruleset *</Label>
              <Textarea
                id="rules"
                value={formData.rules}
                onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Stato *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Bozza</SelectItem>
                  <SelectItem value="REGISTRATION_OPEN">Registrazioni Aperte</SelectItem>
                  <SelectItem value="UPCOMING">In Arrivo</SelectItem>
                  <SelectItem value="LIVE">Live</SelectItem>
                  <SelectItem value="FINISHED">Concluso</SelectItem>
                  <SelectItem value="CANCELLED">Cancellato</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salva Modifiche
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
