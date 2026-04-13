import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Building, ShieldCheck } from "lucide-react";
import SearchFilters from "@/components/listings/SearchFilters";
import EmptyState from "@/components/shared/EmptyState";
import { Suspense } from "react";
import { CardSkeleton } from "@/components/shared/LoadingSkeleton";

export const dynamic = "force-dynamic";

export const metadata = { title: "Rechercher un logement | StudentHome.ma" };

const TYPE_LABELS: Record<string, string> = {
  ROOM: "Chambre",
  STUDIO: "Studio",
  APARTMENT: "Appartement",
  COLIVING: "Coliving",
  HOMESTAY: "Chez l'habitant",
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string; city?: string; type?: string;
    minPrice?: string; maxPrice?: string;
    availableFrom?: string; verifiedOnly?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const { q, city, type, minPrice, maxPrice, availableFrom, verifiedOnly } = params;

  const listings = await prisma.listing.findMany({
    where: {
      isActive: true,
      ...(city && { city }),
      ...(type && { type: type as any }),
      ...(minPrice || maxPrice ? {
        price: {
          ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
          ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}),
        },
      } : {}),
      ...(availableFrom ? { availableFrom: { lte: new Date(availableFrom) } } : {}),
      ...(verifiedOnly === "true" ? { host: { isVerified: true } } : {}),
      ...(q ? {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { neighborhood: { contains: q, mode: "insensitive" } },
          { city: { contains: q, mode: "insensitive" } },
        ],
      } : {}),
    },
    include: { images: true, host: true },
    orderBy: { createdAt: "desc" },
    take: 48,
  });

  return (
    <div className="min-h-screen bg-[#FAFBFE]">

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-primary tracking-tight mb-2">
            {listings.length > 0
              ? `${listings.length} logement${listings.length > 1 ? "s" : ""} disponible${listings.length > 1 ? "s" : ""}`
              : "Aucun résultat"}
          </h1>
          <p className="text-gray-500 font-light">
            {city ? `dans ${city}` : "partout au Maroc"}
            {type ? ` · ${TYPE_LABELS[type] ?? type}` : ""}
          </p>
        </div>

        <div className="mb-10">
          <Suspense fallback={<div className="h-20 bg-white rounded-2xl animate-pulse" />}>
            <SearchFilters />
          </Suspense>
        </div>

        {listings.length === 0 ? (
          <EmptyState
            icon={<Building className="w-12 h-12" />}
            title="Aucun logement trouvé"
            description="Essayez de modifier vos critères de recherche ou explorez d'autres villes."
            action={{ label: "Voir tous les logements", href: "/search" }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="bg-white rounded-[2rem] overflow-hidden group shadow-sm hover:shadow-2xl transition-all border border-gray-100"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={listing.images[0]?.url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800"}
                    alt={listing.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-[10px] font-black text-primary border border-white/40">
                    {TYPE_LABELS[listing.type] ?? listing.type}
                  </div>
                  {listing.isVerified && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-2.5 py-1 rounded-full flex items-center gap-1 text-[10px] font-black">
                      <ShieldCheck className="w-3 h-3" /> Vérifié
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-lg text-primary truncate">{listing.title}</h3>
                      <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          {listing.neighborhood ? `${listing.neighborhood}, ` : ""}
                          {listing.city}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4 shrink-0">
                      <div className="text-accent font-black text-lg">{listing.price.toLocaleString()} MAD</div>
                      <div className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">/ mois</div>
                    </div>
                  </div>

                  {Array.isArray(listing.amenities) && (listing.amenities as string[]).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(listing.amenities as string[]).slice(0, 3).map((am) => (
                        <span key={am} className="text-[10px] bg-gray-50 text-gray-400 px-3 py-1 rounded-full uppercase tracking-wider font-bold">
                          {am}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-1 text-sm font-bold">
                      <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                      <span>4.8</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {listing.host?.isVerified && (
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                      )}
                      <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white text-[10px] font-black">
                        {listing.host?.name?.charAt(0) ?? "H"}
                      </div>
                      <span className="text-xs text-gray-400 font-medium truncate max-w-[80px]">
                        {listing.host?.name ?? "Hôte"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
