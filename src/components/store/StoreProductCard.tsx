"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type StoreProductCardProps = {
  slug: string;
  name: string;
  priceLabel: string;
  imageUrl?: string | null;
  categoryName?: string | null;
  shortDescription?: string | null;
  isFeatured?: boolean;
  className?: string;
};

export function StoreProductCard({
  slug,
  name,
  priceLabel,
  imageUrl,
  categoryName,
  shortDescription,
  isFeatured,
  className,
}: StoreProductCardProps) {
  return (
    <Link
      href={`/store/${slug}`}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-[var(--bg-secondary)]/70 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-[var(--color-accent)]/40 hover:shadow-[0_0_20px_rgba(77,206,255,0.2)]",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={name} 
            fill 
            sizes="(max-width: 768px) 100vw, 33vw" 
            className="object-cover transition-transform duration-300 group-hover:scale-110" 
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--bg-secondary)_0%,rgba(0,183,255,0.15)_50%,var(--bg-secondary)_100%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {isFeatured && (
          <div className="absolute right-3 top-3 rounded-full bg-[var(--color-accent)]/20 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
            ⭐ FEATURED
          </div>
        )}
      </div>

      <div className="relative p-5">
        {categoryName && (
          <div className="mb-2 text-xs font-semibold tracking-widest text-white/60">
            {categoryName.toUpperCase()}
          </div>
        )}
        <div className="mb-2 line-clamp-1 text-lg font-bold text-white">{name}</div>
        
        {shortDescription && (
          <p className="mb-3 line-clamp-2 text-sm text-white/60">{shortDescription}</p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-[var(--color-accent)]">{priceLabel}</div>
          <div className="text-xs text-white/60 transition-colors group-hover:text-white">
            Dettagli →
          </div>
        </div>
      </div>
    </Link>
  );
}
