import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/money";
import { Button } from "@/components/ui/button";
import { CompetitionPageShell } from "@/components/competition/competition-page-shell";

export default async function StoreProductPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
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
    <CompetitionPageShell
      eyebrow={product.category ? `Store · ${product.category.name}` : "Store CoralMC"}
      title={product.name}
      description={
        product.shortDescription ??
        "Articolo virtuale utilizzabile esclusivamente in-game su CoralMC."
      }
      action={
        <Button variant="outline" asChild size="lg" className="h-12 rounded-xl px-6 font-black">
          <Link href="/store">← Torna allo store</Link>
        </Button>
      }
    >
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <article
          data-reveal="left"
          className="relative overflow-hidden rounded-[28px] border-2 border-white/20 bg-[#061b3b]/68 shadow-[0_26px_70px_rgba(0,20,65,0.34)] backdrop-blur-2xl"
        >
          <div className="relative aspect-[16/11] w-full">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#03142b_0%,rgba(0,183,255,0.18)_50%,#03142b_100%)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>

          {galleryUrls.length > 0 ? (
            <div className="grid grid-cols-4 gap-2 p-4">
              {galleryUrls.slice(0, 4).map((url) => (
                <div key={url} className="relative aspect-[16/11] overflow-hidden rounded-lg border border-white/14">
                  <Image src={url} alt="" fill sizes="25vw" className="object-cover" />
                </div>
              ))}
            </div>
          ) : null}
        </article>

        <article
          data-reveal="right"
          data-reveal-delay="0.12"
          className="relative overflow-hidden rounded-[28px] border-2 border-white/20 bg-[#061b3b]/68 p-6 shadow-[0_26px_70px_rgba(0,20,65,0.34)] backdrop-blur-2xl sm:p-8"
        >
          <div aria-hidden className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#57ffff]/16 blur-3xl" />

          <div className="relative rounded-2xl border border-white/14 bg-white/[0.06] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.14em] text-white/52">Prezzo</div>
                <div className="mt-1 text-4xl font-black tracking-[-0.04em] text-[#57ffff]">{priceLabel}</div>
              </div>
              <Button variant="highlight" size="lg" className="h-12 rounded-xl px-6 font-black" asChild>
                <Link href="/auth/signin">Acquista</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/62">
              {product.deliveryHint ?? "Consegna in-game automatica o assistita dallo staff dopo l'acquisto."}
            </p>
          </div>

          <div className="relative mt-6">
            <div className="text-[10px] font-black uppercase tracking-[0.14em] text-white/52">Dettagli</div>
            <div className="mt-3 rounded-2xl border border-white/14 bg-white/[0.05] p-5 text-white/78">
              {product.description ? (
                <div className="whitespace-pre-wrap leading-relaxed">{product.description}</div>
              ) : (
                <div className="text-white/48">Nessun dettaglio aggiuntivo.</div>
              )}
            </div>
          </div>

          <p className="relative mt-6 rounded-2xl border border-white/14 bg-white/[0.05] p-5 text-sm leading-relaxed text-white/62">
            Acquistando confermi che si tratta di articoli virtuali utilizzabili esclusivamente in-game su CoralMC.
          </p>
        </article>
      </div>
    </CompetitionPageShell>
  );
}
