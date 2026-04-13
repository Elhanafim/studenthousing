import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import VisitsClient from "@/components/dashboard/VisitsClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Mes visites" };

export default async function VisitsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const userId = (session.user as any).id as string;

  // Slots the user hosts
  const hostedSlots = await prisma.visitSlot.findMany({
    where: { hostId: userId },
    include: {
      listing: { select: { id: true, title: true } },
      bookedBy: { select: { name: true, email: true } },
    },
    orderBy: { date: "asc" },
  });

  // Slots the user booked
  const bookedSlots = await prisma.visitSlot.findMany({
    where: { bookedByUserId: userId },
    include: {
      listing: { select: { id: true, title: true } },
      host: { select: { name: true, email: true } },
    },
    orderBy: { date: "asc" },
  });

  // Listings belonging to user (for adding new slots)
  const myListings = await prisma.listing.findMany({
    where: { hostId: userId, isActive: true },
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <VisitsClient
      hostedSlots={JSON.parse(JSON.stringify(hostedSlots))}
      bookedSlots={JSON.parse(JSON.stringify(bookedSlots))}
      myListings={myListings}
    />
  );
}
