"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { BookingStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const bookingSchema = z.object({
  listingId: z.string(),
  moveInDate: z.string().optional(),
  durationMonths: z.number().min(1).max(24).optional(),
  tenantNote: z.string().max(1000).optional(),
});

// Valid status transitions
const TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  INQUIRY: ["APPLICATION_SENT", "REJECTED"],
  APPLICATION_SENT: ["PENDING_HOST_REVIEW", "REJECTED"],
  PENDING_HOST_REVIEW: ["ACCEPTED", "REJECTED"],
  ACCEPTED: ["BOOKED"],
  REJECTED: [],
  BOOKED: [],
};

export async function createBookingRequest(data: z.infer<typeof bookingSchema>) {
  const session = await auth();
  if (!session?.user) return { error: "Non autorisé." };
  const tenantId = (session.user as any).id as string;

  try {
    const validated = bookingSchema.parse(data);

    const listing = await prisma.listing.findUnique({
      where: { id: validated.listingId },
      select: { hostId: true, title: true, isActive: true },
    });
    if (!listing) return { error: "Annonce introuvable." };
    if (!listing.isActive) return { error: "Cette annonce n'est plus disponible." };
    if (listing.hostId === tenantId) return { error: "Vous ne pouvez pas réserver votre propre annonce." };

    // Upsert — one request per tenant per listing
    const existing = await prisma.bookingRequest.findUnique({
      where: { tenantId_listingId: { tenantId, listingId: validated.listingId } },
    });
    if (existing && !["REJECTED"].includes(existing.status)) {
      return { error: "Vous avez déjà une demande en cours pour ce logement." };
    }

    const booking = await prisma.bookingRequest.upsert({
      where: { tenantId_listingId: { tenantId, listingId: validated.listingId } },
      update: {
        status: "INQUIRY",
        moveInDate: validated.moveInDate ? new Date(validated.moveInDate) : undefined,
        durationMonths: validated.durationMonths,
        tenantNote: validated.tenantNote,
        hostNote: null,
      },
      create: {
        tenantId,
        hostId: listing.hostId,
        listingId: validated.listingId,
        status: "INQUIRY",
        moveInDate: validated.moveInDate ? new Date(validated.moveInDate) : undefined,
        durationMonths: validated.durationMonths,
        tenantNote: validated.tenantNote,
      },
    });

    // Send an initial system message to the host
    await prisma.message.create({
      data: {
        content: `Nouvelle demande de visite pour votre annonce "${listing.title}"${validated.tenantNote ? `\n\nMessage : ${validated.tenantNote}` : ""}`,
        senderId: tenantId,
        receiverId: listing.hostId,
        listingId: validated.listingId,
        bookingRequestId: booking.id,
      },
    });

    revalidatePath("/dashboard/bookings");
    return { success: true, booking };
  } catch (error) {
    if (error instanceof z.ZodError) return { error: error.issues[0].message };
    console.error(error);
    return { error: "Impossible de créer la demande." };
  }
}

export async function updateBookingStatus(
  bookingId: string,
  newStatus: BookingStatus,
  hostNote?: string
) {
  const session = await auth();
  if (!session?.user) return { error: "Non autorisé." };
  const userId = (session.user as any).id as string;

  try {
    const booking = await prisma.bookingRequest.findUnique({
      where: { id: bookingId },
      include: { listing: { select: { title: true } } },
    });
    if (!booking) return { error: "Demande introuvable." };

    // Only host can update (except tenant can cancel INQUIRY)
    const isHost = booking.hostId === userId;
    const isTenant = booking.tenantId === userId;
    if (!isHost && !isTenant) return { error: "Non autorisé." };

    const allowed = TRANSITIONS[booking.status];
    if (!allowed.includes(newStatus)) {
      return { error: `Transition non autorisée : ${booking.status} → ${newStatus}` };
    }

    const updated = await prisma.bookingRequest.update({
      where: { id: bookingId },
      data: { status: newStatus, hostNote: hostNote ?? booking.hostNote },
    });

    // Notify the other party
    const notifyUserId = isHost ? booking.tenantId : booking.hostId;
    const statusMessages: Partial<Record<BookingStatus, string>> = {
      ACCEPTED: `✅ Votre demande pour "${booking.listing.title}" a été acceptée !`,
      REJECTED: `❌ Votre demande pour "${booking.listing.title}" a été refusée.${hostNote ? ` Motif : ${hostNote}` : ""}`,
      BOOKED: `🎉 Réservation confirmée pour "${booking.listing.title}" !`,
      PENDING_HOST_REVIEW: `📋 Votre dossier pour "${booking.listing.title}" est en cours d'examen.`,
    };
    const notifContent = statusMessages[newStatus];
    if (notifContent) {
      await prisma.message.create({
        data: {
          content: notifContent,
          senderId: userId,
          receiverId: notifyUserId,
          listingId: booking.listingId,
          bookingRequestId: bookingId,
        },
      });
    }

    revalidatePath("/dashboard/bookings");
    return { success: true, booking: updated };
  } catch {
    return { error: "Impossible de mettre à jour la demande." };
  }
}

export async function getBookingsForTenant(tenantId: string) {
  return prisma.bookingRequest.findMany({
    where: { tenantId },
    include: {
      listing: { include: { images: { take: 1 } } },
      host: { select: { id: true, name: true, image: true, isVerified: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getBookingsForHost(hostId: string) {
  return prisma.bookingRequest.findMany({
    where: { hostId },
    include: {
      listing: { include: { images: { take: 1 } } },
      tenant: {
        select: {
          id: true,
          name: true,
          image: true,
          university: true,
          isVerified: true,
          applicationFile: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}
