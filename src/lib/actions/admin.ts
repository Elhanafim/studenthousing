"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) return null;
  const userId = (session.user as any).id as string;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (user?.role !== "ADMIN") return null;
  return userId;
}

export async function getAdminStats() {
  const adminId = await requireAdmin();
  if (!adminId) return { error: "Accès réservé." };

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [totalUsers, totalListings, pendingListings, totalMessages, newUsers, newListings] =
    await Promise.all([
      prisma.user.count({ where: { role: { not: "ADMIN" } } }),
      prisma.listing.count({ where: { isActive: true } }),
      prisma.listing.count({ where: { isVerified: false, isActive: true } }),
      prisma.message.count(),
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo }, role: { not: "ADMIN" } } }),
      prisma.listing.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    ]);

  return { totalUsers, totalListings, pendingListings, totalMessages, newUsers, newListings };
}

export async function getAllListings(status?: string) {
  const adminId = await requireAdmin();
  if (!adminId) return { error: "Accès réservé." };

  const where: any = {};
  if (status === "pending") { where.isVerified = false; where.isActive = true; }
  else if (status === "active") { where.isVerified = true; where.isActive = true; }
  else if (status === "rejected") { where.isActive = false; }

  const listings = await prisma.listing.findMany({
    where,
    include: {
      host: { select: { id: true, name: true, email: true } },
      images: { take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });
  return { listings };
}

export async function getUnverifiedListings() {
  return getAllListings("pending");
}

export async function approveListing(listingId: string) {
  const adminId = await requireAdmin();
  if (!adminId) return { error: "Accès réservé." };
  await prisma.listing.update({ where: { id: listingId }, data: { isVerified: true, isActive: true } });
  revalidatePath("/admin");
  return { success: true };
}

export async function rejectListing(listingId: string) {
  const adminId = await requireAdmin();
  if (!adminId) return { error: "Accès réservé." };
  await prisma.listing.update({ where: { id: listingId }, data: { isActive: false, isVerified: false } });
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteListing(listingId: string) {
  const adminId = await requireAdmin();
  if (!adminId) return { error: "Accès réservé." };
  await prisma.listing.delete({ where: { id: listingId } });
  revalidatePath("/admin");
  return { success: true };
}

export async function getAllUsers() {
  const adminId = await requireAdmin();
  if (!adminId) return { error: "Accès réservé." };

  const users = await prisma.user.findMany({
    where: { role: { not: "ADMIN" } },
    select: {
      id: true, name: true, email: true, role: true,
      createdAt: true, emailVerified: true, isVerified: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return { users };
}

export async function getUnverifiedUsers() {
  return getAllUsers();
}

export async function approveUserIdentity(userId: string) {
  const adminId = await requireAdmin();
  if (!adminId) return { error: "Accès réservé." };
  await prisma.user.update({
    where: { id: userId },
    data: { emailVerified: new Date(), identityVerified: true, isVerified: true },
  });
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteUser(userId: string) {
  const adminId = await requireAdmin();
  if (!adminId) return { error: "Accès réservé." };
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin");
  return { success: true };
}
