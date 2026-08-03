import Link from "next/link";
import Image from "next/image";
import { Info, ShoppingBag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/money";
import { CompetitionPageShell } from "@/components/competition/competition-page-shell";
import StorePageClient from "@/app/store/store-page-client";
import { StoreComingSoon } from "@/app/store/store-coming-soon";

export const metadata = {
  title: "Store | CoralMC eSports",
  description: "Acquista articoli virtuali e supporta CoralMC.",
};

export const dynamic = "force-dynamic";

export default async function StorePage() {
  const storeData = await Promise.all([
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
  ]).catch((error) => {
    console.warn("Store data unavailable; showing the coming-soon page.", error);
    return null;
  });

  if (!storeData) return <StoreComingSoon />;

  const [categories, products] = storeData;

  if (categories.length === 0 && products.length === 0) return <StoreComingSoon />;

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

  const mappedFeatured = products
    .filter((product) => product.isFeatured)
    .slice(0, 3)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      shortDescription: p.shortDescription,
      imageUrl: p.imageUrl,
      priceLabel: formatPrice(p.priceCents, p.currency),
      categoryName: p.category?.name ?? null,
      categorySlug: p.category?.slug ?? null,
    }));

  const featuredCount = products.filter((p) => p.isFeatured).length;

  return (
    <CompetitionPageShell
      eyebrow="Supporta il server, sblocca vantaggi"
      title="CoralMC"
      accent="Store"
      description="Articoli virtuali utilizzabili in-game su CoralMC: gradi, cosmetici e bonus per la tua esperienza sul server."
      metrics={[
        { value: products.length, label: "Prodotti" },
        { value: categories.length, label: "Categorie" },
        { value: featuredCount, label: "In evidenza" },
      ]}
      contentTitle="Scegli cosa sbloccare"
      contentDescription="I prodotti in evidenza aprono la vetrina; sotto trovi il catalogo completo filtrabile per categoria."
    >
      {mappedFeatured.length > 0 && (
        <div className="mb-16">
          <div data-reveal="left" className="mb-8 flex items-center gap-3">
            <div className="h-1 w-12 bg-gradient-to-r from-[#57ffff] to-transparent" />
            <h2 className="text-3xl font-black tracking-[-0.04em] text-white">
              Prodotti in evidenza
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mappedFeatured.map((p) => (
              <article key={p.id} className="min-w-0">
                <Link
                  href={`/store/${p.slug}`}
                  className="group relative block overflow-hidden rounded-[28px] border-2 border-white/20 bg-[#061b3b]/68 shadow-[0_26px_70px_rgba(0,20,65,0.34)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#57ffff]/50"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#57ffff]/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

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
                    <div className="absolute right-3 top-3 rounded-full border border-white/20 bg-[#57ffff]/20 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                      ⭐ In evidenza
                    </div>
                  </div>

                  <div className="relative p-6">
                    {p.categoryName && (
                      <div className="mb-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#57ffff]">
                        {p.categoryName}
                      </div>
                    )}
                    <h3 className="mb-2 text-xl font-black tracking-[-0.02em] text-white">
                      {p.name}
                    </h3>
                    {p.shortDescription && (
                      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-white/62">
                        {p.shortDescription}
                      </p>
                    )}
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-2xl font-black tracking-[-0.04em] text-[#57ffff]">
                        {p.priceLabel}
                      </div>
                      <div className="text-sm font-bold text-white/60 transition-colors group-hover:text-white">
                        Scopri di più →
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}

      <div data-reveal="left" className="mb-8 flex items-center gap-3">
        <div className="h-1 w-12 bg-gradient-to-r from-[#0bb5ff] to-transparent" />
        <h2 className="text-3xl font-black tracking-[-0.04em] text-white">Tutti i prodotti</h2>
      </div>

      <StorePageClient categories={categories} products={mappedProducts} />

      {products.length === 0 && (
        <article className="relative mt-16 overflow-hidden rounded-[28px] border-2 border-white/20 bg-[#061b3b]/68 px-6 py-16 text-center shadow-[0_26px_70px_rgba(0,20,65,0.34)] backdrop-blur-2xl">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,157,255,0.14),transparent_52%)]"
          />
          <ShoppingBag className="text-cyan-300/60 relative mx-auto h-10 w-10" />
          <h3 className="relative mt-5 text-2xl font-black text-white">Vetrina in allestimento</h3>
          <p className="relative mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/45">
            Non ci sono prodotti disponibili al momento. Torna più tardi per scoprire le novità.
          </p>
        </article>
      )}

      <div
        data-reveal="right"
        className="mt-12 flex items-start gap-4 rounded-2xl border border-white/20 bg-[#061b3b]/48 px-5 py-4 backdrop-blur-xl"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-amber-500/15 text-amber-400">
          <Info className="h-5 w-5" />
        </span>
        <div>
          <div className="font-black text-white">Avviso importante</div>
          <div className="mt-2 text-sm leading-relaxed text-white/68">
            Gli acquisti sono valuta/oggetti virtuali utilizzabili esclusivamente in-game su
            CoralMC. Non sono convertibili in denaro e non hanno valore nel mondo reale. Effettuando
            un acquisto, accetti i nostri termini di servizio.
          </div>
        </div>
      </div>
    </CompetitionPageShell>
  );
}
