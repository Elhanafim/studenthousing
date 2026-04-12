import { prisma } from "@/lib/prisma";
import ListingDetailClient from "@/components/listings/ListingDetailClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: {
      images: true,
      host: true,
      reviews: true,
    },
  });

  if (!listing) {
    notFound();
  }

  return <ListingDetailClient listing={listing} />;
}
