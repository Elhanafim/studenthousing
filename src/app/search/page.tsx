import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Heart, Building } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import SearchFilters from "@/components/listings/SearchFilters";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Rechercher un logement | StudentHome.ma",
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    city?: string;
    type?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const { q, city, type, minPrice, maxPrice } = params;

  const listings = await prisma.listing.findMany({
    where: {
      isActive: true,
      ...(city && { city }),
      ...(type && { type: type as any }),
      ...(minPrice || maxPrice
        ? {
            price: {
              ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
              ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}),
            },
          }
        : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { neighborhood: { contains: q, mode: "insensitive" } },
              { city: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { images: true, host: true },
    orderBy: { createdAt: "desc" },
    take: 24,
  });

  const TYPE_LABELS: Record<string, string> = {
    ROOM: "Chambre",
    STUDIO: "Studio",
    APARTMENT: "Appartement",
    COLIVING: "Coliving",
  };

  return (
    <div className="min-h-screen bg-[#FAFBFE]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-primary tracking-tight mb-2">
            {listings.length > 0
              ? `${listings.length} logement${listings.length > 1 ? "s" : ""} disponible${listings.length > 1 ? "s" : ""}`
              : "Aucun résultat"}
          </h1>
          <p className="text-gray-500 font-light">
            {city ? `dans ${city}` : "partout au Maroc"}{" "}
            {type ? `· ${TYPE_LABELS[type] ?? type}` : ""}
          </p>
        </div>

        {/* Filters (wrapped in Suspense because useSearchParams is inside) */}
        <div className="mb-10">
          <Suspense fallback={<div className="h-16 bg-white rounded-2xl animate-pulse" />}>
            <SearchFilters />
          </Suspense>
        </div>

        {/* Listings grid */}
        {listings.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building className="w-12 h-12 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-400 mb-4">Aucun logement trouvé</h2>
            <p className="text-gray-400 font-light mb-8">
              Essayez de modifier vos critères de recherche.
            </p>
            <Link
              href="/search"
              className="clay-gradient text-white px-8 py-4 rounded-2xl font-bold inline-block shadow hover:shadow-lg transition-all"
            >
              Voir tous les logements
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="bg-white rounded-[2rem] overflow-hidden group shadow-sm hover:shadow-2xl transition-all border border-gray-100"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={
                      listing.images[0]?.url ||
                      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800"
                    }
                    alt={listing.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-[10px] font-black text-primary border border-white/40">
                    {TYPE_LABELS[listing.type] ?? listing.type}
                  </div>
                  <div className="absolute top-4 right-4 w-9 h-9 glass rounded-full flex items-center justify-center text-primary hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4" />
                  </div>
                </div>

                {/* Content */}
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

                  {/* Amenities chips */}
                  {Array.isArray(listing.amenities) && (listing.amenities as string[]).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(listing.amenities as string[]).slice(0, 3).map((am) => (
                        <span
                          key={am}
                          className="text-[10px] bg-gray-50 text-gray-400 px-3 py-1 rounded-full uppercase tracking-wider font-bold"
                        >
                          {am}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Rating & host */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-1 text-sm font-bold">
                      <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                      <span>4.8</span>
                    </div>
                    <div className="flex items-center gap-2">
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
