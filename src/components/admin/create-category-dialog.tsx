"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { createStoreCategory } from "@/app/admin/store/actions";

export function CreateCategoryDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    sortOrder: "0",
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createStoreCategory({
        ...formData,
        sortOrder: parseInt(formData.sortOrder) || 0,
      });

      toast.success("Categoria creata con successo!");
      setOpen(false);
      setFormData({
        name: "",
        slug: "",
        description: "",
        sortOrder: "0",
        isActive: true,
      });
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Errore durante la creazione della categoria");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Nuova Categoria
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crea Nuova Categoria</DialogTitle>
          <DialogDescription>
            Aggiungi una nuova categoria per organizzare i prodotti dello shop.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cat-name">Nome Categoria *</Label>
              <Input
                id="cat-name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    name: e.target.value,
                    slug: formData.slug || generateSlug(e.target.value),
                  });
                }}
                placeholder="Es: Ranks"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cat-slug">Slug (URL) *</Label>
              <Input
                id="cat-slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="ranks"
                required
              />
              <p className="text-xs text-white/60">URL: /shop?category={formData.slug || "slug"}</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cat-description">Descrizione</Label>
              <Textarea
                id="cat-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrizione della categoria..."
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cat-sort">Ordine di visualizzazione</Label>
              <Input
                id="cat-sort"
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                placeholder="0"
                min="0"
              />
              <p className="text-xs text-white/60">Le categorie con numero più basso appaiono prima</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="cat-active"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 rounded border-white/10 bg-white/5 text-[var(--color-accent)]"
              />
              <Label htmlFor="cat-active" className="cursor-pointer">
                Categoria Attiva
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Annulla
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creazione..." : "Crea Categoria"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
