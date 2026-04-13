"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { MOROCCO_CITIES } from "@/lib/moroccoCities";

const TYPES = [
  { value: "", label: "Tous les types" },
  { value: "ROOM", label: "Chambre" },
  { value: "STUDIO", label: "Studio" },
  { value: "APARTMENT", label: "Appartement" },
  { value: "COLIVING", label: "Coliving" },
  { value: "HOMESTAY", label: "Chez l'habitant" },
];

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showFilters, setShowFilters] = useState(false);

  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [type, setType] = useState(searchParams.get("type") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [availableFrom, setAvailableFrom] = useState(searchParams.get("availableFrom") ?? "");
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get("verifiedOnly") === "true");

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (city) params.set("city", city);
    if (type) params.set("type", type);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (availableFrom) params.set("availableFrom", availableFrom);
    if (verifiedOnly) params.set("verifiedOnly", "true");

    startTransition(() => {
      router.push(`/search?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setCity(""); setType(""); setMinPrice(""); setMaxPrice("");
    setQuery(""); setAvailableFrom(""); setVerifiedOnly(false);
    startTransition(() => router.push("/search"));
  };

  const hasFilters = city || type || minPrice || maxPrice || query || availableFrom || verifiedOnly;

  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm">
      {/* Search bar row */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            placeholder="Quartier, université, mot-clé…"
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-accent/10 outline-none text-sm font-medium transition-all"
          />
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl border text-sm font-bold transition-all ${
            showFilters
              ? "border-accent bg-accent/5 text-accent"
              : "border-gray-100 bg-gray-50 text-gray-600 hover:border-accent/30"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtres
        </button>
        <button
          onClick={applyFilters}
          disabled={isPending}
          className="clay-gradient text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow hover:shadow-lg disabled:opacity-60 transition-all"
        >
          {isPending ? "…" : "Chercher"}
        </button>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="mt-5 pt-5 border-t border-gray-50 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* City */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ville</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 text-sm font-medium outline-none"
              >
                <option value="">Toutes les villes</option>
                {MOROCCO_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 text-sm font-medium outline-none"
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Available from */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Disponible dès
              </label>
              <input
                type="date"
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 text-sm font-medium outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Min price */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Loyer min (MAD)</label>
              <input
                type="number" min={0} value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="ex : 2 000"
                className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 text-sm font-medium outline-none"
              />
            </div>

            {/* Max price */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Loyer max (MAD)</label>
              <input
                type="number" min={0} value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="ex : 8 000"
                className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 text-sm font-medium outline-none"
              />
            </div>

            {/* Verified only */}
            <div className="flex items-end pb-0.5">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => setVerifiedOnly((v) => !v)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    verifiedOnly ? "bg-accent" : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      verifiedOnly ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </div>
                <span className="text-sm font-bold text-gray-600 group-hover:text-accent transition-colors">
                  Hôtes vérifiés uniquement
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Active-filter chips */}
      {hasFilters && (
        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-400 font-medium">Filtres actifs :</span>
          {[
            query && `"${query}"`,
            city,
            type && TYPES.find((t) => t.value === type)?.label,
            minPrice && `≥ ${minPrice} MAD`,
            maxPrice && `≤ ${maxPrice} MAD`,
            availableFrom && `Dès ${new Date(availableFrom).toLocaleDateString("fr-MA")}`,
            verifiedOnly && "Hôtes vérifiés",
          ]
            .filter(Boolean)
            .map((chip) => (
              <span key={chip as string} className="bg-accent/10 text-accent text-xs font-bold px-3 py-1 rounded-full">
                {chip}
              </span>
            ))}
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors ml-1"
          >
            <X className="w-3 h-3" /> Effacer
          </button>
        </div>
      )}
    </div>
  );
}
