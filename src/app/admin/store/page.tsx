import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminStoreClient } from "./admin-store-client";

export default async function AdminStorePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");

  const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";
  if (!isAdmin) redirect("/dashboard");

  // eslint-disable-next-line react-hooks/purity
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [categories, products, recentOrderRows, stats, pendingOrders, recentStats] =
    await Promise.all([
      prisma.shopCategory.findMany({
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: {
          id: true,
          name: true,
          slug: true,
          isActive: true,
          _count: { select: { products: true } },
        },
      }),
      prisma.shopProduct.findMany({
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          priceCents: true,
          currency: true,
          imageUrl: true,
          isFeatured: true,
          isActive: true,
          categoryId: true,
          category: { select: { name: true } },
          _count: { select: { orderItems: true } },
        },
      }),
      prisma.shopOrder.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        select: {
          id: true,
          totalCents: true,
          currency: true,
          status: true,
          createdAt: true,
          user: { select: { name: true, discordTag: true } },
          items: {
            select: {
              quantity: true,
              product: { select: { name: true } },
            },
          },
        },
      }),
      prisma.shopOrder.aggregate({
        _sum: { totalCents: true },
        _count: true,
      }),
      prisma.shopOrder.count({ where: { status: "PENDING" } }),
      prisma.shopOrder.aggregate({
        where: { createdAt: { gte: thirtyDaysAgo } },
        _sum: { totalCents: true },
        _count: true,
      }),
    ]);

  const recentOrders = recentOrderRows.map((order) => ({
    ...order,
    createdAt: order.createdAt.toISOString(),
  }));

  const totalRevenue = stats._sum.totalCents || 0;
  const totalOrders = stats._count || 0;
  const totalProducts = products.length;
  const activeProducts = products.filter((product) => product.isActive).length;
  const featuredProducts = products.filter((product) => product.isFeatured).length;

  return (
    <AdminStoreClient
      categories={categories}
      products={products}
      recentOrders={recentOrders}
      stats={{
        totalRevenue,
        totalOrders,
        totalProducts,
        activeProducts,
        featuredProducts,
        pendingOrders,
        recentRevenue: recentStats._sum.totalCents || 0,
        recentOrders: recentStats._count,
      }}
    />
  );
}
