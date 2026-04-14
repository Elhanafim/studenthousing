import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  getAdminStats,
  getAllListings,
  getAllUsers,
  approveListing,
  rejectListing,
  deleteListing,
  approveUserIdentity,
  deleteUser,
} from "@/lib/actions/admin";
import Image from "next/image";
import Link from "next/link";
import {
  Building, CheckCircle, XCircle, MapPin, User, Shield,
  ShieldCheck, Users, MessageSquare, LayoutDashboard, Trash2,
  AlertCircle, Clock,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Administration | Bayt-Talib" };

type StatusFilter = "all" | "pending" | "active" | "rejected";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; status?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const userId = (session.user as any).id as string;
  const dbUser = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });

  if (dbUser?.role !== "ADMIN") {
    redirect("/?error=403");
  }

  const params = await searchParams;
  const activeTab = params.tab ?? "overview";
  const statusFilter = (params.status ?? "all") as StatusFilter;

  const [statsResult, listingsResult, usersResult] = await Promise.all([
    getAdminStats(),
    getAllListings(statusFilter === "all" ? undefined : statusFilter),
    getAllUsers(),
  ]);

  const stats = "totalUsers" in statsResult ? statsResult : null;
  const listings = "listings" in listingsResult ? (listingsResult.listings ?? []) : [];
  const users = "users" in usersResult ? (usersResult.users ?? []) : [];

  const statusLabel: Record<string, { label: string; cls: string }> = {
    active:   { label: "Actif",     cls: "bg-green-100 text-green-700" },
    pending:  { label: "En attente", cls: "bg-amber-100 text-amber-700" },
    rejected: { label: "Rejeté",   cls: "bg-red-100 text-red-700" },
  };

  function getListingStatus(l: any) {
    if (!l.isActive) return "rejected";
    if (!l.isVerified) return "pending";
    return "active";
  }

  const TABS = [
    { id: "overview",  label: "Vue d'ensemble",    icon: LayoutDashboard },
    { id: "listings",  label: "Annonces",           icon: Building },
    { id: "users",     label: "Utilisateurs",       icon: Users },
  ];

  const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
    { value: "all",      label: "Toutes" },
    { value: "pending",  label: "En attente" },
    { value: "active",   label: "Actives" },
    { value: "rejected", label: "Rejetées" },
  ];

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-100 p-4 sticky top-0 h-screen">
        <div className="mb-8 px-2">
          <span className="font-display text-lg font-bold text-gray-900">Bayt-Talib</span>
          <p className="text-xs text-red-600 font-semibold mt-0.5">Administration</p>
        </div>
        <nav className="space-y-1 flex-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <Link
              key={id}
              href={`/admin?tab=${id}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === id
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-gray-600 mt-4">
          ← Retour au site
        </Link>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Mobile tabs */}
        <div className="lg:hidden flex gap-1 border-b border-gray-100 bg-white px-4 py-2 overflow-x-auto">
          {TABS.map(({ id, label }) => (
            <Link
              key={id}
              href={`/admin?tab=${id}`}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === id ? "bg-brand-600 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">

          {/* ── OVERVIEW ── */}
          {activeTab === "overview" && stats && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Vue d'ensemble</h1>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Utilisateurs totaux",      value: stats.totalUsers,    icon: Users,         color: "text-blue-600",  bg: "bg-blue-50" },
                  { label: "Annonces actives",          value: stats.totalListings, icon: Building,      color: "text-green-600", bg: "bg-green-50" },
                  { label: "Annonces en attente",       value: stats.pendingListings, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
                  { label: "Messages envoyés",          value: stats.totalMessages, icon: MessageSquare, color: "text-purple-600",bg: "bg-purple-50" },
                  { label: "Nouveaux utilisateurs (7j)", value: stats.newUsers,     icon: User,          color: "text-pink-600",  bg: "bg-pink-50" },
                  { label: "Nouvelles annonces (7j)",   value: stats.newListings,   icon: Clock,         color: "text-orange-600",bg: "bg-orange-50" },
                ].map(({ label, value, icon: Icon, color, bg }) => (
                  <div key={label} className="bg-white rounded-2xl ring-1 ring-gray-200 p-5">
                    <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div className={`text-3xl font-bold ${color} mb-1`}>{value}</div>
                    <div className="text-xs text-gray-500">{label}</div>
                  </div>
                ))}
              </div>

              {(stats.pendingListings ?? 0) > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-4">
                  <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-amber-800">
                      {stats.pendingListings ?? 0} annonce{(stats.pendingListings ?? 0) > 1 ? "s" : ""} en attente de vérification
                    </p>
                  </div>
                  <Link href="/admin?tab=listings&status=pending" className="shrink-0 px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded-xl hover:bg-amber-700 transition-colors">
                    Vérifier
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ── LISTINGS ── */}
          {activeTab === "listings" && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Gestion des annonces</h1>

              {/* Filters */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {STATUS_FILTERS.map(({ value, label }) => (
                  <Link
                    key={value}
                    href={`/admin?tab=listings&status=${value}`}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      statusFilter === value
                        ? "bg-brand-600 text-white"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>

              {listings.length === 0 ? (
                <div className="bg-white rounded-2xl ring-1 ring-gray-200 p-12 text-center">
                  <CheckCircle className="w-10 h-10 text-green-300 mx-auto mb-3" />
                  <p className="text-gray-500">Aucune annonce dans cette catégorie.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl ring-1 ring-gray-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Annonce</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Ville</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Propriétaire</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {listings.map((listing: any) => {
                        const st = getListingStatus(listing);
                        const sc = statusLabel[st];
                        const img = listing.images[0]?.url;
                        return (
                          <tr key={listing.id} className={`hover:bg-gray-50 transition-colors ${st === "pending" ? "bg-amber-50/30" : ""}`}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                  {img ? <Image src={img} alt={listing.title} fill className="object-cover" sizes="40px" /> : <Building className="w-4 h-4 text-gray-300 m-auto" />}
                                </div>
                                <Link href={`/listings/${listing.id}`} target="_blank" className="font-medium text-gray-900 hover:text-brand-600 truncate max-w-[140px] block">
                                  {listing.title}
                                </Link>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-gray-600 hidden md:table-cell">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {listing.city}
                              </div>
                            </td>
                            <td className="px-4 py-4 hidden lg:table-cell">
                              <div className="text-xs">
                                <p className="font-medium text-gray-700">{listing.host.name}</p>
                                <p className="text-gray-400">{listing.host.email}</p>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-gray-500 text-xs hidden lg:table-cell">
                              {new Date(listing.createdAt).toLocaleDateString("fr-MA")}
                            </td>
                            <td className="px-4 py-4">
                              <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${sc.cls}`}>{sc.label}</span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex gap-1.5 flex-wrap">
                                {st !== "active" && (
                                  <form action={async () => { "use server"; await approveListing(listing.id); }}>
                                    <button type="submit" className="flex items-center gap-1 px-2.5 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200 transition-colors">
                                      <CheckCircle className="w-3 h-3" /> Approuver
                                    </button>
                                  </form>
                                )}
                                {st !== "rejected" && (
                                  <form action={async () => { "use server"; await rejectListing(listing.id); }}>
                                    <button type="submit" className="flex items-center gap-1 px-2.5 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200 transition-colors">
                                      <XCircle className="w-3 h-3" /> Rejeter
                                    </button>
                                  </form>
                                )}
                                <form action={async () => { "use server"; await deleteListing(listing.id); }}>
                                  <button type="submit" className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors">
                                    <Trash2 className="w-3 h-3" /> Supprimer
                                  </button>
                                </form>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── USERS ── */}
          {activeTab === "users" && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Gestion des utilisateurs</h1>

              {users.length === 0 ? (
                <div className="bg-white rounded-2xl ring-1 ring-gray-200 p-12 text-center">
                  <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500">Aucun utilisateur trouvé.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl ring-1 ring-gray-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Utilisateur</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Rôle</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Inscription</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map((u: any) => (
                        <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold text-sm shrink-0">
                                {u.name?.charAt(0)?.toUpperCase() ?? "?"}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{u.name}</p>
                                <p className="text-xs text-gray-400">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 hidden md:table-cell">
                            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                              {u.role === "HOST" ? "Hôte" : "Étudiant"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-gray-500 text-xs hidden lg:table-cell">
                            {new Date(u.createdAt).toLocaleDateString("fr-MA")}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-1">
                              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full w-fit ${
                                u.emailVerified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                              }`}>
                                {u.emailVerified ? "Email vérifié" : "Email non vérifié"}
                              </span>
                              {u.isVerified && (
                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full w-fit bg-blue-100 text-blue-700">
                                  Profil vérifié
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-1.5 flex-wrap">
                              {!u.isVerified && (
                                <form action={async () => { "use server"; await approveUserIdentity(u.id); }}>
                                  <button type="submit" className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-200 transition-colors">
                                    <ShieldCheck className="w-3 h-3" /> Vérifier
                                  </button>
                                </form>
                              )}
                              <form action={async () => { "use server"; await deleteUser(u.id); }}>
                                <button type="submit" className="flex items-center gap-1 px-2.5 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200 transition-colors">
                                  <Trash2 className="w-3 h-3" /> Supprimer
                                </button>
                              </form>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
