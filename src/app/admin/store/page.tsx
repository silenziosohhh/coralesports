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

  const [categories, products, recentOrders, stats] = await Promise.all([
    prisma.shopCategory.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        _count: {
          select: { products: true },
        },
      },
    }),
    prisma.shopProduct.findMany({
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      include: { 
        category: true,
        _count: {
          select: { orderItems: true },
        },
      },
    }),
    prisma.shopOrder.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: { include: { product: true } }, user: true },
    }),
    prisma.shopOrder.aggregate({
      _sum: { totalCents: true },
      _count: true,
    }),
  ]);

  const totalRevenue = stats._sum.totalCents || 0;
  const totalOrders = stats._count || 0;
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const featuredProducts = products.filter(p => p.isFeatured).length;

  const pendingOrders = await prisma.shopOrder.count({
    where: { status: "PENDING" },
  });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentStats = await prisma.shopOrder.aggregate({
    where: {
      createdAt: { gte: thirtyDaysAgo },
    },
    _sum: { totalCents: true },
    _count: true,
  });

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
