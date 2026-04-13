import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  getUnverifiedListings,
  approveListing,
  rejectListing,
  getUnverifiedUsers,
  approveUserIdentity,
} from "@/lib/actions/admin";
import Image from "next/image";
import Link from "next/link";
import { Building, CheckCircle, XCircle, MapPin, User, Shield, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | StudentHome.ma" };

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const userId = (session.user as any).id as string;
  const dbUser = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });

  if (dbUser?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [listingsResult, usersResult] = await Promise.all([
    getUnverifiedListings(),
    getUnverifiedUsers(),
  ]);

  const listings = "listings" in listingsResult ? (listingsResult.listings ?? []) : [];
  const users = "users" in usersResult ? (usersResult.users ?? []) : [];

  return (
    <div className="min-h-screen bg-[#FAFBFE]">

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <h1 className="text-3xl font-black text-primary">Panneau d&apos;administration</h1>
          </div>
          <p className="text-gray-400 font-light">Vérification des annonces et des utilisateurs.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Annonces à vérifier", value: listings.length, color: "text-amber-600" },
            { label: "Utilisateurs à vérifier", value: users.length, color: "text-blue-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-6">
              <div className={`text-3xl font-black mb-1 ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Listings to verify ── */}
        <section className="mb-14">
          <h2 className="text-2xl font-black text-primary mb-6 flex items-center gap-2">
            <Building className="w-6 h-6 text-amber-500" /> Annonces en attente de vérification
          </h2>

          {listings.length === 0 ? (
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-12 text-center">
              <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
              <p className="text-gray-400 font-light">Toutes les annonces sont vérifiées.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {listings.map((listing) => {
                const img = listing.images[0]?.url;
                return (
                  <div key={listing.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 flex items-center gap-5">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                      {img ? (
                        <Image src={img} alt={listing.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link href={`/listings/${listing.id}`} target="_blank" className="font-bold text-primary hover:text-accent transition-colors truncate block">
                        {listing.title}
                      </Link>
                      <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
                        <MapPin className="w-3 h-3" /> {listing.city}
                        <span className="mx-2 text-gray-200">·</span>
                        <User className="w-3 h-3" /> {listing.host.name} ({listing.host.email})
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Publié le {new Date(listing.createdAt).toLocaleDateString("fr-MA")}
                      </div>
                    </div>

                    <div className="flex gap-3 shrink-0">
                      <form action={async () => { "use server"; await approveListing(listing.id); }}>
                        <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-2xl font-bold text-sm hover:bg-green-700 transition-colors shadow">
                          <CheckCircle className="w-4 h-4" /> Approuver
                        </button>
                      </form>
                      <form action={async () => { "use server"; await rejectListing(listing.id); }}>
                        <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-red-100 text-red-700 rounded-2xl font-bold text-sm hover:bg-red-200 transition-colors">
                          <XCircle className="w-4 h-4" /> Rejeter
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Users to verify ── */}
        <section>
          <h2 className="text-2xl font-black text-primary mb-6 flex items-center gap-2">
            <User className="w-6 h-6 text-blue-500" /> Utilisateurs en attente de vérification
          </h2>

          {users.length === 0 ? (
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-12 text-center">
              <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
              <p className="text-gray-400 font-light">Tous les utilisateurs sont vérifiés.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((u) => (
                <div key={u.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 flex items-center gap-5">
                  <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center text-white font-black text-xl shrink-0">
                    {u.name?.charAt(0)?.toUpperCase() ?? "?"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-primary">{u.name}</div>
                    <div className="text-sm text-gray-400">{u.email} · {u.role}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Inscrit le {new Date(u.createdAt).toLocaleDateString("fr-MA")}
                    </div>
                    {u.applicationFile?.cinUrl && (
                      <a href={u.applicationFile.cinUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-accent font-bold hover:underline mt-1 inline-block">
                        Voir CIN →
                      </a>
                    )}
                  </div>

                  <div className="flex gap-3 shrink-0">
                    {u.applicationFile?.isComplete && (
                      <span className="text-[11px] bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full">Dossier complet</span>
                    )}
                    <form action={async () => { "use server"; await approveUserIdentity(u.id); }}>
                      <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-colors shadow">
                        <ShieldCheck className="w-4 h-4" /> Vérifier
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
