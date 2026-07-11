import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/money";
import StorePageClient from "@/app/store/store-page-client";

export const metadata = {
  title: "Store | CoralMC eSports",
  description: "Acquista articoli virtuali e supporta CoralMC.",
};

export default async function StorePage() {
  const [categories, products, featuredProducts] = await Promise.all([
    prisma.shopCategory.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, slug: true, name: true, description: true },
    }),
    prisma.shopProduct.findMany({
      where: { isActive: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        slug: true,
        name: true,
        shortDescription: true,
        imageUrl: true,
        priceCents: true,
        currency: true,
        isFeatured: true,
        category: { select: { name: true, slug: true } },
      },
    }),
    prisma.shopProduct.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        slug: true,
        name: true,
        shortDescription: true,
        imageUrl: true,
        priceCents: true,
        currency: true,
        category: { select: { name: true, slug: true } },
      },
    }),
  ]);

  const mappedProducts = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortDescription: p.shortDescription,
    imageUrl: p.imageUrl,
    priceLabel: formatPrice(p.priceCents, p.currency),
    priceCents: p.priceCents,
    isFeatured: p.isFeatured,
    categoryName: p.category?.name ?? null,
    categorySlug: p.category?.slug ?? null,
  }));

  const mappedFeatured = featuredProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortDescription: p.shortDescription,
    imageUrl: p.imageUrl,
    priceLabel: formatPrice(p.priceCents, p.currency),
    categoryName: p.category?.name ?? null,
    categorySlug: p.category?.slug ?? null,
  }));

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-0 bg-gradient-to-br from-[var(--bg-secondary)] via-[var(--bg-primary)] to-[var(--bg-primary)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(77,206,255,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(0,183,255,0.1)_0%,transparent_50%)]" />
        
        <div className="container relative mx-auto px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
              <span className="text-[var(--color-accent)]">CoralMC</span> Store
            </h1>
            <p className="mt-6 text-lg text-white/70 sm:text-xl">
              Supporta il server e sblocca vantaggi esclusivi in-game. Tutti gli acquisti sono articoli virtuali.
            </p>
          </div>
        </div>
      </div>

      <div className="container relative mx-auto px-4 py-12">
        {/* Featured Products */}
        {mappedFeatured.length > 0 && (
          <div className="mb-16">
            <div className="mb-8 flex items-center gap-3">
              <div className="h-1 w-12 bg-gradient-to-r from-[var(--color-accent)] to-transparent" />
              <h2 className="text-3xl font-black text-white">Prodotti in Evidenza</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mappedFeatured.map((p) => (
                <Link
                  key={p.id}
                  href={`/store/${p.slug}`}
                  className="group relative overflow-hidden rounded-2xl border bg-[var(--bg-secondary)]/70 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-[var(--color-accent)]/50 hover:shadow-[0_0_30px_rgba(77,206,255,0.3)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    {p.imageUrl ? (
                      <Image
                        src={p.imageUrl}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--bg-secondary)_0%,rgba(0,183,255,0.15)_50%,var(--bg-secondary)_100%)]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute right-3 top-3 rounded-full bg-[var(--color-accent)]/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                      ⭐ FEATURED
                    </div>
                  </div>

                  <div className="relative p-6">
                    {p.categoryName && (
                      <div className="mb-2 text-xs font-semibold tracking-widest text-[var(--color-accent)]">
                        {p.categoryName.toUpperCase()}
                      </div>
                    )}
                    <h3 className="mb-2 text-xl font-bold text-white">{p.name}</h3>
                    {p.shortDescription && (
                      <p className="mb-4 line-clamp-2 text-sm text-white/60">{p.shortDescription}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-black text-[var(--color-accent)]">{p.priceLabel}</div>
                      <div className="text-sm text-white/60 transition-colors group-hover:text-white">
                        Scopri di più →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Products with Filters */}
        <div className="mb-8 flex items-center gap-3">
          <div className="h-1 w-12 bg-gradient-to-r from-[var(--color-secondary)] to-transparent" />
          <h2 className="text-3xl font-black text-white">Tutti i Prodotti</h2>
        </div>

        <StorePageClient categories={categories} products={mappedProducts} />

        {products.length === 0 && (
          <div className="mt-16 rounded-2xl border bg-[var(--bg-secondary)]/60 p-12 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
              <svg className="h-10 w-10 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-lg text-white/70">Nessun prodotto disponibile al momento.</p>
            <p className="mt-2 text-sm text-white/50">Torna più tardi per scoprire le novità!</p>
          </div>
        )}

        {/* Legal Notice */}
        <div className="mt-12 rounded-2xl border-0 bg-[var(--bg-secondary)]/60 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/15">
              <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-white">Avviso Importante</div>
              <div className="mt-2 text-sm text-white/70">
                Gli acquisti sono valuta/oggetti virtuali utilizzabili esclusivamente in-game su CoralMC. Non sono
                convertibili in denaro e non hanno valore nel mondo reale. Effettuando un acquisto, accetti i nostri
                termini di servizio.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
