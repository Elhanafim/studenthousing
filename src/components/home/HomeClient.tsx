"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Search,
  MapPin,
  Building2,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Star,
  FileText,
  MessageSquare,
  UserCheck,
  Home,
  Users,
  Clock,
  BadgeCheck,
  Gift,
} from "lucide-react";
import { MOROCCO_CITIES, POPULAR_STUDENT_CITIES } from "@/lib/moroccoCities";

const TYPES = [
  { value: "",           label: "Tous les types" },
  { value: "ROOM",       label: "Chambre" },
  { value: "STUDIO",     label: "Studio" },
  { value: "APARTMENT",  label: "Appartement" },
  { value: "COLIVING",   label: "Coliving" },
  { value: "HOMESTAY",   label: "Chez l'habitant" },
];

const TYPE_LABELS: Record<string, string> = {
  ROOM: "Chambre", STUDIO: "Studio", APARTMENT: "Appartement",
  COLIVING: "Coliving", HOMESTAY: "Chez l'habitant",
};

export default function HomeClient({ listings }: { listings: any[] }) {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [query, setQuery] = useState("");

  function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (type) params.set("type", type);
    if (query) params.set("q", query);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="min-h-screen bg-surface">

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section className="relative border-b border-brand-700/20 py-32 md:py-44 overflow-hidden">
        <Image
          src="/hero.jpg"
          alt="Maroc"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs font-semibold mb-7 border border-white/25 shadow-sm">
            <Gift className="w-3.5 h-3.5 text-accent-100" />
            100% Gratuit — aucun frais, aucune commission
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.08] mb-5 drop-shadow-sm">
            Trouvez votre logement<br />
            <span className="text-accent-100 italic">étudiant au Maroc.</span>
          </h1>
          <p className="text-lg text-white/75 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Annonces vérifiées, gratuites, et pensées pour les étudiants.
            Casablanca, Rabat, Fès, Marrakech et plus encore.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl border border-white/60 shadow-2xl p-2 max-w-3xl mx-auto flex flex-col sm:flex-row gap-2"
            role="search"
            aria-label="Recherche de logement"
          >
            <div className="flex items-center gap-2 flex-1 px-3 border-b sm:border-b-0 sm:border-r border-gray-100 py-1.5">
              <MapPin className="w-4 h-4 text-brand-400 shrink-0" aria-hidden="true" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-transparent w-full text-sm text-gray-700 focus:outline-none"
                aria-label="Ville"
              >
                <option value="">Toutes les villes</option>
                {MOROCCO_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 flex-1 px-3 border-b sm:border-b-0 sm:border-r border-gray-100 py-1.5">
              <Building2 className="w-4 h-4 text-brand-400 shrink-0" aria-hidden="true" />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="bg-transparent w-full text-sm text-gray-700 focus:outline-none"
                aria-label="Type de logement"
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 flex-1 px-3 py-1.5">
              <Search className="w-4 h-4 text-brand-400 shrink-0" aria-hidden="true" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Quartier, université…"
                className="bg-transparent w-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                aria-label="Mot-clé"
              />
            </div>

            <button
              type="submit"
              className="brand-gradient text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow shrink-0"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              Rechercher
            </button>
          </form>

          {/* Trust row */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-white/70">
            {[
              { icon: ShieldCheck, label: "Annonces vérifiées" },
              { icon: Gift,        label: "100% gratuit" },
              { icon: UserCheck,   label: "Hôtes identifiés" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon className="w-4 h-4 text-accent-100" aria-hidden="true" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          DUAL ROLE VALUE PROPOSITION
      ══════════════════════════════════════════════ */}
      <section className="py-16 bg-surface">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Seeker */}
            <div className="bg-white rounded-2xl ring-1 ring-gray-200 p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-5">
                <Search className="w-6 h-6 text-brand-600" aria-hidden="true" />
              </div>
              <h2 className="font-display text-xl font-bold text-primary mb-2">Je cherche un logement</h2>
              <p className="text-muted text-sm mb-5">Étudiants à la recherche d'un appartement, studio ou colocation.</p>
              <ul className="space-y-2.5 mb-6">
                {[
                  "Annonces vérifiées par notre équipe",
                  "Dossier de location en ligne, une seule fois",
                  "Messagerie directe avec le propriétaire",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-accent-600 mt-0.5 shrink-0" aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-5 py-2.5 brand-gradient text-white text-sm font-semibold rounded-xl hover:shadow-md transition-shadow"
              >
                Rechercher un logement <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Host */}
            <div className="bg-white rounded-2xl ring-1 ring-gray-200 p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center mb-5">
                <Home className="w-6 h-6 text-accent-600" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="font-display text-xl font-bold text-primary">Je suis étudiant-hôte</h2>
                <span className="text-[10px] font-bold bg-accent-100 text-accent-700 px-2 py-0.5 rounded-full uppercase tracking-wider">Gratuit</span>
              </div>
              <p className="text-gray-600 text-sm mb-5">Sous-louer, partager, ou céder ma chambre à un autre étudiant.</p>
              <ul className="space-y-2.5 mb-6">
                {[
                  "Publication gratuite, 0% de commission",
                  "3 scénarios : colocation, sous-location, cession",
                  "Système de visite intégré avec réservation en ligne",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-accent-600 mt-0.5 shrink-0" aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                href="/publish"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-600 text-white text-sm font-semibold rounded-xl hover:bg-accent-700 transition-colors hover:shadow-md"
              >
                Publier une annonce <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURED LISTINGS
      ══════════════════════════════════════════════ */}
      {listings.length > 0 && (
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-display text-3xl font-bold text-primary mb-1">Logements récents</h2>
                <p className="text-muted text-sm">Annonces vérifiées dans les villes universitaires.</p>
              </div>
              <Link href="/search" className="text-sm font-medium text-brand-600 hover:underline flex items-center gap-1">
                Tout voir <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="group bg-white rounded-2xl ring-1 ring-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-52 overflow-hidden bg-gray-100">
                    <Image
                      src={listing.images[0]?.url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800"}
                      alt={listing.title}
                      fill
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {listing.isVerified && (
                      <span className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-accent-600 px-2 py-1 rounded-lg text-[11px] font-semibold border border-accent-100">
                        <BadgeCheck className="w-3.5 h-3.5" aria-hidden="true" /> Vérifié
                      </span>
                    )}
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-lg text-[11px] font-medium">
                      {TYPE_LABELS[listing.type] ?? listing.type}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 truncate mb-1">{listing.title}</h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                      <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">{listing.neighborhood ? `${listing.neighborhood}, ` : ""}{listing.city}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-semibold text-gray-900">{listing.price.toLocaleString()} MAD</span>
                        <span className="text-gray-500 text-xs ml-1">/mois</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                        4.8
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          POPULAR CITIES
      ══════════════════════════════════════════════ */}
      <section className="py-16 bg-surface border-t border-brand-100/40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-10">
            <h2 className="font-display text-3xl font-bold text-primary mb-1">Villes universitaires populaires</h2>
            <p className="text-muted text-sm">Des logements vérifiés dans les principaux pôles universitaires.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {POPULAR_STUDENT_CITIES.map(({ city: c, image, universities }) => (
              <Link
                key={c}
                href={`/search?city=${encodeURIComponent(c)}`}
                className="group relative rounded-2xl overflow-hidden h-44 block ring-1 ring-gray-200 hover:shadow-lg transition-shadow"
                aria-label={`Logements à ${c}`}
              >
                <Image
                  src={image}
                  alt={`Vue de ${c}, Maroc`}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold text-lg leading-tight">{c}</h3>
                  <p className="text-white/70 text-xs mt-0.5 truncate">{universities.slice(0, 2).join(", ")}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════ */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-primary mb-2">Comment ça marche ?</h2>
            <p className="text-muted text-sm">Du premier clic à l'emménagement en 4 étapes.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { step: "01", icon: Search,      title: "Cherchez",             desc: "Filtrez par ville, type et budget parmi des annonces vérifiées." },
              { step: "02", icon: FileText,     title: "Créez votre dossier",  desc: "Complétez votre dossier de location en ligne une seule fois." },
              { step: "03", icon: MessageSquare, title: "Contactez l'hôte",   desc: "Échangez directement et réservez une visite en ligne." },
              { step: "04", icon: ShieldCheck,  title: "Emménagez !",         desc: "Signez votre bail et installez-vous en toute sérénité." },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 brand-gradient rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="text-[10px] font-bold text-brand-600 uppercase tracking-widest mb-1">{step}</div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1.5">{title}</h3>
                <p className="text-gray-600 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TRUST BANNER
      ══════════════════════════════════════════════ */}
      <section className="py-16 bg-surface border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-brand-600 rounded-2xl p-10 md:p-14 text-center">
            <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="text-white w-7 h-7" aria-hidden="true" />
            </div>
            <h2 className="font-display text-2xl md:text-4xl font-bold text-white mb-3">
              Votre sécurité, notre priorité.
            </h2>
            <p className="text-blue-100 text-sm mb-8 max-w-lg mx-auto leading-relaxed">
              Hôtes vérifiés, annonces contrôlées, dossier sécurisé — nous protégeons chaque étape
              de votre recherche de logement.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {[
                { icon: UserCheck,   label: "Hôtes vérifiés" },
                { icon: ShieldCheck, label: "Annonces contrôlées" },
                { icon: Clock,       label: "Réponse sous 48h" },
                { icon: Users,       label: "Communauté étudiante" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-blue-100 text-sm">
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {label}
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/guarantees" className="px-6 py-2.5 bg-white text-brand-600 text-sm font-semibold rounded-xl hover:shadow-md transition-shadow">
                Nos garanties
              </Link>
              <Link href="/auth/signup" className="px-6 py-2.5 bg-white/10 border border-white/20 text-white text-sm font-semibold rounded-xl hover:bg-white/20 transition-colors">
                Rejoindre la plateforme
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
