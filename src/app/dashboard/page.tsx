import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  PlusCircle,
  MapPin,
  Building,
  CheckCircle,
  Clock,
  Search,
  Shield,
  FileText,
  MessageSquare,
  Calendar,
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import DeleteListingButton from "@/components/dashboard/DeleteListingButton";
import ListingCompletionBar from "@/components/dashboard/ListingCompletionBar";
import { computeCompletionScore } from "@/lib/utils/listing";
import { getDossierCompletionPercent } from "@/lib/utils/dossier";

export const dynamic = "force-dynamic";

export const metadata = { title: "Tableau de bord | StudentHome.ma" };

const TYPE_LABELS: Record<string, string> = {
  ROOM: "Chambre",
  STUDIO: "Studio",
  APARTMENT: "Appartement",
  COLIVING: "Coliving",
  HOMESTAY: "Chez l'habitant",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const user = session.user as { id: string; name?: string | null; email?: string | null; role?: string };

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      role: true,
      name: true,
      isVerified: true,
      university: true,
      createdAt: true,
      applicationFile: true,
    },
  });

  const isHost = dbUser?.role === "HOST";

  const listings = isHost
    ? await prisma.listing.findMany({
        where: { hostId: user.id },
        include: { images: true, reviews: true },
        orderBy: { createdAt: "desc" },
      })
    : [];

  // For hosts: count pending booking requests
  const pendingBookings = isHost
    ? await prisma.bookingRequest.count({
        where: { hostId: user.id, status: "PENDING_HOST_REVIEW" },
      })
    : 0;

  // For students: fetch bookings and dossier info
  const tenantBookings = !isHost
    ? await prisma.bookingRequest.findMany({
        where: { tenantId: user.id },
        include: { listing: { include: { images: { take: 1 } } } },
        orderBy: { updatedAt: "desc" },
        take: 3,
      })
    : [];

  const dossierPercent = getDossierCompletionPercent(dbUser?.applicationFile ?? null);

  const unreadMessages = await prisma.message.count({
    where: { receiverId: user.id, isRead: false },
  });

  const suggestedListings = !isHost
    ? await prisma.listing.findMany({
        where: { isActive: true },
        include: { images: true },
        orderBy: { createdAt: "desc" },
        take: 6,
      })
    : [];

  return (
    <div className="min-h-screen bg-[#FAFBFE]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 clay-gradient rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
              {user.name?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <div>
              <h1 className="text-3xl font-black text-primary">
                Bonjour, {user.name?.split(" ")[0]}
              </h1>
              <p className="text-gray-500 font-light mt-1">
                {isHost ? "Tableau de bord Hôte" : "Tableau de bord Étudiant"}
                {dbUser?.isVerified && (
                  <span className="ml-2 inline-flex items-center gap-1 text-accent text-xs font-bold">
                    <CheckCircle className="w-3.5 h-3.5" /> Vérifié
                  </span>
                )}
              </p>
            </div>
          </div>

          {isHost && (
            <Link
              href="/dashboard/listings/create"
              className="clay-gradient text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all w-fit"
            >
              <PlusCircle className="w-5 h-5" /> Nouvelle annonce
            </Link>
          )}
        </div>

        {/* ─── HOST VIEW ─────────────────────────────────────────── */}
        {isHost && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { label: "Annonces totales", value: listings.length, icon: <Building className="w-5 h-5" /> },
                { label: "Annonces actives", value: listings.filter((l) => l.isActive).length, icon: <CheckCircle className="w-5 h-5" /> },
                { label: "Demandes en attente", value: pendingBookings, icon: <Clock className="w-5 h-5" /> },
                { label: "Vérifiées", value: listings.filter((l) => l.isVerified).length, icon: <Shield className="w-5 h-5" /> },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm">
                  <div className="text-accent mb-3">{stat.icon}</div>
                  <div className="text-3xl font-black text-primary">{stat.value}</div>
                  <div className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Quick links */}
            <div className="flex gap-3 mb-8 flex-wrap">
              <Link href="/dashboard/bookings" className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-600 hover:text-accent hover:border-accent/30 transition-all shadow-sm">
                <Calendar className="w-4 h-4" />
                Demandes{pendingBookings > 0 && <span className="bg-accent text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">{pendingBookings}</span>}
              </Link>
              <Link href="/dashboard/messages" className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-600 hover:text-accent hover:border-accent/30 transition-all shadow-sm">
                <MessageSquare className="w-4 h-4" />
                Messages{unreadMessages > 0 && <span className="bg-accent text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">{unreadMessages}</span>}
              </Link>
            </div>

            {/* Listings */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-8 border-b border-gray-50">
                <h2 className="text-xl font-black text-primary">Mes annonces</h2>
                <Link href="/search" className="text-sm text-accent font-bold hover:underline flex items-center gap-1">
                  <Search className="w-4 h-4" /> Voir la plateforme
                </Link>
              </div>

              {listings.length === 0 ? (
                <div className="p-16 text-center">
                  <Building className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-light mb-6">Vous n&apos;avez pas encore d&apos;annonces.</p>
                  <Link href="/dashboard/listings/create" className="clay-gradient text-white px-8 py-3 rounded-2xl font-bold inline-block shadow">
                    Créer ma première annonce
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {listings.map((listing) => {
                    const score = computeCompletionScore({
                      title: listing.title,
                      description: listing.description,
                      images: listing.images,
                      price: listing.price,
                      neighborhood: listing.neighborhood,
                      amenities: listing.amenities,
                      safetyFeatures: listing.safetyFeatures,
                      availableFrom: listing.availableFrom,
                      minDuration: listing.minDuration,
                      size: listing.size,
                    });

                    return (
                      <div key={listing.id} className="flex items-center gap-5 p-6 hover:bg-gray-50/50 transition-colors">
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                          {listing.images[0] ? (
                            <Image src={listing.images[0].url} alt={listing.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Building className="w-8 h-8 text-gray-300" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-primary truncate">{listing.title}</h3>
                            <span className={`shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${listing.isVerified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                              {listing.isVerified ? "Vérifié" : "En attente"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-400 text-sm mb-2">
                            <MapPin className="w-3 h-3" />
                            {listing.neighborhood ? `${listing.neighborhood}, ` : ""}
                            {listing.city}
                            <span className="mx-2 text-gray-200">·</span>
                            <span>{TYPE_LABELS[listing.type] ?? listing.type}</span>
                          </div>
                          <ListingCompletionBar score={score} />
                        </div>

                        <div className="text-right shrink-0 space-y-2">
                          <div className="text-accent font-black">{listing.price.toLocaleString()} MAD</div>
                          <div className="flex items-center gap-3 justify-end">
                            <Link href={`/listings/${listing.id}`} className="text-xs text-gray-400 hover:text-accent transition-colors font-medium">Voir</Link>
                            <DeleteListingButton listingId={listing.id} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* ─── STUDENT VIEW ──────────────────────────────────────── */}
        {!isHost && (
          <>
            {/* Quick action cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {/* Dossier card */}
              <Link href="/dashboard/dossier" className="group bg-white rounded-[2rem] border border-gray-100 p-7 shadow-sm hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-black text-lg text-primary">Mon dossier</div>
                    <div className="text-xs text-gray-400 font-medium">{dossierPercent}% complété</div>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${dossierPercent >= 70 ? "bg-green-500" : dossierPercent >= 40 ? "bg-amber-500" : "bg-accent"}`}
                    style={{ width: `${dossierPercent}%` }}
                  />
                </div>
                {dossierPercent < 70 && (
                  <p className="text-xs text-gray-400 mt-3">Complétez votre dossier pour booster vos candidatures.</p>
                )}
              </Link>

              {/* Bookings card */}
              <Link href="/dashboard/bookings" className="group bg-white rounded-[2rem] border border-gray-100 p-7 shadow-sm hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-black text-lg text-primary">Mes demandes</div>
                    <div className="text-xs text-gray-400 font-medium">{tenantBookings.length} demande{tenantBookings.length !== 1 ? "s" : ""}</div>
                  </div>
                </div>
                {tenantBookings.length === 0 ? (
                  <p className="text-xs text-gray-400">Aucune demande pour l&apos;instant.</p>
                ) : (
                  <div className="space-y-2">
                    {tenantBookings.slice(0, 2).map((b) => (
                      <div key={b.id} className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                        <span className="truncate">{b.listing.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Link>

              {/* Messages card */}
              <Link href="/dashboard/messages" className="group bg-white rounded-[2rem] border border-gray-100 p-7 shadow-sm hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-black text-lg text-primary">Messages</div>
                    <div className="text-xs text-gray-400 font-medium">
                      {unreadMessages > 0 ? `${unreadMessages} non lu${unreadMessages > 1 ? "s" : ""}` : "Aucun message non lu"}
                    </div>
                  </div>
                </div>
                {unreadMessages > 0 && (
                  <div className="bg-accent/10 rounded-xl px-3 py-2 text-xs text-accent font-bold">
                    {unreadMessages} nouveau{unreadMessages > 1 ? "x" : ""} message{unreadMessages > 1 ? "s" : ""}
                  </div>
                )}
              </Link>
            </div>

            {/* Search shortcut */}
            <Link href="/search" className="group flex items-center gap-6 bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all mb-10">
              <div className="w-14 h-14 clay-gradient rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Search className="w-7 h-7" />
              </div>
              <div>
                <div className="font-black text-xl text-primary">Chercher un logement</div>
                <div className="text-gray-400 font-light text-sm mt-1">
                  {dbUser?.university ? `Logements proches de ${dbUser.university}` : "Parcourez des centaines d'offres vérifiées."}
                </div>
              </div>
            </Link>

            {/* Suggested listings */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-primary">Logements suggérés</h2>
                <Link href="/search" className="text-sm text-accent font-bold hover:underline">Voir tout →</Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestedListings.map((listing) => (
                  <Link key={listing.id} href={`/listings/${listing.id}`} className="bg-white rounded-[2rem] overflow-hidden group shadow-sm hover:shadow-xl transition-all border border-gray-100">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={listing.images[0]?.url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800"}
                        alt={listing.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-black text-primary truncate mb-1">{listing.title}</h3>
                      <div className="flex items-center gap-1 text-gray-400 text-sm mb-3">
                        <MapPin className="w-3 h-3" />
                        {listing.neighborhood ? `${listing.neighborhood}, ` : ""}
                        {listing.city}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-accent font-black">
                          {listing.price.toLocaleString()} MAD
                          <span className="text-[10px] text-gray-400 font-normal ml-1">/mois</span>
                        </span>
                        <span className="text-[10px] bg-gray-50 text-gray-400 px-3 py-1 rounded-full font-bold uppercase">
                          {TYPE_LABELS[listing.type] ?? listing.type}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
