import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  PlusCircle, MapPin, Building2, CheckCircle, Clock,
  Search, Shield, FileText, MessageSquare, Calendar,
  LayoutDashboard, Heart, BookOpen, Settings, BadgeCheck,
} from "lucide-react";
import { getDossierCompletionPercent } from "@/lib/utils/dossier";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Tableau de bord" };

const TYPE_LABELS: Record<string, string> = {
  ROOM: "Chambre", STUDIO: "Studio", APARTMENT: "Appartement",
  COLIVING: "Coliving", HOMESTAY: "Chez l'habitant",
};

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  INQUIRY:             { label: "Demande envoyée",       cls: "bg-blue-100 text-blue-700" },
  APPLICATION_SENT:    { label: "Dossier envoyé",        cls: "bg-indigo-100 text-indigo-700" },
  PENDING_HOST_REVIEW: { label: "En attente d'examen",   cls: "bg-amber-100 text-amber-700" },
  ACCEPTED:            { label: "Accepté",               cls: "bg-accent-100 text-accent-700" },
  REJECTED:            { label: "Refusé",                cls: "bg-red-100 text-red-700" },
  BOOKED:              { label: "Réservé",               cls: "bg-brand-100 text-brand-700" },
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const user = session.user as { id: string; name?: string | null; email?: string | null };

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true, name: true, isVerified: true, university: true, applicationFile: true },
  });

  const isHost = dbUser?.role === "HOST";

  const [listings, tenantBookings, unreadMessages, visitCount] = await Promise.all([
    isHost
      ? prisma.listing.findMany({ where: { hostId: user.id }, include: { images: { take: 1 } }, orderBy: { createdAt: "desc" } })
      : Promise.resolve([]),
    !isHost
      ? prisma.bookingRequest.findMany({
          where: { tenantId: user.id },
          include: { listing: { include: { images: { take: 1 } } } },
          orderBy: { updatedAt: "desc" },
          take: 5,
        })
      : Promise.resolve([]),
    prisma.message.count({ where: { receiverId: user.id, isRead: false } }),
    isHost
      ? prisma.visitSlot.count({ where: { hostId: user.id, date: { gte: new Date() } } })
      : prisma.visitSlot.count({ where: { bookedByUserId: user.id, date: { gte: new Date() } } }),
  ]);

  const pendingBookings = isHost
    ? await prisma.bookingRequest.count({ where: { hostId: user.id, status: "PENDING_HOST_REVIEW" } })
    : 0;

  const dossierPercent = getDossierCompletionPercent(dbUser?.applicationFile ?? null);

  const today = new Date().toLocaleDateString("fr-MA", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const sidebarLinks = [
    { href: "/dashboard",              label: "Tableau de bord",    icon: LayoutDashboard },
    { href: "/dashboard/bookings",     label: "Mes candidatures",   icon: Calendar },
    { href: "/dashboard/visits",       label: "Mes visites",        icon: Clock },
    { href: "/dashboard/listings",     label: "Mes annonces",       icon: Building2 },
    { href: "/dashboard/favorites",    label: "Mes favoris",        icon: Heart },
    { href: "/dashboard/dossier",      label: "Mon dossier",        icon: FileText },
    { href: "/dashboard/messages",     label: "Messagerie",         icon: MessageSquare },
    { href: "/dashboard/settings",     label: "Paramètres",         icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">

          {/* ── Sidebar ──────────────────────────────────────────── */}
          <aside className="hidden lg:block w-60 shrink-0">
            <nav className="bg-white rounded-2xl ring-1 ring-gray-200 p-3 sticky top-24" aria-label="Navigation du tableau de bord">
              {sidebarLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors group"
                >
                  <Icon className="w-4 h-4 text-gray-400 group-hover:text-brand-600 transition-colors shrink-0" aria-hidden="true" />
                  {label}
                  {label === "Messagerie" && unreadMessages > 0 && (
                    <span className="ml-auto text-[10px] font-bold bg-brand-600 text-white w-5 h-5 rounded-full flex items-center justify-center">
                      {unreadMessages > 9 ? "9+" : unreadMessages}
                    </span>
                  )}
                  {label === "Mes candidatures" && pendingBookings > 0 && (
                    <span className="ml-auto text-[10px] font-bold bg-amber-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
                      {pendingBookings}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </aside>

          {/* ── Main ─────────────────────────────────────────────── */}
          <main className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Bonjour, {user.name?.split(" ")[0] ?? "là"} 👋
                </h1>
                <p className="text-gray-500 text-sm mt-0.5 capitalize">{today}</p>
              </div>
              {isHost && (
                <Link href="/publish"
                  className="flex items-center gap-2 px-4 py-2 brand-gradient text-white text-sm font-semibold rounded-xl hover:shadow-md transition-shadow">
                  <PlusCircle className="w-4 h-4" /> Nouvelle annonce
                </Link>
              )}
            </div>

            {/* Stats */}
            {(() => {
              const stats: { label: string; value: string | number; icon: React.ElementType }[] = isHost ? [
                { label: "Annonces publiées",    value: listings.length,                          icon: Building2 },
                { label: "Annonces actives",     value: listings.filter((l: any) => l.isActive).length, icon: CheckCircle },
                { label: "Visites planifiées",   value: visitCount,                               icon: Calendar },
                { label: "Messages non lus",     value: unreadMessages,                           icon: MessageSquare },
              ] : [
                { label: "Candidatures",         value: tenantBookings.length,                    icon: BookOpen },
                { label: "Visites planifiées",   value: visitCount,                               icon: Calendar },
                { label: "Dossier complété",     value: `${dossierPercent}%`,                     icon: FileText },
                { label: "Messages non lus",     value: unreadMessages,                           icon: MessageSquare },
              ];
              return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-white rounded-2xl ring-1 ring-gray-200 p-5">
                  <div className="w-9 h-9 bg-brand-50 rounded-lg flex items-center justify-center mb-3">
                    <Icon className="w-4 h-4 text-brand-600" aria-hidden="true" />
                  </div>
                  <div className="text-2xl font-semibold text-gray-900">{value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
              );
            })()}

            {/* ── HOST: listings table ── */}
            {isHost && (
              <div className="bg-white rounded-2xl ring-1 ring-gray-200 overflow-hidden mb-6">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900">Mes annonces</h2>
                  <Link href="/publish" className="text-xs font-medium text-brand-600 hover:underline flex items-center gap-1">
                    <PlusCircle className="w-3.5 h-3.5" /> Ajouter
                  </Link>
                </div>
                {listings.length === 0 ? (
                  <div className="text-center py-16">
                    <Building2 className="w-10 h-10 text-gray-200 mx-auto mb-3" aria-hidden="true" />
                    <p className="text-gray-500 text-sm">Aucune annonce publiée.</p>
                    <Link href="/publish" className="inline-flex mt-4 px-5 py-2 brand-gradient text-white text-sm font-semibold rounded-xl">
                      Publier une annonce
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {listings.map((l: any) => (
                      <div key={l.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                          {l.images[0] ? (
                            <Image src={l.images[0].url} alt={l.title} fill className="object-cover" sizes="56px" />
                          ) : (
                            <Building2 className="w-6 h-6 text-gray-300 m-auto" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{l.title}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                            <MapPin className="w-3 h-3" aria-hidden="true" />
                            {l.neighborhood ? `${l.neighborhood}, ` : ""}{l.city}
                            <span className="mx-1 text-gray-300">·</span>
                            {TYPE_LABELS[l.type] ?? l.type}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-semibold text-gray-900">{l.price.toLocaleString()} MAD</div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            l.isVerified ? "bg-accent-100 text-accent-700" : "bg-amber-100 text-amber-700"
                          }`}>
                            {l.isVerified ? "Vérifié" : "En attente"}
                          </span>
                        </div>
                        <Link href={`/listings/${l.id}`}
                          className="shrink-0 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                          Voir
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── STUDENT: bookings table ── */}
            {!isHost && (
              <>
                {/* Dossier progress */}
                {dossierPercent < 100 && (
                  <Link href="/dashboard/dossier"
                    className="block bg-white rounded-2xl ring-1 ring-gray-200 p-5 mb-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-brand-600" aria-hidden="true" />
                        <span className="text-sm font-semibold text-gray-900">Mon dossier de location</span>
                      </div>
                      <span className="text-xs font-medium text-gray-500">{dossierPercent}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${
                        dossierPercent >= 70 ? "bg-accent-600" : dossierPercent >= 40 ? "bg-amber-500" : "bg-brand-600"
                      }`} style={{ width: `${dossierPercent}%` }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {dossierPercent < 70
                        ? "Complétez votre dossier pour booster vos candidatures."
                        : "Dossier en bonne voie — ajoutez les derniers documents."}
                    </p>
                  </Link>
                )}

                {/* Candidatures */}
                <div className="bg-white rounded-2xl ring-1 ring-gray-200 overflow-hidden mb-6">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900">Mes dernières candidatures</h2>
                    <Link href="/dashboard/bookings" className="text-xs font-medium text-brand-600 hover:underline">
                      Tout voir →
                    </Link>
                  </div>

                  {tenantBookings.length === 0 ? (
                    <div className="text-center py-14">
                      <Search className="w-10 h-10 text-gray-200 mx-auto mb-3" aria-hidden="true" />
                      <p className="text-gray-500 text-sm mb-4">Aucune candidature pour l&apos;instant.</p>
                      <Link href="/search" className="inline-flex px-5 py-2 brand-gradient text-white text-sm font-semibold rounded-xl">
                        Chercher un logement
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                            <th className="px-6 py-3 text-left">Logement</th>
                            <th className="px-4 py-3 text-left hidden md:table-cell">Ville</th>
                            <th className="px-4 py-3 text-left hidden md:table-cell">Type</th>
                            <th className="px-4 py-3 text-left">Statut</th>
                            <th className="px-4 py-3 text-left hidden lg:table-cell">Date</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {tenantBookings.map((b: any) => {
                            const sc = STATUS_CONFIG[b.status];
                            return (
                              <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                      {b.listing.images[0] ? (
                                        <Image src={b.listing.images[0].url} alt={b.listing.title} fill className="object-cover" sizes="40px" />
                                      ) : (
                                        <Building2 className="w-4 h-4 text-gray-300 m-auto" />
                                      )}
                                    </div>
                                    <span className="font-medium text-gray-900 truncate max-w-[140px]">{b.listing.title}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-4 text-gray-600 hidden md:table-cell">{b.listing.city}</td>
                                <td className="px-4 py-4 text-gray-600 hidden md:table-cell">{TYPE_LABELS[b.listing.type]}</td>
                                <td className="px-4 py-4">
                                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${sc.cls}`}>
                                    {sc.label}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-gray-500 text-xs hidden lg:table-cell">
                                  {new Date(b.updatedAt).toLocaleDateString("fr-MA")}
                                </td>
                                <td className="px-4 py-4">
                                  <Link href={`/listings/${b.listing.id}`}
                                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                                    Voir
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { href: "/search",            label: "Chercher un logement",   icon: Search,       color: "bg-brand-50 text-brand-600" },
                    { href: "/dashboard/messages", label: "Messagerie",             icon: MessageSquare, color: "bg-gray-50 text-gray-600" },
                    { href: "/dashboard/visits",  label: "Mes visites",            icon: Calendar,     color: "bg-amber-50 text-amber-600" },
                  ].map(({ href, label, icon: Icon, color }) => (
                    <Link key={href} href={href}
                      className="bg-white rounded-xl ring-1 ring-gray-200 p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
