import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/money";
import { Button } from "@/components/ui/button";

export default async function StoreProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.shopProduct.findFirst({
    where: { slug: params.slug, isActive: true },
    select: {
      id: true,
      slug: true,
      name: true,
      shortDescription: true,
      description: true,
      imageUrl: true,
      galleryUrls: true,
      priceCents: true,
      currency: true,
      deliveryHint: true,
      category: { select: { name: true, slug: true } },
    },
  });

  if (!product) notFound();

  const galleryUrls = Array.isArray(product.galleryUrls)
    ? product.galleryUrls.filter((url): url is string => typeof url === "string")
    : [];
  const mainImage = product.imageUrl || galleryUrls[0] || null;
  const priceLabel = formatPrice(product.priceCents, product.currency);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="text-sm text-white/60">
            <Link href="/store" className="hover:text-white">
              Store
            </Link>
            {product.category ? (
              <>
                <span className="mx-2">/</span>
                <span className="text-white/80">{product.category.name}</span>
              </>
            ) : null}
          </div>
          <Button variant="outline" asChild className="border-white/15 bg-white/5 text-white hover:bg-white/10">
            <Link href="/store">← Torna allo store</Link>
          </Button>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--bg-secondary)]/70">
            <div className="relative aspect-[16/11] w-full">
              {mainImage ? (
                <Image src={mainImage} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              ) : (
                <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--bg-secondary)_0%,rgba(0,183,255,0.15)_50%,var(--bg-secondary)_100%)]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            {galleryUrls.length > 0 ? (
              <div className="grid grid-cols-4 gap-2 p-4">
                {galleryUrls.slice(0, 4).map((url) => (
                  <div key={url} className="relative aspect-[16/11] overflow-hidden rounded-lg border border-white/10">
                    <Image src={url} alt="" fill sizes="25vw" className="object-cover" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">{product.name}</h1>
            {product.shortDescription ? (
              <p className="mt-3 text-pretty text-white/70">{product.shortDescription}</p>
            ) : null}

            <div className="mt-6 rounded-2xl border border-white/10 bg-[var(--bg-secondary)]/60 p-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold tracking-widest text-white/60">PREZZO</div>
                  <div className="mt-1 text-3xl font-black text-[var(--color-accent)]">{priceLabel}</div>
                </div>
                <Button variant="highlight" className="h-12 px-6 text-base" asChild>
                  <Link href="/auth/signin">Acquista</Link>
                </Button>
              </div>

              <div className="mt-4 text-sm text-white/70">
                {product.deliveryHint ?? "Consegna in-game automatica o assistita dallo staff dopo l'acquisto."}
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <div className="text-xs font-semibold tracking-widest text-white/60">DETTAGLI</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/80">
                {product.description ? (
                  <div className="whitespace-pre-wrap leading-relaxed">{product.description}</div>
                ) : (
                  <div className="text-white/60">Nessun dettaglio aggiuntivo.</div>
                )}
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
              Acquistando confermi che si tratta di articoli virtuali utilizzabili esclusivamente in-game su CoralMC.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
