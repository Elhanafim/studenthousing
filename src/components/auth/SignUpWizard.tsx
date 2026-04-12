"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Shield, Building, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { registerUser } from "@/lib/actions/user";

type Step = 1 | 2 | 3;

export default function SignUpWizard() {
  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState<"STUDENT" | "HOST" | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    university: "",
    profession: "",
     safetyQuestions: {
      rentedBefore: false,
      parentVisits: true,
      livesOnsite: false,
    }
  });

  const nextStep = () => setStep((s) => (s + 1) as Step);
  const prevStep = () => setStep((s) => (s - 1) as Step);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        setFormData(prev => ({
          ...prev,
          [parent]: { ...(prev as any)[parent], [child]: checked }
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    
    // Simple validation
    if (!formData.email || !formData.password || !formData.name) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const res = await registerUser({
      ...formData,
      role: role!,
      safetyAnswers: formData.safetyQuestions
    });

    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      // Success - redirect or show success state
      setStep(4 as any); // Success step
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 glass rounded-[2.5rem] shadow-2xl">
      {/* Progress Bar */}
      <div className="flex justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0" />
        {[1, 2, 3].map((s) => (
          <div 
            key={s}
            className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-all duration-500 ${
              step >= s ? "clay-gradient text-white scale-110" : "bg-white text-gray-400 border border-gray-100"
            }`}
          >
            {step > s || step > 3 ? <CheckCircle className="w-5 h-5" /> : <span>{s}</span>}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-3xl font-bold text-primary mb-2">Bienvenue !</h2>
            <p className="text-gray-500 mb-8 font-light">Commençons par définir votre rôle sur la plateforme.</p>
            
            <div className="grid grid-cols-1 gap-4 mb-8">
              {[
                { id: "STUDENT", label: "Je suis un Étudiant", desc: "À la recherche d'un logement sûr et moderne.", icon: <User className="w-6 h-6" /> },
                { id: "HOST", label: "Je suis un Hôte", desc: "Je propose une chambre ou un appartement.", icon: <Building className="w-6 h-6" /> }
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id as any)}
                  className={`flex items-center gap-6 p-6 rounded-3xl border-2 transition-all text-left ${
                    role === r.id ? "border-accent bg-accent/5 ring-4 ring-accent/10" : "border-gray-100 hover:border-accent/30"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${role === r.id ? "clay-gradient text-white" : "bg-gray-50 text-gray-400"}`}>
                    {r.icon}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{r.label}</div>
                    <div className="text-sm text-gray-400">{r.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            <button 
              disabled={!role}
              onClick={nextStep}
              className="w-full py-4 rounded-2xl clay-gradient text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale transition-all"
            >
              Continuer <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <button onClick={prevStep} className="text-gray-400 hover:text-primary mb-6 flex items-center gap-1 text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Retour
            </button>
            <h2 className="text-3xl font-bold text-primary mb-2">Informations de base</h2>
            <p className="text-gray-500 mb-8 font-light">Vos coordonnées pour instaurer la confiance.</p>

            <div className="space-y-4 mb-8">
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Nom complet" className="w-full p-4 rounded-2xl bg-white border border-gray-100 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium" />
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Adresse email" className="w-full p-4 rounded-2xl bg-white border border-gray-100 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium" />
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Téléphone (+212...)" className="w-full p-4 rounded-2xl bg-white border border-gray-100 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium" />
              <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Mot de passe" className="w-full p-4 rounded-2xl bg-white border border-gray-100 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium" />
            </div>

            <button 
              onClick={nextStep}
              className="w-full py-4 rounded-2xl clay-gradient text-white font-bold flex items-center justify-center gap-2"
            >
              Suivant: Confiance & Sécurité <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <button onClick={prevStep} className="text-gray-400 hover:text-primary mb-6 flex items-center gap-1 text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Retour
            </button>
            <h2 className="text-3xl font-bold text-primary mb-2">Confiance & Sécurité</h2>
            <p className="text-gray-500 mb-8 font-light">Aidez-nous à garantir une communauté sûre.</p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
                  <Shield className="text-accent w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold mb-1 text-sm">Vérification parentale</div>
                  <p className="text-xs text-gray-400 mb-3">Accepté de fournir les coordonnées d'un tuteur si demandé ?</p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="safetyQuestions.parentVisits" checked={formData.safetyQuestions.parentVisits} onChange={handleInputChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>
              </div>

              {role === "HOST" ? (
                <div className="space-y-4">
                   <div className="text-sm font-medium text-gray-500">Engagement de l'hôte</div>
                   <input type="text" name="profession" value={formData.profession} onChange={handleInputChange} placeholder="Expérience en tant qu'hôte (ex: 2 ans)" className="w-full p-4 rounded-2xl bg-white border border-gray-100" />
                   <div className="flex items-center gap-3">
                      <input type="checkbox" name="safetyQuestions.livesOnsite" checked={formData.safetyQuestions.livesOnsite} onChange={handleInputChange} className="w-5 h-5 accent-accent" />
                      <span className="text-xs text-gray-500 font-light">Je vis sur place ou à proximité pour les urgences.</span>
                   </div>
                </div>
              ) : (
                <div className="space-y-4">
                   <div className="text-sm font-medium text-gray-500">Statut Étudiant</div>
                   <input type="text" name="university" value={formData.university} onChange={handleInputChange} placeholder="Nom de l'université (ex: UM6P, UIK)" className="w-full p-4 rounded-2xl bg-white border border-gray-100" />
                   <input type="text" name="profession" value={formData.profession} onChange={handleInputChange} placeholder="Filière / Niveau d'études" className="w-full p-4 rounded-2xl bg-white border border-gray-100" />
                </div>
              )}
            </div>

            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 rounded-2xl premium-gradient text-white font-bold flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
            >
              {loading ? "Création en cours..." : "Compléter l'inscription"} <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {(step as any) === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-primary mb-2">Compte créé !</h2>
            <p className="text-gray-500 mb-8">Bienvenue sur StudentHome.ma. Vous pouvez maintenant vous connecter.</p>
            <button 
              onClick={() => window.location.href = "/auth/signin"}
              className="w-full py-4 rounded-2xl clay-gradient text-white font-bold"
            >
              Se connecter
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
      </AnimatePresence>
    </div>
  );
}
