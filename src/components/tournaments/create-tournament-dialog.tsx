"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { validateTournamentDates } from "@/lib/tournament-rules";

export function CreateTournamentDialog({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    rules: "",
    banner: "",
    format: "SINGLE_ELIMINATION",
    teamMode: "SOLO",
    playersPerTeam: "1",
    minTeams: "2",
    prizePool: "",
    registrationStart: "",
    registrationEnd: "",
    startDate: "",
    endDate: "",
    checkInStart: "",
    checkInEnd: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dateValidation = validateTournamentDates({
        registrationStart: formData.registrationStart ? new Date(formData.registrationStart) : null,
        registrationEnd: formData.registrationEnd ? new Date(formData.registrationEnd) : null,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
      });
      if (!dateValidation.ok) {
        throw new Error(dateValidation.error);
      }

      const res = await fetch("/api/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Errore nella creazione del torneo");
      }

      toast.success("Torneo creato con successo!");
      setOpen(false);
      setFormData({
        name: "",
        description: "",
        rules: "",
        banner: "",
        format: "SINGLE_ELIMINATION",
        teamMode: "SOLO",
        playersPerTeam: "1",
        minTeams: "2",
        prizePool: "",
        registrationStart: "",
        registrationEnd: "",
        startDate: "",
        endDate: "",
        checkInStart: "",
        checkInEnd: "",
      });
      router.refresh();
      router.push(`/tournaments/${data.id}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="gradient-text text-2xl">Crea Nuovo Torneo</DialogTitle>
          <DialogDescription className="text-[var(--text-secondary)]">
            Configura tutti i dettagli del torneo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-primary)]">Informazioni Base</h3>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                Nome Torneo *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-[var(--text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
                placeholder="Es: Torneo Estivo 2026"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                Descrizione
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[100px] w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-[var(--text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
                placeholder="Descrivi il torneo..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                Ruleset
              </label>
              <textarea
                required
                value={formData.rules}
                onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                className="min-h-[100px] w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-[var(--text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
                placeholder="Regole del torneo..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                Banner URL *
              </label>
              <input
                type="url"
                required
                value={formData.banner}
                onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-[var(--text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
                placeholder="https://esempio.com/banner.png"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-primary)]">Configurazione</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                  Formato *
                </label>
                <select
                  required
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-[var(--text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
                >
                  <option value="SINGLE_ELIMINATION">Eliminazione Singola</option>
                  <option value="DOUBLE_ELIMINATION">Eliminazione Doppia</option>
                  <option value="ROUND_ROBIN">Round Robin</option>
                  <option value="SWISS">Swiss</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                  Prize Pool
                </label>
                <input
                  type="text"
                  value={formData.prizePool}
                  onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-[var(--text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="Es: €1000"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                Team Minimi *
              </label>
              <input
                type="number"
                required
                min="2"
                value={formData.minTeams}
                onChange={(e) => setFormData({ ...formData, minTeams: e.target.value })}
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-[var(--text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
              />
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Le iscrizioni non hanno limite massimo di team.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                Modalità Team *
              </label>
              <select
                required
                value={formData.teamMode}
                onChange={(e) => {
                  const teamMode = e.target.value;
                  const playersPerTeam = teamMode === "TRIO" ? "3" : teamMode === "DUO" ? "2" : "1";
                  setFormData({ ...formData, teamMode, playersPerTeam });
                }}
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-[var(--text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
              >
                <option value="SOLO">SOLO</option>
                <option value="DUO">DUO</option>
                <option value="TRIO">TRIO</option>
              </select>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Determina quanti player servono per iscriversi.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                Player per Team
              </label>
              <input
                type="number"
                value={formData.playersPerTeam}
                readOnly
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-[var(--text-primary)] opacity-60"
              />
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Derivato dalla modalità team (SOLO/DUO/TRIO).
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-primary)]">Date</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                  Inizio Iscrizioni
                </label>
                <input
                  type="datetime-local"
                  value={formData.registrationStart}
                  onChange={(e) => setFormData({ ...formData, registrationStart: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-[var(--text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                  Fine Iscrizioni
                </label>
                <input
                  type="datetime-local"
                  value={formData.registrationEnd}
                  onChange={(e) => setFormData({ ...formData, registrationEnd: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-[var(--text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                  Data Inizio Torneo *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-[var(--text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                  Data Fine Torneo *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-[var(--text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                  Inizio Check-in
                </label>
                <input
                  type="datetime-local"
                  value={formData.checkInStart}
                  onChange={(e) => setFormData({ ...formData, checkInStart: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-[var(--text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                  Fine Check-in
                </label>
                <input
                  type="datetime-local"
                  value={formData.checkInEnd}
                  onChange={(e) => setFormData({ ...formData, checkInEnd: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-[var(--text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="flex-1"
            >
              Annulla
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creazione..." : "Crea Torneo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
