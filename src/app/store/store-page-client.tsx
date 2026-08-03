"use client";

import { useMemo, useState } from "react";
import { StoreCategoryPills } from "@/components/store/StoreCategoryPills";
import { StoreProductCard } from "@/components/store/StoreProductCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

type Category = { id: string; slug: string; name: string; description?: string | null };
type Product = {
  id: string;
  slug: string;
  name: string;
  imageUrl?: string | null;
  priceLabel: string;
  priceCents: number;
  shortDescription?: string | null;
  isFeatured?: boolean;
  categoryName: string | null;
  categorySlug: string | null;
};

export default function StorePageClient({ categories, products }: { categories: Category[]; products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "newest">("featured");
  const sortLabel =
    sortBy === "featured"
      ? "In evidenza"
      : sortBy === "newest"
        ? "Più recenti"
        : sortBy === "price-asc"
          ? "Prezzo: basso → alto"
          : "Prezzo: alto → basso";

  const filtered = useMemo(() => {
    let result = activeCategory 
      ? products.filter((p) => p.categorySlug === activeCategory)
      : products;

    switch (sortBy) {
      case "featured":
        result = [...result].sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 0;
        });
        break;
      case "price-asc":
        result = [...result].sort((a, b) => a.priceCents - b.priceCents);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.priceCents - a.priceCents);
        break;
      case "newest":
        break;
    }

    return result;
  }, [activeCategory, products, sortBy]);

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <StoreCategoryPills categories={categories} activeSlug={activeCategory} onChange={setActiveCategory} />
        
        <div className="flex items-center gap-2">
          <div className="text-sm text-white/60">Ordina:</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border-0 bg-white/5 px-3 py-2 text-sm font-semibold text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/40"
              >
                {sortLabel}
                <ChevronDown className="h-4 w-4 text-white/70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-[220px] bg-[var(--bg-secondary)] text-white shadow-2xl shadow-black/30"
            >
              <DropdownMenuLabel className="text-white/80">Ordina per</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuRadioGroup value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                <DropdownMenuRadioItem className="focus:bg-white/10 focus:text-white" value="featured">
                  In evidenza
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem className="focus:bg-white/10 focus:text-white" value="newest">
                  Più recenti
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem className="focus:bg-white/10 focus:text-white" value="price-asc">
                  Prezzo: basso → alto
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem className="focus:bg-white/10 focus:text-white" value="price-desc">
                  Prezzo: alto → basso
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border-0 bg-white/5 p-12 text-center">
          <p className="text-white/70">Nessun prodotto trovato in questa categoria.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <StoreProductCard
              key={p.id}
              slug={p.slug}
              name={p.name}
              priceLabel={p.priceLabel}
              imageUrl={p.imageUrl}
              categoryName={p.categoryName}
              shortDescription={p.shortDescription}
              isFeatured={p.isFeatured}
            />
          ))}
        </div>
      )}
    </>
  );
}
