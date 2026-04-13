import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Building2, PlusCircle, MapPin, BadgeCheck } from "lucide-react";
import DeleteListingButton from "@/components/dashboard/DeleteListingButton";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Mes annonces" };

const TYPE_LABELS: Record<string, string> = {
  ROOM: "Chambre", STUDIO: "Studio", APARTMENT: "Appartement",
  COLIVING: "Coliving", HOMESTAY: "Chez l'habitant",
};

export default async function DashboardListingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const userId = (session.user as any).id as string;

  const listings = await prisma.listing.findMany({
    where: { hostId: userId },
    include: { images: { take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Mes annonces</h1>
          <p className="text-gray-600 text-sm mt-1">{listings.length} annonce{listings.length !== 1 ? "s" : ""} publiée{listings.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/publish" className="flex items-center gap-2 px-4 py-2 brand-gradient text-white text-sm font-semibold rounded-xl hover:shadow-md transition-shadow">
          <PlusCircle className="w-4 h-4" /> Nouvelle annonce
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="bg-white rounded-2xl ring-1 ring-gray-200 py-20 text-center">
          <Building2 className="w-12 h-12 text-gray-200 mx-auto mb-4" aria-hidden="true" />
          <p className="text-gray-500 text-sm font-medium mb-4">Aucune annonce publiée</p>
          <Link href="/publish" className="inline-flex px-6 py-2.5 brand-gradient text-white text-sm font-semibold rounded-xl hover:shadow-md transition-shadow">
            Publier ma première annonce
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl ring-1 ring-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {listings.map((l) => (
              <div key={l.id} className="flex items-center gap-4 px-6 py-5 hover:bg-gray-50 transition-colors">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  {l.images[0] ? (
                    <Image src={l.images[0].url} alt={l.title} fill className="object-cover" sizes="64px" />
                  ) : (
                    <Building2 className="w-6 h-6 text-gray-300 m-auto" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate mb-0.5">{l.title}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" aria-hidden="true" />
                    {l.neighborhood ? `${l.neighborhood}, ` : ""}{l.city}
                    <span className="mx-1 text-gray-300">·</span>
                    {TYPE_LABELS[l.type] ?? l.type}
                  </div>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <div className="text-sm font-semibold text-gray-900">{l.price.toLocaleString()} MAD</div>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    l.isVerified ? "bg-accent-100 text-accent-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {l.isVerified && <BadgeCheck className="w-3 h-3" />}
                    {l.isVerified ? "Vérifié" : "En attente"}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/listings/${l.id}`}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    Voir
                  </Link>
                  <DeleteListingButton listingId={l.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
