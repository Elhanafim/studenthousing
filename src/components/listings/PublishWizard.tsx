"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Clock, DoorOpen, ArrowRight, ArrowLeft,
  Building2, MapPin, DollarSign, CheckCircle,
  ShieldCheck, Calendar, Home,
} from "lucide-react";
import { createListing } from "@/lib/actions/listings";
import { MOROCCO_CITIES } from "@/lib/moroccoCities";
import MediaUploadStep from "@/components/listings/MediaUploadStep";

/* ── Types ─────────────────────────────────────────────────────── */
type ListingTypeId = "COLOC" | "SUBLEASE" | "CESSION";
type HousingTypeId = "ROOM" | "STUDIO" | "APARTMENT" | "COLIVING" | "HOMESTAY";
type WizardStep = 1 | 2 | 3 | 4;

const SCENARIOS: { id: ListingTypeId; icon: React.ReactNode; title: string; subtitle: string; desc: string; badge: string }[] = [
  {
    id: "COLOC",
    icon: <Users className="w-6 h-6" />,
    title: "Je cherche un(e) colocataire",
    subtitle: "Colocation étudiante",
    badge: "Partage",
    desc: "Vous avez une grande chambre ou un appartement et souhaitez le partager avec un(e) autre étudiant(e).",
  },
  {
    id: "SUBLEASE",
    icon: <Clock className="w-6 h-6" />,
    title: "Je pars temporairement",
    subtitle: "Sous-location (court terme)",
    badge: "Temporaire",
    desc: "Stage, vacances, semestre à l'étranger — louez votre logement pour une période définie.",
  },
  {
    id: "CESSION",
    icon: <DoorOpen className="w-6 h-6" />,
    title: "Je libère ma chambre définitivement",
    subtitle: "Cession de chambre (long terme)",
    badge: "Long terme",
    desc: "Diplômé(e) ou déménagement — transmettez votre chambre à un autre étudiant.",
  },
];

const HOUSING_TYPES: { id: HousingTypeId; label: string }[] = [
  { id: "ROOM",      label: "Chambre" },
  { id: "STUDIO",    label: "Studio" },
  { id: "APARTMENT", label: "Appartement" },
  { id: "COLIVING",  label: "Coliving" },
  { id: "HOMESTAY",  label: "Chez l'habitant" },
];

const STEPS = ["Scénario", "Détails", "Médias", "Confirmation"];

/* ── Component ─────────────────────────────────────────────────── */
export default function PublishWizard() {
  const [step, setStep] = useState<WizardStep>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [listingType, setListingType] = useState<ListingTypeId | "">("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "ROOM" as HousingTypeId,
    city: "Casablanca",
    neighborhood: "",
    address: "",
    mapsLink: "",
    price: 0,
    size: 0,
    bedrooms: 1,
    bathrooms: 1,
    isFurnished: true,
    amenities: [] as string[],
    safetyFeatures: [] as string[],
    houseRules: [] as string[],
    availableFrom: "",
    availableTo: "",
    minDuration: 1,
  });
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-800 bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all placeholder-gray-400";
  const labelCls = "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5";

  const toggleItem = (cat: "amenities" | "safetyFeatures" | "houseRules", val: string) => {
    setFormData((prev) => ({
      ...prev,
      [cat]: prev[cat].includes(val) ? prev[cat].filter((i) => i !== val) : [...prev[cat], val],
    }));
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const isValidMapsLink = (url: string) =>
    url.startsWith("http") &&
    (url.includes("google.com/maps") ||
      url.includes("maps.app.goo.gl") ||
      url.includes("goo.gl/maps"));

  const handleSubmit = async () => {
    if (!listingType) return;
    if (!formData.neighborhood.trim()) {
      setError("Veuillez indiquer la localisation du logement.");
      return;
    }
    if (!formData.mapsLink.trim()) {
      setError("Veuillez fournir un lien Google Maps valide (ex: https://maps.app.goo.gl/...).");
      return;
    }
    if (!isValidMapsLink(formData.mapsLink)) {
      setError("Veuillez fournir un lien Google Maps valide (ex: https://maps.app.goo.gl/...).");
      return;
    }
    if (images.length < 2) { setError("Veuillez ajouter au moins 2 photos."); return; }
    if (videos.length < 1) { setError("Veuillez ajouter au moins 1 vidéo."); return; }

    setLoading(true);
    setError("");

    const payload = {
      ...formData,
      listingType,
      isStudentHost: true,
      images,
      videos,
      availableFrom: formData.availableFrom || undefined,
    };

    const res = await createListing(payload as any);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      setStep(4);
    }
  };

  return (
    <div className="bg-white rounded-2xl ring-1 ring-gray-200 overflow-hidden">

      {/* Progress bar */}
      <div className="border-b border-gray-100 px-8 py-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Étape {step} sur {STEPS.length}
          </span>
          <span className="text-xs font-medium text-gray-700">{STEPS[step - 1]}</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full brand-gradient rounded-full transition-all duration-500"
            style={{ width: `${(step / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-8">
        <AnimatePresence mode="wait">

          {/* ── Step 1: Scenario ── */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Quel est votre situation ?</h2>
                <p className="text-gray-600 text-sm">Choisissez le scénario qui correspond à votre cas.</p>
              </div>

              <div className="space-y-3">
                {SCENARIOS.map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => setListingType(sc.id)}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                      listingType === sc.id
                        ? "border-brand-500 bg-brand-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        listingType === sc.id ? "bg-brand-100 text-brand-600" : "bg-gray-100 text-gray-500"
                      }`}>
                        {sc.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-gray-900 text-sm">{sc.title}</span>
                          <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {sc.badge}
                          </span>
                        </div>
                        <div className="text-xs text-brand-600 font-medium mb-1">{sc.subtitle}</div>
                        <p className="text-xs text-gray-500 leading-relaxed">{sc.desc}</p>
                      </div>
                      {listingType === sc.id && (
                        <CheckCircle className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => listingType && setStep(2)}
                disabled={!listingType}
                className="w-full py-3 brand-gradient text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-md transition-shadow disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continuer <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* ── Step 2: Details ── */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 font-medium">
                <ArrowLeft className="w-4 h-4" /> Retour
              </button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Détails de votre logement</h2>
                <p className="text-gray-600 text-sm">Plus vos informations sont précises, plus vous aurez de réponses.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className={labelCls} htmlFor="title">Titre de l&apos;annonce</label>
                  <input id="title" type="text" name="title" value={formData.title} onChange={handleInput}
                    placeholder="ex : Chambre meublée proche ENCG Casablanca" className={inputCls} />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelCls} htmlFor="description">Description (min. 20 caractères)</label>
                  <textarea id="description" name="description" value={formData.description} onChange={handleInput}
                    rows={4} placeholder="Décrivez votre logement : ambiance, équipements, accès aux transports..."
                    className={`${inputCls} resize-none h-auto`} />
                </div>

                <div>
                  <label className={labelCls}>Type de logement</label>
                  <div className="flex flex-wrap gap-2">
                    {HOUSING_TYPES.map((t) => (
                      <button key={t.id} type="button"
                        onClick={() => setFormData((p) => ({ ...p, type: t.id }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          formData.type === t.id ? "border-brand-500 bg-brand-50 text-brand-600" : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelCls} htmlFor="price">Loyer mensuel (MAD)</label>
                  <input id="price" type="number" name="price" value={formData.price || ""} onChange={handleInput}
                    placeholder="4500" min={0} className={inputCls} />
                </div>

                <div>
                  <label className={labelCls} htmlFor="city">Ville</label>
                  <select id="city" name="city" value={formData.city} onChange={handleInput} className={inputCls}>
                    {MOROCCO_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelCls} htmlFor="neighborhood">
                    Quartier <span className="text-red-500">*</span>
                  </label>
                  <input id="neighborhood" type="text" name="neighborhood" value={formData.neighborhood}
                    onChange={handleInput} placeholder="ex : Maârif, Agdal" className={inputCls} required />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelCls} htmlFor="address">Adresse complète</label>
                  <input id="address" type="text" name="address" value={formData.address} onChange={handleInput}
                    placeholder="Adresse exacte (pour vérification)" className={inputCls} />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelCls} htmlFor="mapsLink">
                    <MapPin className="w-3.5 h-3.5 inline mr-1" />
                    Lien Google Maps du logement <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="mapsLink"
                    type="url"
                    name="mapsLink"
                    value={formData.mapsLink}
                    onChange={handleInput}
                    placeholder="https://maps.app.goo.gl/..."
                    className={inputCls}
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
                    Ouvrez Google Maps, cherchez votre adresse, cliquez sur &quot;Partager&quot; puis copiez le lien.
                  </p>
                </div>

                <div>
                  <label className={labelCls} htmlFor="availableFrom">
                    <Calendar className="w-3.5 h-3.5 inline mr-1" />
                    Disponible dès le
                  </label>
                  <input id="availableFrom" type="date" name="availableFrom" value={formData.availableFrom}
                    onChange={handleInput} min={new Date().toISOString().split("T")[0]} className={inputCls} />
                </div>

                {listingType === "SUBLEASE" && (
                  <div>
                    <label className={labelCls} htmlFor="availableTo">
                      <Clock className="w-3.5 h-3.5 inline mr-1" />
                      Disponible jusqu&apos;au
                    </label>
                    <input id="availableTo" type="date" name="availableTo" value={formData.availableTo}
                      onChange={handleInput} className={inputCls} />
                  </div>
                )}

                <div>
                  <label className={labelCls} htmlFor="minDuration">Durée minimale</label>
                  <select id="minDuration" name="minDuration" value={formData.minDuration} onChange={handleInput} className={inputCls}>
                    {[1, 2, 3, 4, 6, 9, 12].map((m) => (
                      <option key={m} value={m}>{m} mois</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={`${labelCls} mb-3`}>Équipements</label>
                <div className="flex flex-wrap gap-2">
                  {["Wifi", "Ascenseur", "Cuisine", "Bureau", "Climatisation", "Machine à laver", "Parking", "Gardien"].map((am) => (
                    <label key={am} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer text-xs font-medium transition-all ${
                      formData.amenities.includes(am) ? "border-brand-500 bg-brand-50 text-brand-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}>
                      <input type="checkbox" checked={formData.amenities.includes(am)}
                        onChange={() => toggleItem("amenities", am)} className="sr-only" />
                      {am}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className={`${labelCls} mb-3`}>Règlement intérieur</label>
                <div className="flex flex-wrap gap-2">
                  {["Non-fumeur", "Pas d'animaux", "Pas de fêtes", "Femmes uniquement", "Visites parents autorisées"].map((r) => (
                    <label key={r} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer text-xs font-medium transition-all ${
                      formData.houseRules.includes(r) ? "border-brand-500 bg-brand-50 text-brand-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}>
                      <input type="checkbox" checked={formData.houseRules.includes(r)}
                        onChange={() => toggleItem("houseRules", r)} className="sr-only" />
                      {r}
                    </label>
                  ))}
                </div>
              </div>

              <button onClick={() => setStep(3)}
                className="w-full py-3 brand-gradient text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-md transition-shadow">
                Continuer <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* ── Step 3: Media ── */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <button onClick={() => setStep(2)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 font-medium">
                <ArrowLeft className="w-4 h-4" /> Retour
              </button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Photos &amp; Vidéo</h2>
                <p className="text-gray-600 text-sm">
                  Minimum <strong>2 photos</strong> et <strong>1 vidéo</strong> requis pour publier.
                </p>
              </div>

              <MediaUploadStep
                images={images}
                videos={videos}
                onImagesChange={setImages}
                onVideosChange={setVideos}
              />

              {error && (
                <p className="text-sm text-danger bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
              )}

              <button
                onClick={() => {
                  if (images.length < 2) { setError("Veuillez ajouter au moins 2 photos et 1 vidéo pour publier."); return; }
                  if (videos.length < 1) { setError("Veuillez ajouter au moins 2 photos et 1 vidéo pour publier."); return; }
                  setError(""); setStep(4);
                }}
                className="w-full py-3 brand-gradient text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-md transition-shadow"
              >
                Continuer <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* ── Step 4: Review & Publish / Success ── */}
          {step === 4 && !success && (
            <motion.div key="s4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <button onClick={() => setStep(3)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 font-medium">
                <ArrowLeft className="w-4 h-4" /> Retour
              </button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Vérification &amp; Publication</h2>
                <p className="text-gray-600 text-sm">Relisez les informations avant de publier.</p>
              </div>

              <div className="bg-surface rounded-xl p-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Scénario</span>
                  <span className="font-medium text-gray-900">
                    {SCENARIOS.find((s) => s.id === listingType)?.subtitle}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Titre</span>
                  <span className="font-medium text-gray-900 text-right max-w-[60%] truncate">{formData.title || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ville / Quartier</span>
                  <span className="font-medium text-gray-900">{formData.city}{formData.neighborhood ? `, ${formData.neighborhood}` : ""}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Lien Maps</span>
                  <span className="font-medium text-gray-900 text-right max-w-[60%] truncate text-xs">{formData.mapsLink || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Loyer</span>
                  <span className="font-medium text-gray-900">{formData.price.toLocaleString()} MAD/mois</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Médias</span>
                  <span className="font-medium text-gray-900">{images.length} photo(s) · {videos.length} vidéo(s)</span>
                </div>
              </div>

              <div className="bg-accent-50 border border-accent-100 rounded-xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-accent-600 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">
                  Publication <strong>100% gratuite</strong>. Notre équipe vérifiera votre annonce
                  sous 24h. Aucun frais, aucune commission.
                </p>
              </div>

              {error && (
                <p className="text-sm text-danger bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 bg-accent-600 hover:bg-accent-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? "Publication en cours…" : "Publier mon annonce"}
              </button>
            </motion.div>
          )}

          {/* ── Success ── */}
          {success && (
            <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
              <div className="w-20 h-20 brand-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Annonce publiée !</h2>
              <p className="text-gray-600 text-sm mb-8 max-w-sm mx-auto">
                Votre annonce est en cours de vérification. Elle sera visible par les étudiants
                sous 24h. Vous serez notifié par email.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="/dashboard" className="px-6 py-2.5 brand-gradient text-white text-sm font-semibold rounded-xl hover:shadow-md transition-shadow">
                  Tableau de bord
                </a>
                <a href="/search" className="px-6 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
                  Voir les annonces
                </a>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
