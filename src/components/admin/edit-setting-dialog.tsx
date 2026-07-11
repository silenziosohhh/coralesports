"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface EditSettingDialogProps {
  settingKey: string;
  settingLabel: string;
  currentValue: string;
  description?: string;
  type?: "text" | "number" | "boolean";
  onUpdate?: () => void;
}

export function EditSettingDialog({
  settingKey,
  settingLabel,
  currentValue,
  description,
  type = "text",
  onUpdate,
}: EditSettingDialogProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(currentValue);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: settingKey,
          value: type === "boolean" ? (value === "true" ? "true" : "false") : value,
        }),
      });

      if (!response.ok) {
        throw new Error("Errore durante l'aggiornamento");
      }

      toast.success("Impostazione aggiornata con successo!");
      setOpen(false);
      
      // Refresh the page to show updated values
      if (onUpdate) {
        onUpdate();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating setting:", error);
      toast.error("Errore durante l'aggiornamento dell'impostazione");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Modifica
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glass-card border-cyan/20">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-white">{settingLabel}</DialogTitle>
            {description && (
              <DialogDescription className="text-gray">{description}</DialogDescription>
            )}
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="value" className="text-white">
                Valore
              </Label>
              {type === "boolean" ? (
                <select
                  id="value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-cyan/20 bg-slate-dark px-3 py-2 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2"
                >
                  <option value="true">Attivo</option>
                  <option value="false">Disattivo</option>
                </select>
              ) : (
                <Input
                  id="value"
                  type={type}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="border-cyan/20 bg-slate-dark text-white"
                  required
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Annulla
            </Button>
            <Button type="submit" variant="cyan" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvataggio...
                </>
              ) : (
                "Salva"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
