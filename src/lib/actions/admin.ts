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

export async function getUnverifiedListings() {
  const adminId = await requireAdmin();
  if (!adminId) return { error: "Accès réservé aux administrateurs." };

  const listings = await prisma.listing.findMany({
    where: { isVerified: false, isActive: true },
    include: {
      host: { select: { id: true, name: true, email: true, isVerified: true } },
      images: { take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });
  return { listings };
}

export async function approveListing(listingId: string) {
  const adminId = await requireAdmin();
  if (!adminId) return { error: "Accès réservé aux administrateurs." };

  await prisma.listing.update({ where: { id: listingId }, data: { isVerified: true } });
  revalidatePath("/admin");
  return { success: true };
}

export async function rejectListing(listingId: string, reason?: string) {
  const adminId = await requireAdmin();
  if (!adminId) return { error: "Accès réservé aux administrateurs." };

  await prisma.listing.update({ where: { id: listingId }, data: { isActive: false } });
  revalidatePath("/admin");
  return { success: true };
}

export async function getUnverifiedUsers() {
  const adminId = await requireAdmin();
  if (!adminId) return { error: "Accès réservé aux administrateurs." };

  const users = await prisma.user.findMany({
    where: { identityVerified: false, isVerified: false },
    select: { id: true, name: true, email: true, role: true, createdAt: true, applicationFile: { select: { cinUrl: true, isComplete: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return { users };
}

export async function approveUserIdentity(userId: string) {
  const adminId = await requireAdmin();
  if (!adminId) return { error: "Accès réservé aux administrateurs." };

  await prisma.user.update({
    where: { id: userId },
    data: { identityVerified: true, isVerified: true },
  });
  revalidatePath("/admin");
  return { success: true };
}
