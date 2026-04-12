import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building, MapPin, DollarSign, Camera, Shield, 
  ArrowRight, ArrowLeft, CheckCircle, Info, Home, Users 
} from "lucide-react";
import { createListing } from "@/lib/actions/listings";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

export default function CreateListingWizard() {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    type: "ROOM" as any,
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
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070"], // Default mock image for now
  });

  const nextStep = () => setStep((s) => (s + 1) as Step);
  const prevStep = () => setStep((s) => (s - 1) as Step);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (category: "amenities" | "safetyFeatures" | "houseRules", value: string) => {
    setFormData(prev => {
      const current = prev[category] as string[];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(i => i !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    const res = await createListing(formData);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      setStep(6);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-1 bg-white md:p-8 md:bg-transparent">
      <div className="md:glass rounded-[3rem] p-8 md:p-12 shadow-2xl">
        {/* Horizontal Stepper */}
        <div className="hidden md:flex justify-between mb-16 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0" />
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div 
              key={s}
              className={`w-12 h-12 rounded-full flex flex-col items-center justify-center relative z-10 transition-all duration-500 ${
                step >= s ? "clay-gradient text-white" : "bg-white text-gray-400 border border-gray-100"
              }`}
            >
              {step > s || success ? <CheckCircle className="w-6 h-6" /> : <span className="text-sm font-bold">{s}</span>}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
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
                  <label className="text-sm font-bold text-gray-700">Titre de l'annonce</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="ex: Studio moderne proche de l'UM6P Rabat" className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white transition-all ring-accent/0 focus:ring-4 outline-none" />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold text-gray-700">Ville</label>
                   <select name="city" value={formData.city} onChange={handleInputChange} className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none">
                      <option value="Casablanca">Casablanca</option>
                      <option value="Rabat">Rabat</option>
                      <option value="Marrakech">Marrakech</option>
                      <option value="Fès">Fès</option>
                      <option value="Tanger">Tanger</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold text-gray-700">Quartier</label>
                   <input type="text" name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} placeholder="ex: Agdal, Maârif" className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none" />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-700">Adresse complète</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="L'adresse exacte pour la vérification" className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none" />
                </div>
              </div>
              <button onClick={nextStep} className="w-full md:w-auto px-12 py-4 rounded-2xl clay-gradient text-white font-bold flex items-center justify-center gap-2">
                Continuer <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
               <button onClick={prevStep} className="text-gray-400 flex items-center gap-2 font-bold text-sm hover:text-accent"><ArrowLeft className="w-4 h-4" /> Retour</button>
               <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent"><Home /></div>
                <div>
                  <h2 className="text-3xl font-bold text-primary">Détails de la propriété</h2>
                  <p className="text-gray-400 font-light">Parlez-nous de l'espace.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-400 uppercase">Surface (m²)</label>
                   <input type="number" name="size" value={formData.size} onChange={handleInputChange} placeholder="Taille" className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-400 uppercase">Chambres</label>
                   <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} placeholder="Chambres" className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-400 uppercase">Salles de bain</label>
                   <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} placeholder="Salles de bain" className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50" />
                 </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {["Wifi", "Ascenseur", "Cuisine", "Bureau", "Climatisation", "Machine à laver", "Parking"].map(am => (
                   <label key={am} className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${formData.amenities.includes(am) ? "border-accent bg-accent/5" : "border-gray-50 bg-gray-50 hover:border-accent/30"}`}>
                      <input type="checkbox" checked={formData.amenities.includes(am)} onChange={() => handleCheckboxChange("amenities", am)} className="w-5 h-5 accent-accent" />
                      <span className="text-sm font-medium text-gray-600">{am}</span>
                   </label>
                 ))}
              </div>
              <button onClick={nextStep} className="w-full md:w-auto px-12 py-4 rounded-2xl clay-gradient text-white font-bold flex items-center justify-center gap-2">
                Continuer <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
               <button onClick={prevStep} className="text-gray-400 flex items-center gap-2 font-bold text-sm"><ArrowLeft className="w-4 h-4" /> Retour</button>
               <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent"><DollarSign /></div>
                <div>
                  <h2 className="text-3xl font-bold text-primary">Prix & Conditions</h2>
                  <p className="text-gray-400 font-light">Fixez votre loyer mensuel et vos règles.</p>
                </div>
              </div>
              <div className="max-w-md space-y-6">
                <div className="bg-accent/5 p-8 rounded-[2rem] border-2 border-accent/10">
                   <label className="text-xs uppercase tracking-widest font-black text-accent mb-2 block">Loyer mensuel</label>
                   <div className="flex items-center gap-4">
                      <span className="text-4xl font-black text-primary">MAD</span>
                      <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="4500" className="bg-transparent border-none text-4xl font-black text-accent w-full focus:outline-none" />
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <input type="checkbox" className="w-5 h-5 accent-accent" defaultChecked />
                   <span className="text-sm text-gray-500">Charges incluses (Eau, Électricité, Internet)</span>
                </div>
              </div>
              <button onClick={nextStep} className="w-full md:w-auto px-12 py-4 rounded-2xl clay-gradient text-white font-bold flex items-center justify-center gap-2">
                Continuer <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
               <button onClick={prevStep} className="text-gray-400 flex items-center gap-2 font-bold text-sm"><ArrowLeft className="w-4 h-4" /> Retour</button>
               <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent"><Camera /></div>
                <div>
                  <h2 className="text-3xl font-bold text-primary">Photos & Médias</h2>
                  <p className="text-gray-400 font-light">De belles photos augmentent vos chances de réservation.</p>
                </div>
              </div>
              <div className="border-4 border-dashed border-gray-100 rounded-[2.5rem] p-20 text-center hover:border-accent/30 transition-all cursor-pointer bg-gray-50/50">
                 <Camera className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                 <div className="text-lg font-bold text-gray-500">Glissez-déposez vos photos ici</div>
                 <p className="text-sm text-gray-400 font-light mt-2">Nous utilisons une image par défaut pour cette démo.</p>
              </div>
              <button onClick={nextStep} className="w-full md:w-auto px-12 py-4 rounded-2xl clay-gradient text-white font-bold flex items-center justify-center gap-2">
                Continuer <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="s5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <button onClick={prevStep} className="text-gray-400 flex items-center gap-2 font-bold text-sm"><ArrowLeft className="w-4 h-4" /> Retour</button>
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
                    {["Serrures de porte", "Sécurité de l'immeuble", "Caméras externes", "Extincteur"].map(sec => (
                      <label key={sec} className="flex items-center gap-3">
                         <input type="checkbox" checked={formData.safetyFeatures.includes(sec)} onChange={() => handleCheckboxChange("safetyFeatures", sec)} className="w-5 h-5 accent-accent" />
                         <span className="text-sm text-gray-500">{sec}</span>
                      </label>
                    ))}
                 </div>
                 <div className="space-y-4">
                    <h4 className="font-bold text-gray-700 flex items-center gap-2"><Users className="w-4 h-4" /> Règlement intérieur</h4>
                    {["Non-fumeur", "Pas d'animaux", "Pas de fêtes", "Femmes uniquement", "Visites parents autorisées"].map(r => (
                      <label key={r} className="flex items-center gap-3">
                         <input type="checkbox" checked={formData.houseRules.includes(r)} onChange={() => handleCheckboxChange("houseRules", r)} className="w-5 h-5 accent-accent" />
                         <span className="text-sm text-gray-500">{r}</span>
                      </label>
                    ))}
                 </div>
              </div>
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full md:w-auto px-12 py-4 rounded-2xl premium-gradient text-white font-bold flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
              >
                {loading ? "Traitement..." : "Prévisualiser l'annonce"} <ArrowRight className="w-5 h-5" />
              </button>
              {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            </motion.div>
          )}

          {step === 6 && (
            <motion.div key="s6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center py-12">
               <div className="w-24 h-24 clay-gradient rounded-full flex items-center justify-center mx-auto mb-8 text-white">
                  <CheckCircle className="w-12 h-12" />
               </div>
               <h2 className="text-4xl font-bold text-primary mb-4">Prêt à publier !</h2>
               <p className="text-gray-500 font-light mb-12 max-w-md mx-auto">Votre annonce est prête à atteindre des milliers d'étudiants au Maroc. Cliquez sur publier pour commencer.</p>
               <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <button onClick={() => window.location.href = "/"} className="px-12 py-4 rounded-2xl premium-gradient text-white font-bold shadow-2xl hover:scale-105 transition-all">Aller à l'accueil</button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
        </AnimatePresence>
      </div>
    </div>
  );
}
