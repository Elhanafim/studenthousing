"use client";

import Image from "next/image";
import { useState } from "react";
import { Search, MapPin, Building, Shield, Star, ArrowRight, UserCheck, Heart, MessageSquare, Users, ShieldCheck, Clock, FileCheck } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MOROCCO_CITIES, POPULAR_STUDENT_CITIES } from "@/lib/moroccoCities";

const TYPES = [
  { value: "", label: "Tous" },
  { value: "ROOM", label: "Chambre" },
  { value: "STUDIO", label: "Studio" },
  { value: "APARTMENT", label: "Appartement" },
  { value: "COLIVING", label: "Coliving" },
  { value: "HOMESTAY", label: "Chez l'habitant" },
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

  function handleSearch() {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (type) params.set("type", type);
    if (query) params.set("q", query);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <main className="min-h-screen">
      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070"
            alt="Rabat, Maroc"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-primary/65" />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold mb-8 border border-white/20"
          >
            <UserCheck className="w-4 h-4 text-accent" />
            LA PLATEFORME DE LOGEMENT ÉTUDIANT AU MAROC
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]"
          >
            Trouvez votre logement
            <span className="block text-accent">étudiant idéal.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Annonces vérifiées, hôtes de confiance, dossier en ligne — tout ce qu'il vous faut pour louer sereinement dans les grandes villes universitaires marocaines.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl md:rounded-full p-2 max-w-4xl mx-auto shadow-2xl flex flex-col md:flex-row gap-2"
          >
            <div className="flex-1 flex items-center px-5 gap-3 border-b md:border-b-0 md:border-r border-gray-100 py-2">
              <MapPin className="text-accent w-5 h-5 shrink-0" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-transparent border-none focus:outline-none w-full text-sm font-medium text-gray-700"
              >
                <option value="">Toutes les villes</option>
                {MOROCCO_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 flex items-center px-5 gap-3 border-b md:border-b-0 md:border-r border-gray-100 py-2">
              <Building className="text-accent w-5 h-5 shrink-0" />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="bg-transparent border-none focus:outline-none w-full text-sm font-medium text-gray-700"
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 flex items-center px-5 gap-3 py-2">
              <Search className="text-gray-400 w-5 h-5 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Université, quartier, mot-clé…"
                className="bg-transparent border-none focus:outline-none w-full text-sm font-medium placeholder-gray-400"
              />
            </div>

            <button
              onClick={handleSearch}
              className="clay-gradient text-white px-10 py-4 rounded-xl md:rounded-full font-black flex items-center justify-center gap-2 hover:shadow-xl transition-all whitespace-nowrap"
            >
              <Search className="w-4 h-4" /> Rechercher
            </button>
          </motion.div>

          {/* Quick type chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex flex-wrap justify-center gap-2 mt-6"
          >
            {TYPES.slice(1).map((t) => (
              <button
                key={t.value}
                onClick={() => { setType(t.value); router.push(`/search?type=${t.value}`); }}
                className="bg-white/10 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-white/20 transition-all backdrop-blur-sm"
              >
                {t.label}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Trust strip ─────────────────────────── */}
      <section className="bg-white border-b border-gray-100 py-5">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-8">
          {[
            { icon: <ShieldCheck className="w-4 h-4 text-green-500" />, label: "Annonces vérifiées manuellement" },
            { icon: <FileCheck className="w-4 h-4 text-blue-500" />, label: "Dossier en ligne sécurisé" },
            { icon: <Clock className="w-4 h-4 text-amber-500" />, label: "Réponse sous 48h garantie" },
            { icon: <UserCheck className="w-4 h-4 text-accent" />, label: "Hôtes identifiés et vérifiés" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-sm font-medium text-gray-600">
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured listings ────────────────────── */}
      <section className="py-24 bg-[#FAFBFE]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black mb-2 tracking-tight">Logements sélectionnés</h2>
              <p className="text-gray-500 font-light">Qualité et sécurité vérifiées dans les quartiers étudiants.</p>
            </div>
            <Link href="/search" className="text-accent font-bold flex items-center gap-2 group transition-all whitespace-nowrap">
              Tout explorer <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {listings.map((res) => (
              <Link
                key={res.id}
                href={`/listings/${res.id}`}
                className="bg-white rounded-[2.5rem] overflow-hidden group shadow-sm hover:shadow-2xl transition-all border border-gray-100"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={res.images[0]?.url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070"}
                    alt={res.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-5 left-5 glass px-3 py-1.5 rounded-full text-[10px] font-black flex items-center gap-1.5 text-primary border border-white/40">
                    <Star className="w-3 h-3 text-accent fill-accent" /> 4.8
                  </div>
                  {res.isVerified && (
                    <div className="absolute top-5 right-5 bg-green-500 text-white px-2.5 py-1 rounded-full flex items-center gap-1 text-[10px] font-black">
                      <ShieldCheck className="w-3 h-3" /> Vérifié
                    </div>
                  )}
                </div>
                <div className="p-7">
                  <div className="flex justify-between items-start mb-4">
                    <div className="min-w-0">
                      <h3 className="text-xl font-black mb-1 truncate">{res.title}</h3>
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <MapPin className="w-3 h-3" />
                        {res.neighborhood || ""}{res.neighborhood ? ", " : ""}{res.city}
                      </div>
                    </div>
                    <div className="text-right ml-4 shrink-0">
                      <div className="text-accent font-black text-xl">{res.price.toLocaleString()} MAD</div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">/ mois</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    <span className="text-[10px] bg-accent/10 text-accent px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                      {TYPE_LABELS[res.type] ?? res.type}
                    </span>
                    {(res.amenities as string[] | null)?.slice(0, 2).map((f: string) => (
                      <span key={f} className="text-[10px] bg-gray-50 text-gray-400 px-3 py-1 rounded-full uppercase tracking-wider font-bold">{f}</span>
                    ))}
                  </div>
                  <div className="w-full py-4 rounded-2xl border-2 border-primary text-primary font-black group-hover:bg-primary group-hover:text-white transition-all text-center text-sm uppercase tracking-wider">
                    Voir le logement
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular cities ───────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-4xl font-black mb-2 tracking-tight">Villes étudiantes populaires</h2>
            <p className="text-gray-500 font-light">Des logements vérifiés dans les principaux pôles universitaires du Maroc.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {POPULAR_STUDENT_CITIES.map(({ city, image, universities }) => (
              <Link
                key={city}
                href={`/search?city=${encodeURIComponent(city)}`}
                className="group relative rounded-[2rem] overflow-hidden h-48 block"
              >
                <Image src={image} alt={city} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <h3 className="text-white font-black text-xl">{city}</h3>
                  <p className="text-white/70 text-xs font-medium mt-1 truncate">
                    {universities.slice(0, 2).join(", ")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────── */}
      <section className="py-24 bg-[#FAFBFE]">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black mb-4 tracking-tight">Comment ça marche ?</h2>
          <p className="text-gray-500 font-light mb-16 max-w-xl mx-auto">Du premier clic à l'emménagement, nous vous accompagnons à chaque étape.</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", icon: <Search className="w-6 h-6" />, title: "Cherchez", desc: "Filtrez par ville, type et budget parmi des annonces vérifiées." },
              { step: "02", icon: <FileCheck className="w-6 h-6" />, title: "Créez votre dossier", desc: "Remplissez votre dossier de location en ligne une seule fois." },
              { step: "03", icon: <MessageSquare className="w-6 h-6" />, title: "Contactez l'hôte", desc: "Envoyez une demande et échangez directement avec le propriétaire." },
              { step: "04", icon: <ShieldCheck className="w-6 h-6" />, title: "Emménagez !", desc: "Signez votre bail et emménagez en toute sérénité." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 clay-gradient rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                  {item.icon}
                </div>
                <div className="text-[10px] font-black text-accent uppercase tracking-widest mb-1">{item.step}</div>
                <h3 className="font-black text-primary text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 font-light text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust & Safety banner ────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto clay-gradient rounded-[3rem] p-10 md:p-20 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 text-center md:text-left flex-1">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-6">
              <Shield className="text-white w-8 h-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Votre sécurité,<br />notre priorité.
            </h2>
            <p className="text-white/70 text-base font-light max-w-sm mb-8 leading-relaxed">
              Hôtes vérifiés, annonces contrôlées, dossier sécurisé — nous protégeons chaque étape de votre recherche de logement.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/guarantees" className="px-8 py-4 bg-white text-accent font-bold rounded-2xl hover:scale-105 transition-all inline-block shadow-xl text-sm">
                Nos garanties
              </Link>
              <Link href="/auth/signup" className="px-8 py-4 bg-white/10 border border-white/30 text-white font-bold rounded-2xl hover:bg-white/20 transition-all inline-block text-sm">
                Rejoindre la plateforme
              </Link>
            </div>
          </div>
          <div className="relative z-10 grid grid-cols-2 gap-4 shrink-0">
            {[
              { title: "Hôtes vérifiés", icon: <UserCheck className="w-6 h-6" />, desc: "Identité contrôlée" },
              { title: "Chat sécurisé", icon: <MessageSquare className="w-6 h-6" />, desc: "Messagerie intégrée" },
              { title: "Portail parents", icon: <Users className="w-6 h-6" />, desc: "Transparence totale" },
              { title: "Réservation simple", icon: <Star className="w-6 h-6" />, desc: "En quelques clics" },
            ].map((item) => (
              <div key={item.title} className="bg-white/10 backdrop-blur-md p-6 rounded-[1.5rem] border border-white/20 text-white text-center">
                <div className="mb-3 flex justify-center">{item.icon}</div>
                <div className="text-xs font-black tracking-wider mb-1">{item.title}</div>
                <div className="text-[10px] text-white/60">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────── */}
      <footer className="bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-xl">
                <Building className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter">StudentHome.ma</span>
            </div>
            <p className="text-gray-400 max-w-md mb-8 font-light leading-relaxed">
              La première plateforme dédiée au logement étudiant au Maroc. Des annonces vérifiées, des hôtes de confiance, et un parcours simplifié de la recherche à l'emménagement.
            </p>
            <p className="text-gray-500 text-xs">© 2026 StudentHome.ma — Tous droits réservés</p>
          </div>
          <div>
            <h4 className="font-black mb-6 text-sm tracking-widest uppercase text-accent">Plateforme</h4>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              <li><Link href="/search" className="hover:text-accent transition-colors">Chercher un logement</Link></li>
              <li><Link href="/hosts" className="hover:text-accent transition-colors">Espace propriétaires</Link></li>
              <li><Link href="/guarantees" className="hover:text-accent transition-colors">Nos garanties</Link></li>
              <li><Link href="/help" className="hover:text-accent transition-colors">Centre d'aide</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-6 text-sm tracking-widest uppercase text-accent">Contact</h4>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              <li>Casablanca, Maroc</li>
              <li>support@studenthome.ma</li>
              <li>+212 522 00 00 00</li>
              <li className="text-xs text-gray-500 pt-2">Lun–Sam, 9h–19h</li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  );
}
