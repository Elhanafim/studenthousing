"use client";

import Image from "next/image";
import { MapPin, Star, Shield, Building, Check, Users, Wifi, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import BookingPanel from "@/components/bookings/BookingPanel";
import VerificationBadge from "@/components/shared/VerificationBadge";
import { BookingStatus } from "@prisma/client";

const TYPE_LABELS: Record<string, string> = {
  ROOM: "Chambre",
  STUDIO: "Studio",
  APARTMENT: "Appartement",
  COLIVING: "Coliving",
  HOMESTAY: "Chez l'habitant",
};

interface ListingDetailClientProps {
  listing: any;
  currentUser: { id: string; role: string } | null;
  existingBooking: { id: string; status: BookingStatus } | null;
  hasDossier: boolean;
}

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800",
];

export default function ListingDetailClient({ listing, currentUser, existingBooking, hasDossier }: ListingDetailClientProps) {
  const images = listing.images as { url: string }[];

  return (
    <div className="min-h-screen bg-white">
      {/* Photo gallery */}
      <div className="h-[60vh] relative grid grid-cols-4 gap-2 px-4 py-6 max-w-7xl mx-auto">
        <div className="col-span-2 row-span-2 relative rounded-[2rem] overflow-hidden group">
          <Image
            src={images[0]?.url || FALLBACK_IMAGES[0]}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            priority
          />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="relative rounded-[2rem] overflow-hidden group">
            <Image
              src={images[i]?.url || FALLBACK_IMAGES[i]}
              alt={`Photo ${i + 1}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-16">
        {/* ── Main content ─────────────────────────────── */}
        <div className="md:col-span-2 space-y-12">
          <div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="bg-accent/10 text-accent px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                {TYPE_LABELS[listing.type] ?? listing.type}
              </span>
              {listing.isVerified && (
                <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                  <Shield className="w-3 h-3" /> Annonce vérifiée
                </span>
              )}
              <div className="flex items-center gap-1 text-sm font-bold ml-auto">
                <Star className="w-4 h-4 fill-accent text-accent" />
                4.8 ({listing.reviews?.length ?? 0} avis)
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-primary mb-4 leading-tight">{listing.title}</h1>
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="w-5 h-5" />
              <p className="font-light text-lg">
                {listing.neighborhood ? `${listing.neighborhood}, ` : ""}{listing.city}
              </p>
            </div>
          </div>

          {/* Quick specs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-gray-100">
            {[
              { icon: <Users className="w-5 h-5 text-gray-400" />, label: listing.isFurnished ? "Meublé" : "Non meublé" },
              { icon: <Wifi className="w-5 h-5 text-gray-400" />, label: (listing.amenities as string[])?.includes("Wifi") ? "Wifi inclus" : "Wifi non inclus" },
              { icon: <Building className="w-5 h-5 text-gray-400" />, label: listing.size ? `${listing.size} m²` : "Surface n/a" },
              { icon: <Shield className="w-5 h-5 text-gray-400" />, label: listing.isVerified ? "Vérifié" : "Non vérifié" },
            ].map((spec, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">{spec.icon}</div>
                <div className="text-sm font-bold text-gray-600">{spec.label}</div>
              </div>
            ))}
          </div>

          {/* Availability */}
          {(listing.availableFrom || listing.minDuration > 1) && (
            <div className="flex gap-6 flex-wrap">
              {listing.availableFrom && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span className="font-medium">Disponible dès le {new Date(listing.availableFrom).toLocaleDateString("fr-MA", { day: "numeric", month: "long", year: "numeric" })}</span>
                </div>
              )}
              {listing.minDuration > 1 && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-accent" />
                  <span className="font-medium">Durée minimale : {listing.minDuration} mois</span>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-2xl font-black text-primary mb-5">Description</h3>
            <p className="text-gray-500 font-light leading-relaxed text-lg whitespace-pre-line">
              {listing.description || "Aucune description fournie."}
            </p>
          </div>

          {/* Amenities */}
          {Array.isArray(listing.amenities) && (listing.amenities as string[]).length > 0 && (
            <div>
              <h3 className="text-2xl font-black text-primary mb-5">Équipements</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(listing.amenities as string[]).map((am) => (
                  <div key={am} className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50">
                    <Check className="w-4 h-4 text-accent shrink-0" />
                    <span className="text-sm font-medium text-gray-600">{am}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety — "Pourquoi ce logement est sûr" */}
          <div className="bg-green-50 border border-green-100 rounded-[2rem] p-8">
            <h3 className="text-xl font-black text-primary mb-5 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" /> Pourquoi ce logement est sûr
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { ok: listing.isVerified, label: "Annonce vérifiée par notre équipe" },
                { ok: listing.host?.isVerified, label: "Propriétaire vérifié" },
                { ok: Array.isArray(listing.safetyFeatures) && (listing.safetyFeatures as string[]).length > 0, label: "Équipements de sécurité renseignés" },
                { ok: true, label: "Paiement sécurisé via la plateforme" },
              ].map(({ ok, label }) => (
                <div key={label} className={`flex items-center gap-3 p-3 rounded-xl ${ok ? "bg-white" : "bg-white/50 opacity-60"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${ok ? "bg-green-500" : "bg-gray-300"}`}>
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className={`text-sm font-medium ${ok ? "text-gray-700" : "text-gray-400"}`}>{label}</span>
                </div>
              ))}
            </div>
            {Array.isArray(listing.safetyFeatures) && (listing.safetyFeatures as string[]).length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {(listing.safetyFeatures as string[]).map((sf) => (
                  <span key={sf} className="flex items-center gap-1.5 text-xs bg-white border border-green-200 text-green-700 px-3 py-1.5 rounded-full font-bold">
                    <Shield className="w-3 h-3" /> {sf}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* House rules */}
          {Array.isArray(listing.houseRules) && (listing.houseRules as string[]).length > 0 && (
            <div>
              <h3 className="text-2xl font-black text-primary mb-5">Règlement intérieur</h3>
              <div className="flex flex-wrap gap-3">
                {(listing.houseRules as string[]).map((rule) => (
                  <span key={rule} className="px-5 py-2 bg-primary/5 rounded-full text-sm font-bold text-primary">{rule}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Sidebar ─────────────────────────────────── */}
        <div className="relative">
          <div className="sticky top-28 space-y-6">
            {/* Price + booking card */}
            <div className="glass p-8 rounded-[2.5rem] shadow-2xl border border-white/40">
              <div className="mb-6">
                <div className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">Loyer mensuel</div>
                <div className="text-4xl font-black text-primary">{listing.price.toLocaleString()} MAD</div>
                <div className="text-xs text-gray-400 mt-1">/mois · charges comprises</div>
              </div>

              <BookingPanel
                listingId={listing.id}
                hostId={listing.hostId}
                price={listing.price}
                currentUser={currentUser}
                existingBooking={existingBooking}
                hasDossier={hasDossier}
              />
            </div>

            {/* Host card */}
            {listing.host && (
              <div className="p-7 rounded-[2.5rem] bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center text-white font-black text-xl shrink-0">
                    {listing.host.name?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-lg text-primary flex items-center gap-2 flex-wrap">
                      {listing.host.name}
                      <VerificationBadge
                        identityVerified={listing.host.identityVerified ?? false}
                        phoneVerified={listing.host.phoneVerified ?? false}
                        emailVerified={!!listing.host.email}
                      />
                    </div>
                    <div className="text-sm text-gray-400">Propriétaire</div>
                  </div>
                </div>
                <Link
                  href={`/dashboard/messages?newTo=${listing.host.id}`}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-primary text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all"
                >
                  Contacter l&apos;hôte
                </Link>
              </div>
            )}

            {/* Safety guarantee strip */}
            <div className="text-center text-xs text-gray-400 font-light px-2">
              <Shield className="w-4 h-4 inline mr-1 text-green-500" />
              Aucun paiement requis avant la signature du contrat.{" "}
              <Link href="/guarantees" className="text-accent font-bold hover:underline">
                Nos garanties →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
