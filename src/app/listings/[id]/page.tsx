import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import ListingDetailClient from "@/components/listings/ListingDetailClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const sessionUser = session?.user as any;

  const [listing, existingBooking, dbUser] = await Promise.all([
    prisma.listing.findUnique({
      where: { id },
      include: { images: true, host: true, reviews: true },
    }),
    sessionUser?.id
      ? prisma.bookingRequest.findUnique({
          where: { tenantId_listingId: { tenantId: sessionUser.id, listingId: id } },
          select: { id: true, status: true },
        })
      : null,
    sessionUser?.id
      ? prisma.user.findUnique({
          where: { id: sessionUser.id },
          select: { role: true, applicationFile: { select: { id: true } } },
        })
      : null,
  ]);

  if (!listing) notFound();

  const currentUser = sessionUser?.id
    ? { id: sessionUser.id, role: dbUser?.role ?? "STUDENT" }
    : null;

  const hasDossier = !!dbUser?.applicationFile;

  return (
    <>
      <ListingDetailClient
        listing={listing}
        currentUser={currentUser}
        existingBooking={existingBooking}
        hasDossier={hasDossier}
      />
    </>
  );
}
