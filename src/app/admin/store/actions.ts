"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function assertAdmin(session: any) {
  const role = session?.user?.role;
  if (!session || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    throw new Error("Unauthorized");
  }
}

export async function createStoreCategory(input: {
  name: string;
  slug: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}) {
  const session = await getServerSession(authOptions);
  assertAdmin(session);

  if (!input.name || !input.slug) throw new Error("Missing required fields");

  const existing = await prisma.shopCategory.findUnique({ where: { slug: input.slug } });
  if (existing) throw new Error("Slug already exists");

  await prisma.shopCategory.create({
    data: {
      name: input.name,
      slug: input.slug,
      description: input.description?.trim() ? input.description.trim() : null,
      sortOrder: input.sortOrder ?? 0,
      isActive: input.isActive !== false,
    },
  });

  revalidatePath("/admin/store");
  revalidatePath("/store");
}

export async function createStoreProduct(input: {
  name: string;
  slug: string;
  description?: string;
  priceCents: number;
  currency?: string;
  categoryId?: string;
  imageUrl?: string;
  isFeatured?: boolean;
  isActive?: boolean;
}) {
  const session = await getServerSession(authOptions);
  assertAdmin(session);

  if (!input.name || !input.slug || input.priceCents === undefined) throw new Error("Missing required fields");

  const existing = await prisma.shopProduct.findUnique({ where: { slug: input.slug } });
  if (existing) throw new Error("Slug already exists");

  await prisma.shopProduct.create({
    data: {
      name: input.name,
      slug: input.slug,
      description: input.description?.trim() ? input.description.trim() : null,
      priceCents: Math.max(0, Math.trunc(input.priceCents)),
      currency: input.currency || "EUR",
      categoryId: input.categoryId || null,
      imageUrl: input.imageUrl?.trim() ? input.imageUrl.trim() : null,
      isFeatured: input.isFeatured === true,
      isActive: input.isActive !== false,
    },
  });

  revalidatePath("/admin/store");
  revalidatePath("/store");
}

export async function updateStoreProduct(
  id: string,
  input: {
    name: string;
    slug: string;
    description?: string;
    priceCents: number;
    currency?: string;
    categoryId?: string | null;
    imageUrl?: string;
    isFeatured?: boolean;
    isActive?: boolean;
  }
) {
  const session = await getServerSession(authOptions);
  assertAdmin(session);

  if (!id) throw new Error("Missing id");
  if (!input.name || !input.slug || input.priceCents === undefined) throw new Error("Missing required fields");

  const existing = await prisma.shopProduct.findFirst({
    where: {
      slug: input.slug,
      id: { not: id },
    },
  });
  if (existing) throw new Error("Slug already exists");

  await prisma.shopProduct.update({
    where: { id },
    data: {
      name: input.name,
      slug: input.slug,
      description: input.description?.trim() ? input.description.trim() : null,
      priceCents: Math.max(0, Math.trunc(input.priceCents)),
      currency: input.currency || "EUR",
      imageUrl: input.imageUrl?.trim() ? input.imageUrl.trim() : null,
      categoryId: input.categoryId || null,
      isFeatured: input.isFeatured === true,
      isActive: input.isActive !== false,
    },
  });

  revalidatePath("/admin/store");
  revalidatePath("/store");
}

export async function deleteStoreProduct(id: string) {
  const session = await getServerSession(authOptions);
  assertAdmin(session);

  if (!id) throw new Error("Missing id");

  const orderCount = await prisma.shopOrderItem.count({ where: { productId: id } });
  if (orderCount > 0) {
    throw new Error("Cannot delete product with existing orders. Consider deactivating it instead.");
  }

  await prisma.shopProduct.delete({ where: { id } });
  revalidatePath("/admin/store");
  revalidatePath("/store");
}
