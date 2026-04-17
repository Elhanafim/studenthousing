"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building,
  MapPin,
  DollarSign,
  Camera,
  Shield,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Home,
  Users,
  Calendar,
  Clock,
} from "lucide-react";
import { createListing } from "@/lib/actions/listings";
import { MOROCCO_CITIES } from "@/lib/moroccoCities";
import MediaUploadStep from "@/components/listings/MediaUploadStep";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

const HOUSING_TYPES = [
  { id: "ROOM", label: "Chambre" },
  { id: "STUDIO", label: "Studio" },
  { id: "APARTMENT", label: "Appartement" },
  { id: "COLIVING", label: "Coliving" },
  { id: "HOMESTAY", label: "Chez l'habitant" },
] as const;

type HousingTypeId = (typeof HOUSING_TYPES)[number]["id"];

export default function CreateListingWizard() {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mapsLink: "",
    type: "ROOM" as HousingTypeId,
    city: "Casablanca",
    neighborhood: "",
    address: "",
    price: 0,
    size: 0,
    bedrooms: 0,
    bathrooms: 1,
    isFurnished: true,
    amenities: [] as string[],
    safetyFeatures: [] as string[],
    houseRules: [] as string[],
    images: [] as string[],
    videos: [] as string[],
    availableFrom: "",
    minDuration: 1,
  });

  const nextStep = () => setStep((s) => (s + 1) as Step);
  const prevStep = () => setStep((s) => (s - 1) as Step);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const toggleItem = (category: "amenities" | "safetyFeatures" | "houseRules", value: string) => {
    setFormData((prev) => {
      const current = prev[category];
      return {
        ...prev,
        [category]: current.includes(value)
          ? current.filter((i) => i !== value)
          : [...current, value],
      };
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    if (!formData.mapsLink.trim()) {
      setError("Le lien Google Maps de votre logement est obligatoire.");
      setLoading(false);
      return;
    }
    if (formData.description.trim().length < 50) {
      setError("La description doit comporter au moins 50 caractères.");
      setLoading(false);
      return;
    }

    const payload = {
      ...formData,
      listingType: "STANDARD" as const,
      isStudentHost: false,
      images: formData.images,
      availableFrom: formData.availableFrom || undefined,
    };
    const res = await createListing(payload);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      setStep(6);
    }
  };

  const inputCls =
    "w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-accent/10 outline-none transition-all";
  const labelCls = "text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block";

  return (
    <div className="max-w-4xl mx-auto p-1 bg-white md:p-8 md:bg-transparent">
      <div className="md:glass rounded-[3rem] p-8 md:p-12 shadow-2xl">
        {/* Stepper */}
        <div className="hidden md:flex justify-between mb-16 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0" />
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div
              key={s}
              className={`w-12 h-12 rounded-full flex items-center justify-center relative z-10 transition-all duration-500 ${
                step >= s ? "clay-gradient text-white" : "bg-white text-gray-400 border border-gray-100"
              }`}
            >
              {step > s || success ? <CheckCircle className="w-6 h-6" /> : <span className="text-sm font-bold">{s}</span>}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── Step 1 : Basic Info ── */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent"><Building /></div>
                <div>
                  <h2 className="text-3xl font-bold text-primary">Informations de base</h2>
                  <p className="text-gray-400 font-light">Où se situe votre propriété ?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className={labelCls}>Titre de l&apos;annonce</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="ex : Studio moderne proche de l'UM6P Rabat" className={inputCls} />
                </div>

                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className={labelCls}>
                    Description <span className="text-red-500">*</span>{" "}
                    <span className="text-gray-400 normal-case font-normal">(50 caractères minimum)</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                    minLength={50}
                    placeholder="Décrivez votre logement : ambiance, atouts, proximité des universités... (minimum 50 caractères)"
                    className={`${inputCls} resize-none`}
                  />
                  <p className={`text-xs ${formData.description.length < 50 ? "text-amber-600" : "text-accent-600"}`}>
                    {formData.description.length}/50 caractères minimum
                  </p>
                  {formData.description.length > 0 && formData.description.length < 50 && (
                    <p className="text-xs text-red-500">La description est trop courte.</p>
                  )}
                </div>

                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className={labelCls}>
                    Lien Google Maps de votre logement <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    name="mapsLink"
                    value={formData.mapsLink}
                    onChange={handleInputChange}
                    required
                    placeholder="https://maps.google.com/..."
                    className={inputCls}
                  />
                  {formData.mapsLink && !/^https?:\/\//.test(formData.mapsLink) && (
                    <p className="text-xs text-red-500">Veuillez saisir une URL valide (commençant par http:// ou https://).</p>
                  )}
                </div>

                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className={labelCls}>Type de logement</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {HOUSING_TYPES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, type: t.id }))}
                        className={`p-3 rounded-2xl border-2 text-sm font-bold transition-all ${
                          formData.type === t.id ? "border-accent bg-accent/5 text-accent" : "border-gray-100 bg-gray-50 text-gray-500 hover:border-accent/30"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelCls}>Ville</label>
                  <select name="city" value={formData.city} onChange={handleInputChange} className={inputCls}>
                    {MOROCCO_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={labelCls}>Quartier</label>
                  <input type="text" name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} placeholder="ex : Agdal, Maârif" className={inputCls} />
                </div>

                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className={labelCls}>Adresse complète</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="L'adresse exacte pour la vérification" className={inputCls} />
                </div>
              </div>

              <button onClick={nextStep} className="w-full md:w-auto px-12 py-4 rounded-2xl clay-gradient text-white font-bold flex items-center justify-center gap-2">
                Continuer <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* ── Step 2 : Property Details ── */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <button onClick={prevStep} className="text-gray-400 flex items-center gap-2 font-bold text-sm hover:text-accent"><ArrowLeft className="w-4 h-4" /> Retour</button>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent"><Home /></div>
                <div>
                  <h2 className="text-3xl font-bold text-primary">Détails de la propriété</h2>
                  <p className="text-gray-400 font-light">Parlez-nous de l&apos;espace.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: "size", label: "Surface (m²)", placeholder: "35" },
                  { name: "bedrooms", label: "Chambres", placeholder: "1" },
                  { name: "bathrooms", label: "Salles de bain", placeholder: "1" },
                ].map((f) => (
                  <div key={f.name} className="space-y-2">
                    <label className={labelCls}>{f.label}</label>
                    <input type="number" name={f.name} value={(formData as any)[f.name]} onChange={handleInputChange} placeholder={f.placeholder} min={0} className={inputCls} />
                  </div>
                ))}
              </div>

              <div>
                <label className={`${labelCls} mb-3`}>Équipements</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["Wifi", "Ascenseur", "Cuisine", "Bureau", "Climatisation", "Machine à laver", "Parking", "Gardien"].map((am) => (
                    <label key={am} className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${formData.amenities.includes(am) ? "border-accent bg-accent/5" : "border-gray-50 bg-gray-50 hover:border-accent/30"}`}>
                      <input type="checkbox" checked={formData.amenities.includes(am)} onChange={() => toggleItem("amenities", am)} className="w-5 h-5 accent-accent" />
                      <span className="text-sm font-medium text-gray-600">{am}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button onClick={nextStep} className="w-full md:w-auto px-12 py-4 rounded-2xl clay-gradient text-white font-bold flex items-center justify-center gap-2">
                Continuer <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* ── Step 3 : Pricing & Availability ── */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <button onClick={prevStep} className="text-gray-400 flex items-center gap-2 font-bold text-sm hover:text-accent"><ArrowLeft className="w-4 h-4" /> Retour</button>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent"><DollarSign /></div>
                <div>
                  <h2 className="text-3xl font-bold text-primary">Prix & Disponibilité</h2>
                  <p className="text-gray-400 font-light">Fixez votre loyer et vos conditions.</p>
                </div>
              </div>

              <div className="max-w-md space-y-6">
                <div className="bg-accent/5 p-8 rounded-[2rem] border-2 border-accent/10">
                  <label className="text-xs uppercase tracking-widest font-black text-accent mb-2 block">Loyer mensuel</label>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-black text-primary">MAD</span>
                    <input type="number" name="price" value={formData.price || ""} onChange={handleInputChange} placeholder="4500" min={0} className="bg-transparent border-none text-4xl font-black text-accent w-full focus:outline-none" />
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.isFurnished} onChange={(e) => setFormData((p) => ({ ...p, isFurnished: e.target.checked }))} className="w-5 h-5 accent-accent" />
                  <span className="text-sm text-gray-500">Logement meublé</span>
                </label>

                <div className="space-y-2">
                  <label className={labelCls}>
                    <Calendar className="w-3.5 h-3.5 inline mr-1" />
                    Disponible dès le
                  </label>
                  <input type="date" name="availableFrom" value={formData.availableFrom} onChange={handleInputChange} min={new Date().toISOString().split("T")[0]} className={inputCls} />
                </div>

                <div className="space-y-2">
                  <label className={labelCls}>
                    <Clock className="w-3.5 h-3.5 inline mr-1" />
                    Durée minimale (mois)
                  </label>
                  <select name="minDuration" value={formData.minDuration} onChange={handleInputChange} className={inputCls}>
                    {[1, 2, 3, 4, 6, 9, 12].map((m) => (
                      <option key={m} value={m}>{m} mois</option>
                    ))}
                  </select>
                </div>
              </div>

              <button onClick={nextStep} className="w-full md:w-auto px-12 py-4 rounded-2xl clay-gradient text-white font-bold flex items-center justify-center gap-2">
                Continuer <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* ── Step 4 : Photos & Vidéos ── */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <button onClick={prevStep} className="text-gray-400 flex items-center gap-2 font-bold text-sm hover:text-accent"><ArrowLeft className="w-4 h-4" /> Retour</button>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent"><Camera /></div>
                <div>
                  <h2 className="text-3xl font-bold text-primary">Photos & Médias</h2>
                  <p className="text-gray-400 font-light">De belles photos augmentent vos chances de réservation.</p>
                </div>
              </div>

              <MediaUploadStep
                images={formData.images}
                videos={formData.videos}
                onImagesChange={(urls) => setFormData((p) => ({ ...p, images: urls }))}
                onVideosChange={(urls) => setFormData((p) => ({ ...p, videos: urls }))}
              />

              <button
                onClick={() => {
                  if (formData.images.length < 2) {
                    setError("Veuillez ajouter au moins 2 photos avant de continuer.");
                    return;
                  }
                  setError("");
                  nextStep();
                }}
                className="w-full md:w-auto px-12 py-4 rounded-2xl clay-gradient text-white font-bold flex items-center justify-center gap-2"
              >
                Continuer <ArrowRight className="w-5 h-5" />
              </button>

              {error && <p className="text-red-500 text-sm">{error}</p>}
            </motion.div>
          )}

          {/* ── Step 5 : Safety & Rules ── */}
          {step === 5 && (
            <motion.div key="s5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <button onClick={prevStep} className="text-gray-400 flex items-center gap-2 font-bold text-sm hover:text-accent"><ArrowLeft className="w-4 h-4" /> Retour</button>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent"><Shield /></div>
                <div>
                  <h2 className="text-3xl font-bold text-primary">Sécurité & Règles</h2>
                  <p className="text-gray-400 font-light">Définissez les règles pour une colocation paisible.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-700 flex items-center gap-2"><Shield className="w-4 h-4" /> Caractéristiques de sécurité</h4>
                  {["Serrures de porte", "Sécurité de l'immeuble", "Caméras externes", "Extincteur"].map((sec) => (
                    <label key={sec} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={formData.safetyFeatures.includes(sec)} onChange={() => toggleItem("safetyFeatures", sec)} className="w-5 h-5 accent-accent" />
                      <span className="text-sm text-gray-500">{sec}</span>
                    </label>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-gray-700 flex items-center gap-2"><Users className="w-4 h-4" /> Règlement intérieur</h4>
                  {["Non-fumeur", "Pas d'animaux", "Pas de fêtes", "Femmes uniquement", "Visites parents autorisées"].map((r) => (
                    <label key={r} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={formData.houseRules.includes(r)} onChange={() => toggleItem("houseRules", r)} className="w-5 h-5 accent-accent" />
                      <span className="text-sm text-gray-500">{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button onClick={handleSubmit} disabled={loading} className="w-full md:w-auto px-12 py-4 rounded-2xl premium-gradient text-white font-bold flex items-center justify-center gap-2 shadow-xl disabled:opacity-50">
                {loading ? "Traitement..." : "Publier l'annonce"} <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* ── Step 6 : Success ── */}
          {step === 6 && (
            <motion.div key="s6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center py-12">
              <div className="w-24 h-24 clay-gradient rounded-full flex items-center justify-center mx-auto mb-8 text-white">
                <CheckCircle className="w-12 h-12" />
              </div>
              <h2 className="text-4xl font-bold text-primary mb-4">Annonce publiée !</h2>
              <p className="text-gray-500 font-light mb-12 max-w-md mx-auto">
                Votre annonce est maintenant visible par des milliers d&apos;étudiants au Maroc. Notre équipe la vérifiera prochainement.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <a href="/dashboard" className="px-12 py-4 rounded-2xl premium-gradient text-white font-bold shadow-2xl hover:scale-105 transition-all inline-block">
                  Aller au tableau de bord
                </a>
                <a href="/search" className="px-12 py-4 rounded-2xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all inline-block">
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
