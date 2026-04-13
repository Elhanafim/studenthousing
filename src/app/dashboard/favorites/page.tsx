import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Mes favoris" };

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const userId = (session.user as any).id as string;

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: { listing: { include: { images: { take: 1 } } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Mes favoris</h1>
        <p className="text-gray-600 text-sm mt-1">{favorites.length} logement{favorites.length !== 1 ? "s" : ""} sauvegardé{favorites.length !== 1 ? "s" : ""}</p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white rounded-2xl ring-1 ring-gray-200 py-20 text-center">
          <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" aria-hidden="true" />
          <p className="text-gray-500 text-sm font-medium mb-4">Aucun favori pour l&apos;instant</p>
          <Link href="/search" className="inline-flex px-6 py-2.5 brand-gradient text-white text-sm font-semibold rounded-xl hover:shadow-md transition-shadow">
            Explorer les logements
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {favorites.map(({ listing }) => (
            <Link key={listing.id} href={`/listings/${listing.id}`}
              className="group bg-white rounded-2xl ring-1 ring-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-44 overflow-hidden bg-gray-100">
                {listing.images[0] ? (
                  <Image src={listing.images[0].url} alt={listing.title} fill className="object-cover group-hover:scale-[1.02] transition-transform duration-300" sizes="(max-width: 640px) 100vw, 50vw" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Heart className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-900 truncate mb-1">{listing.title}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                  <MapPin className="w-3 h-3" aria-hidden="true" />
                  {listing.neighborhood ? `${listing.neighborhood}, ` : ""}{listing.city}
                </div>
                <span className="text-sm font-semibold text-gray-900">{listing.price.toLocaleString()} MAD <span className="text-xs text-gray-500 font-normal">/mois</span></span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
