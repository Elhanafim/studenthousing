"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createVisitSlot(data: {
  listingId: string;
  date: string;        // ISO string
  durationMinutes?: number;
}) {
  const session = await auth();
  if (!session?.user) return { error: "Non autorisé." };
  const hostId = (session.user as any).id as string;

  // Verify the listing belongs to this host
  const listing = await prisma.listing.findUnique({ where: { id: data.listingId } });
  if (!listing || listing.hostId !== hostId) return { error: "Annonce introuvable." };

  const slot = await prisma.visitSlot.create({
    data: {
      listingId: data.listingId,
      hostId,
      date: new Date(data.date),
      durationMinutes: data.durationMinutes ?? 30,
    },
  });

  revalidatePath(`/dashboard/visits`);
  revalidatePath(`/listings/${data.listingId}`);
  return { success: true, slot };
}

export async function deleteVisitSlot(slotId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Non autorisé." };
  const userId = (session.user as any).id as string;

  const slot = await prisma.visitSlot.findUnique({ where: { id: slotId } });
  if (!slot) return { error: "Créneau introuvable." };
  if (slot.hostId !== userId) return { error: "Non autorisé." };
  if (slot.isBooked) return { error: "Ce créneau est déjà réservé." };

  await prisma.visitSlot.delete({ where: { id: slotId } });
  revalidatePath("/dashboard/visits");
  return { success: true };
}

export async function bookVisitSlot(slotId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Non autorisé." };
  const tenantId = (session.user as any).id as string;

  const slot = await prisma.visitSlot.findUnique({
    where: { id: slotId },
    include: { listing: true, host: true },
  });

  if (!slot) return { error: "Créneau introuvable." };
  if (slot.isBooked) return { error: "Ce créneau est déjà réservé." };
  if (slot.hostId === tenantId) return { error: "Vous ne pouvez pas réserver votre propre créneau." };
  if (new Date(slot.date) < new Date()) return { error: "Ce créneau est passé." };

  const updated = await prisma.visitSlot.update({
    where: { id: slotId },
    data: { isBooked: true, bookedByUserId: tenantId },
  });

  // Notify host via in-app message
  await prisma.message.create({
    data: {
      senderId: tenantId,
      receiverId: slot.hostId,
      listingId: slot.listingId,
      content: `Bonjour, j'ai réservé le créneau de visite du ${new Date(slot.date).toLocaleDateString("fr-MA", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })} à ${new Date(slot.date).toLocaleTimeString("fr-MA", { hour: "2-digit", minute: "2-digit" })} pour votre annonce "${slot.listing.title}".`,
    },
  });

  revalidatePath(`/listings/${slot.listingId}`);
  revalidatePath("/dashboard/visits");
  return { success: true, slot: updated };
}

export async function getListingVisitSlots(listingId: string) {
  const now = new Date();
  const slots = await prisma.visitSlot.findMany({
    where: {
      listingId,
      date: { gte: now },
      isBooked: false,
    },
    orderBy: { date: "asc" },
    take: 14,
  });
  return slots;
}

export async function getHostVisitSlots(hostId: string) {
  const slots = await prisma.visitSlot.findMany({
    where: { hostId },
    include: { listing: { select: { title: true } }, bookedBy: { select: { name: true, email: true } } },
    orderBy: { date: "asc" },
  });
  return slots;
}
