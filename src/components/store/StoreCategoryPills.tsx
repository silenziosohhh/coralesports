"use client";

import { cn } from "@/lib/utils";

type Category = { id: string; slug: string; name: string; description?: string | null };

export function StoreCategoryPills({
  categories,
  activeSlug,
  onChange,
}: {
  categories: Category[];
  activeSlug: string | null;
  onChange: (slug: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={cn(
          "rounded-full border px-4 py-2 text-sm font-semibold transition-all",
          activeSlug === null
            ? "border-[var(--color-accent)] bg-[var(--color-accent)]/20 text-white shadow-[0_0_15px_rgba(77,206,255,0.3)]"
            : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
        )}
      >
        Tutti
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.slug)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-semibold transition-all",
            activeSlug === cat.slug
              ? "border-[var(--color-accent)] bg-[var(--color-accent)]/20 text-white shadow-[0_0_15px_rgba(77,206,255,0.3)]"
              : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
