"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Tags, ShoppingCart, TrendingUp, DollarSign, Eye } from "lucide-react";
import { formatPrice } from "@/lib/money";
import { CreateProductDialog } from "@/components/admin/create-product-dialog";
import { CreateCategoryDialog } from "@/components/admin/create-category-dialog";
import { ViewOrdersDialog } from "@/components/admin/view-orders-dialog";
import { EditProductDialog } from "@/components/admin/edit-product-dialog";
import { DeleteProductDialog } from "@/components/admin/delete-product-dialog";

type Category = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  _count: { products: number };
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  priceCents: number;
  currency: string;
  imageUrl: string | null;
  isFeatured: boolean;
  isActive: boolean;
  categoryId: string | null;
  category: { name: string } | null;
  _count: { orderItems: number };
};

type Order = {
  id: string;
  totalCents: number;
  currency: string;
  status: string;
  createdAt: string;
  user: { name: string | null; discordTag: string | null } | null;
  items: {
    quantity: number;
    product: { name: string };
  }[];
};

type Stats = {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  activeProducts: number;
  featuredProducts: number;
  pendingOrders: number;
  recentRevenue: number;
  recentOrders: number;
};

export function AdminStoreClient({
  categories,
  products,
  recentOrders,
  stats,
}: {
  categories: Category[];
  products: Product[];
  recentOrders: Order[];
  stats: Stats;
}) {
  return (
    <main className="admin-page-shell min-h-screen px-4 pb-32 pt-28 sm:pt-32">
      <div className="admin-page-content mx-auto w-full max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">
              Gestionale <span className="text-[var(--color-accent)]">Store</span>
            </h1>
            <p className="mt-2 text-white/60">
              Gestisci categorie, prodotti e ordini del tuo store.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/dashboard">← Dashboard</Link>
            </Button>
            <Button asChild className="gap-2">
              <Link href="/store">
                <Eye className="h-4 w-4" />
                Visualizza Store
              </Link>
            </Button>
          </div>
        </div>

        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-card border-cyan/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/60">Fatturato Totale</p>
                  <p className="mt-2 text-3xl font-black text-white">
                    {formatPrice(stats.totalRevenue, "EUR")}
                  </p>
                  <p className="mt-1 text-xs text-white/50">
                    {formatPrice(stats.recentRevenue, "EUR")} ultimi 30gg
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15">
                  <DollarSign className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-cyan/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/60">Ordini Totali</p>
                  <p className="mt-2 text-3xl font-black text-white">{stats.totalOrders}</p>
                  <p className="mt-1 text-xs text-white/50">{stats.recentOrders} ultimi 30gg</p>
                </div>
                <div className="bg-[var(--color-accent)]/15 flex h-12 w-12 items-center justify-center rounded-xl">
                  <ShoppingCart className="h-6 w-6 text-[var(--color-accent)]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-cyan/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/60">Prodotti</p>
                  <p className="mt-2 text-3xl font-black text-white">{stats.totalProducts}</p>
                  <p className="mt-1 text-xs text-white/50">
                    {stats.activeProducts} attivi • {stats.featuredProducts} in evidenza
                  </p>
                </div>
                <div className="bg-[var(--color-secondary)]/15 flex h-12 w-12 items-center justify-center rounded-xl">
                  <Package className="h-6 w-6 text-[var(--color-secondary)]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-cyan/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/60">Ordini in Sospeso</p>
                  <p className="mt-2 text-3xl font-black text-white">{stats.pendingOrders}</p>
                  <p className="mt-1 text-xs text-white/50">Da processare</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15">
                  <TrendingUp className="h-6 w-6 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <CreateProductDialog categories={categories} />
          <CreateCategoryDialog />
          <ViewOrdersDialog orders={recentOrders} />
          <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
            <Link href="/store">
              <Eye className="h-5 w-5" />
              <span>Anteprima Store</span>
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="glass-card border-cyan/20">
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Tags className="h-5 w-5 text-[var(--color-secondary)]" />
                <CardTitle>Categorie ({categories.length})</CardTitle>
              </div>
              <CreateCategoryDialog />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.length === 0 ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                    Nessuna categoria.
                  </div>
                ) : (
                  categories.slice(0, 5).map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-white">{c.name}</div>
                        <div className="text-xs text-white/60">
                          /{c.slug} • {c._count.products} prodotti
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {c.isActive ? (
                          <Badge className="bg-emerald-500/15 text-emerald-200">ATTIVA</Badge>
                        ) : (
                          <Badge className="bg-red-500/15 text-red-200">DISATTIVA</Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-cyan/20">
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-[var(--color-accent)]" />
                <CardTitle>Ordini Recenti</CardTitle>
              </div>
              <ViewOrdersDialog orders={recentOrders} />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrders.length === 0 ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                    Nessun ordine.
                  </div>
                ) : (
                  recentOrders.slice(0, 5).map((o) => (
                    <div
                      key={o.id}
                      className="block rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="font-semibold text-white">
                            {formatPrice(o.totalCents, o.currency)}
                          </div>
                          <div className="text-xs text-white/60">
                            {o.user?.discordTag || o.user?.name || "Guest"} •{" "}
                            {new Date(o.createdAt).toLocaleDateString("it-IT")}
                          </div>
                        </div>
                        <Badge
                          className={
                            o.status === "PAID"
                              ? "bg-emerald-500/15 text-emerald-200"
                              : o.status === "PENDING"
                                ? "bg-amber-500/15 text-amber-200"
                                : "bg-white/10 text-white"
                          }
                        >
                          {o.status}
                        </Badge>
                      </div>
                      <div className="mt-2 text-xs text-white/70">
                        {o.items.map((i, idx) => `${i.quantity}× ${i.product.name}`).join(" • ")}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card border-cyan/20 mt-6">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-[var(--color-accent)]" />
              <CardTitle>Prodotti ({products.length})</CardTitle>
            </div>
            <CreateProductDialog categories={categories} />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {products.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                  Nessun prodotto.
                </div>
              ) : (
                products.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      {p.imageUrl && (
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-white/10">
                          <Image
                            src={p.imageUrl}
                            alt={p.name}
                            fill
                            unoptimized
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="font-semibold text-white">{p.name}</div>
                          {p.isFeatured && (
                            <Badge className="bg-cyan/15 text-cyan">⭐ FEATURED</Badge>
                          )}
                          {p.isActive ? (
                            <Badge className="bg-emerald-500/15 text-emerald-200">ATTIVO</Badge>
                          ) : (
                            <Badge className="bg-red-500/15 text-red-200">DISATTIVO</Badge>
                          )}
                        </div>
                        <div className="mt-1 text-xs text-white/60">
                          /{p.slug} • {formatPrice(p.priceCents, p.currency)}{" "}
                          {p.category && `• ${p.category.name}`}
                          {p._count.orderItems > 0 && ` • ${p._count.orderItems} vendite`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <EditProductDialog product={p} categories={categories} />
                      <DeleteProductDialog product={p} />
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/store/${p.slug}`}>Anteprima</Link>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
