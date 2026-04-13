import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import { getBookingsForTenant, getBookingsForHost, updateBookingStatus } from "@/lib/actions/bookings";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Building, Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import { BookingStatus } from "@prisma/client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mes demandes | StudentHome.ma" };

const STATUS_STYLES: Record<BookingStatus, { label: string; cls: string }> = {
  INQUIRY: { label: "Demande envoyée", cls: "bg-blue-100 text-blue-700" },
  APPLICATION_SENT: { label: "Dossier soumis", cls: "bg-indigo-100 text-indigo-700" },
  PENDING_HOST_REVIEW: { label: "En cours d'examen", cls: "bg-amber-100 text-amber-700" },
  ACCEPTED: { label: "Acceptée", cls: "bg-green-100 text-green-700" },
  REJECTED: { label: "Refusée", cls: "bg-red-100 text-red-700" },
  BOOKED: { label: "Réservé", cls: "bg-emerald-100 text-emerald-700" },
};

export default async function BookingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const user = session.user as any;
  const userId = user.id as string;

  const dbUser = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  const isHost = dbUser?.role === "HOST";

  const tenantBookings = !isHost ? await getBookingsForTenant(userId) : [];
  const hostBookings = isHost ? await getBookingsForHost(userId) : [];

  return (
    <div className="min-h-screen bg-[#FAFBFE]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-accent font-medium transition-colors mb-4 inline-block">
            ← Tableau de bord
          </Link>
          <h1 className="text-3xl font-black text-primary">
            {isHost ? "Demandes reçues" : "Mes demandes"}
          </h1>
          <p className="text-gray-400 font-light mt-1">
            {isHost
              ? "Gérez les candidatures des étudiants."
              : "Suivez l'état de vos demandes de logement."}
          </p>
        </div>

        {/* ── STUDENT: list their own booking requests ── */}
        {!isHost && (
          <div className="space-y-4">
            {tenantBookings.length === 0 ? (
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-16 text-center">
                <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-light mb-6">Vous n&apos;avez pas encore envoyé de demandes.</p>
                <Link href="/search" className="clay-gradient text-white px-8 py-3 rounded-2xl font-bold inline-block shadow">
                  Chercher un logement
                </Link>
              </div>
            ) : (
              tenantBookings.map((booking) => {
                const status = STATUS_STYLES[booking.status];
                const img = booking.listing.images[0]?.url;
                return (
                  <div key={booking.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 flex items-center gap-5">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                      {img ? (
                        <Image src={img} alt={booking.listing.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Building className="w-8 h-8 text-gray-300" /></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link href={`/listings/${booking.listingId}`} className="font-bold text-primary hover:text-accent transition-colors truncate block">
                        {booking.listing.title}
                      </Link>
                      <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
                        <MapPin className="w-3 h-3" />
                        {booking.listing.neighborhood ? `${booking.listing.neighborhood}, ` : ""}
                        {booking.listing.city}
                      </div>
                      {booking.moveInDate && (
                        <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                          <Calendar className="w-3 h-3" />
                          Entrée : {new Date(booking.moveInDate).toLocaleDateString("fr-MA")}
                          {booking.durationMonths && ` · ${booking.durationMonths} mois`}
                        </div>
                      )}
                    </div>

                    <div className="text-right shrink-0 space-y-2">
                      <span className={`inline-block text-[11px] font-black px-3 py-1 rounded-full ${status.cls}`}>
                        {status.label}
                      </span>
                      <div className="text-xs text-gray-400">
                        {new Date(booking.updatedAt).toLocaleDateString("fr-MA")}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── HOST: manage incoming requests ── */}
        {isHost && (
          <div className="space-y-6">
            {hostBookings.length === 0 ? (
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-16 text-center">
                <Clock className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-light">Aucune demande reçue pour l&apos;instant.</p>
              </div>
            ) : (
              hostBookings.map((booking) => {
                const status = STATUS_STYLES[booking.status];
                const img = booking.listing.images[0]?.url;
                const tenant = booking.tenant;

                return (
                  <div key={booking.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-7">
                    <div className="flex items-start gap-5 mb-5">
                      {/* Listing thumb */}
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                        {img ? (
                          <Image src={img} alt={booking.listing.title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Building className="w-6 h-6 text-gray-300" /></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link href={`/listings/${booking.listingId}`} className="font-bold text-primary hover:text-accent transition-colors">
                          {booking.listing.title}
                        </Link>
                        <div className="flex items-center gap-1 text-gray-400 text-sm mt-0.5">
                          <MapPin className="w-3 h-3" /> {booking.listing.city}
                        </div>
                      </div>

                      <span className={`shrink-0 text-[11px] font-black px-3 py-1 rounded-full ${status.cls}`}>
                        {status.label}
                      </span>
                    </div>

                    {/* Tenant info */}
                    <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4 mb-5">
                      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">
                        {tenant.name?.charAt(0)?.toUpperCase() ?? "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-primary text-sm">{tenant.name}</div>
                        {tenant.university && <div className="text-xs text-gray-400">{tenant.university}</div>}
                        {tenant.applicationFile?.isComplete && (
                          <div className="flex items-center gap-1 text-green-600 text-xs font-bold mt-0.5">
                            <CheckCircle className="w-3 h-3" /> Dossier complet
                          </div>
                        )}
                      </div>
                      {booking.moveInDate && (
                        <div className="text-right text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(booking.moveInDate).toLocaleDateString("fr-MA")}
                          </div>
                          {booking.durationMonths && <div>{booking.durationMonths} mois</div>}
                        </div>
                      )}
                    </div>

                    {booking.tenantNote && (
                      <div className="bg-blue-50 rounded-2xl p-4 mb-5 text-sm text-blue-800 font-light">
                        <span className="font-bold">Message : </span>{booking.tenantNote}
                      </div>
                    )}

                    {/* Action buttons */}
                    {booking.status === "PENDING_HOST_REVIEW" && (
                      <div className="flex gap-3">
                        <form action={async () => { "use server"; await updateBookingStatus(booking.id, "ACCEPTED"); }}>
                          <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-2xl font-bold text-sm hover:bg-green-700 transition-colors shadow">
                            <CheckCircle className="w-4 h-4" /> Accepter
                          </button>
                        </form>
                        <form action={async () => { "use server"; await updateBookingStatus(booking.id, "REJECTED"); }}>
                          <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-red-100 text-red-700 rounded-2xl font-bold text-sm hover:bg-red-200 transition-colors">
                            <XCircle className="w-4 h-4" /> Refuser
                          </button>
                        </form>
                      </div>
                    )}
                    {booking.status === "INQUIRY" && (
                      <div className="flex gap-3">
                        <form action={async () => { "use server"; await updateBookingStatus(booking.id, "PENDING_HOST_REVIEW"); }}>
                          <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-2xl font-bold text-sm hover:bg-accent/90 transition-colors shadow">
                            Demander le dossier
                          </button>
                        </form>
                        <form action={async () => { "use server"; await updateBookingStatus(booking.id, "REJECTED"); }}>
                          <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-red-100 text-red-700 rounded-2xl font-bold text-sm hover:bg-red-200 transition-colors">
                            <XCircle className="w-4 h-4" /> Refuser
                          </button>
                        </form>
                      </div>
                    )}
                    {booking.status === "ACCEPTED" && (
                      <form action={async () => { "use server"; await updateBookingStatus(booking.id, "BOOKED"); }}>
                        <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow">
                          <CheckCircle className="w-4 h-4" /> Confirmer la réservation
                        </button>
                      </form>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
