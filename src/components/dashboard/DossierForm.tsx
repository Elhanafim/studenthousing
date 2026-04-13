"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, CheckCircle, FileText, Users, User, Calendar } from "lucide-react";
import { upsertDossier, type DossierFormData } from "@/lib/actions/dossier";

interface DossierFormProps {
  initial: Partial<DossierFormData & { moveInDate?: string }>;
}

const inputCls =
  "w-full p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-accent/10 outline-none transition-all text-sm font-medium";
const labelCls = "text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block";

export default function DossierForm({ initial }: DossierFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<DossierFormData>({
    cinUrl: initial.cinUrl ?? "",
    studentCardUrl: initial.studentCardUrl ?? "",
    enrollmentUrl: initial.enrollmentUrl ?? "",
    incomeProofUrl: initial.incomeProofUrl ?? "",
    guarantorName: initial.guarantorName ?? "",
    guarantorPhone: initial.guarantorPhone ?? "",
    guarantorRelation: initial.guarantorRelation ?? "",
    about: initial.about ?? "",
    budget: initial.budget ?? undefined,
    moveInDate: initial.moveInDate ?? "",
    durationMonths: initial.durationMonths ?? undefined,
  });

  const set = (key: keyof DossierFormData, value: string | number | undefined) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function handleSave() {
    setLoading(true);
    setError("");
    setSaved(false);
    const result = await upsertDossier(form);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSaved(true);
      router.refresh();
    }
  }

  return (
    <div className="space-y-10">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">{error}</div>
      )}
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-green-700 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Dossier sauvegardé avec succès.
        </div>
      )}

      {/* Documents */}
      <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-7">
          <div className="w-10 h-10 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-primary text-lg">Documents</h2>
            <p className="text-xs text-gray-400 font-light">Collez les URLs de vos documents hébergés (Google Drive, Dropbox…)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { key: "cinUrl" as const, label: "CIN / Passeport (URL)" },
            { key: "studentCardUrl" as const, label: "Carte étudiante (URL)" },
            { key: "enrollmentUrl" as const, label: "Certificat de scolarité (URL)" },
            { key: "incomeProofUrl" as const, label: "Justificatif de revenus (URL)" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className={labelCls}>{label}</label>
              <input
                type="url"
                value={form[key] as string ?? ""}
                onChange={(e) => set(key, e.target.value)}
                placeholder="https://…"
                className={inputCls}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Guarantor */}
      <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-7">
          <div className="w-10 h-10 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-primary text-lg">Garant</h2>
            <p className="text-xs text-gray-400 font-light">Un garant rassure les propriétaires.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className={labelCls}>Nom du garant</label>
            <input type="text" value={form.guarantorName ?? ""} onChange={(e) => set("guarantorName", e.target.value)} placeholder="ex : Ahmed El Mansouri" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Téléphone</label>
            <input type="tel" value={form.guarantorPhone ?? ""} onChange={(e) => set("guarantorPhone", e.target.value)} placeholder="+212 6 00 00 00 00" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Relation</label>
            <select value={form.guarantorRelation ?? ""} onChange={(e) => set("guarantorRelation", e.target.value)} className={inputCls}>
              <option value="">Choisir…</option>
              <option value="Parent">Parent</option>
              <option value="Tuteur légal">Tuteur légal</option>
              <option value="Employeur">Employeur</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
        </div>
      </section>

      {/* Personal pitch & preferences */}
      <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-7">
          <div className="w-10 h-10 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-primary text-lg">Présentation & Préférences</h2>
            <p className="text-xs text-gray-400 font-light">Mettez toutes les chances de votre côté.</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className={labelCls}>À propos de moi (50 caractères min.)</label>
            <textarea
              value={form.about ?? ""}
              onChange={(e) => set("about", e.target.value)}
              rows={4}
              placeholder="Je suis étudiant en master à l'Université Mohammed V. Sérieux, calme, non-fumeur…"
              className={`${inputCls} resize-none`}
            />
            <p className="text-[11px] text-gray-400 mt-1">{(form.about ?? "").length} / 1000 caractères</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className={labelCls}>Budget mensuel (MAD)</label>
              <input
                type="number"
                min={0}
                max={50000}
                value={form.budget ?? ""}
                onChange={(e) => set("budget", e.target.value ? Number(e.target.value) : undefined)}
                placeholder="ex : 3500"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Date d&apos;entrée souhaitée</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={form.moveInDate ?? ""}
                  onChange={(e) => set("moveInDate", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className={`${inputCls} pl-9`}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Durée souhaitée</label>
              <select
                value={form.durationMonths ?? ""}
                onChange={(e) => set("durationMonths", e.target.value ? Number(e.target.value) : undefined)}
                className={inputCls}
              >
                <option value="">Non définie</option>
                {[1, 2, 3, 4, 6, 9, 12, 18, 24].map((m) => (
                  <option key={m} value={m}>{m} mois</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full md:w-auto clay-gradient text-white px-12 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-60"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        {loading ? "Sauvegarde…" : "Sauvegarder le dossier"}
      </button>
    </div>
  );
}
