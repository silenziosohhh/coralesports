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

export function CreateTeamDialog({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    tag: "",
    logo: "",
    description: "",
    visibility: "PUBLIC",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Errore nella creazione del team");
      }

      toast.success("Team creato con successo!");
      setOpen(false);
      setFormData({
        name: "",
        tag: "",
        logo: "",
        description: "",
        visibility: "PUBLIC",
      });
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] glass-card border-cyan-border">
        <DialogHeader>
          <DialogTitle className="gradient-text text-2xl">Crea Nuovo Team</DialogTitle>
          <DialogDescription className="text-[var(--text-secondary)]">
            Crea il tuo team per partecipare ai tornei
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
              Nome Team *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-[var(--text-primary)]"
              placeholder="Es: Team Awesome"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
              Tag Team *
            </label>
            <input
              type="text"
              required
              value={formData.tag}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-[var(--text-primary)] uppercase"
              placeholder="Es: AWE"
              maxLength={5}
            />
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Max 5 caratteri, sarà convertito in maiuscolo
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
              Logo URL
            </label>
            <input
              type="url"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-[var(--text-primary)]"
              placeholder="https://esempio.com/logo.png"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
              Descrizione
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-[var(--text-primary)] min-h-[100px]"
              placeholder="Descrivi il tuo team..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
              Visibilità
            </label>
            <select
              value={formData.visibility}
              onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
              className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] text-[var(--text-primary)]"
            >
              <option value="PUBLIC">Pubblico</option>
              <option value="PRIVATE">Privato</option>
            </select>
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
              {loading ? "Creazione..." : "Crea Team"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
