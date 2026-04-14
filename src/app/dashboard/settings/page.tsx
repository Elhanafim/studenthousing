"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Camera, Save, Loader2 } from "lucide-react";

export default function ProfileSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin");
    if (status === "authenticated" && session?.user) {
      setEmail(session.user.email ?? "");
      setImage(session.user.image ?? null);
    }
  }, [status, session, router]);

  useEffect(() => {
    async function loadProfile() {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setBio(data.about ?? "");
        setPhone(data.phone ?? "");
        if (data.image) setImage(data.image);
      }
    }
    if (status === "authenticated") loadProfile();
  }, [status]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ about: bio, phone, email, image }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      const d = await res.json();
      setError(d.error ?? "Erreur lors de la sauvegarde.");
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  if (status === "loading") return null;

  const user = session?.user as any;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Mon profil</h1>
        <p className="text-gray-600 text-sm mt-1">Vos informations visibles par les autres membres.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Photo */}
        <div className="bg-white rounded-2xl ring-1 ring-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Photo de profil</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              {image ? (
                <img src={image} alt="Photo de profil" className="w-20 h-20 rounded-full object-cover ring-2 ring-gray-200" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-2xl font-bold ring-2 ring-gray-200">
                  {user?.name?.charAt(0)?.toUpperCase() ?? "?"}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
                aria-label="Changer la photo"
              >
                <Camera className="w-3.5 h-3.5 text-gray-600" />
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="text-sm font-medium text-brand-600 hover:underline"
              >
                Changer la photo
              </button>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — 5 Mo max.</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* Bio */}
        <div className="bg-white rounded-2xl ring-1 ring-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">À propos de vous</h2>
          <div>
            <label className="block text-xs text-gray-500 mb-2">
              Courte description <span className="text-gray-400">({bio.length}/300)</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 300))}
              rows={4}
              maxLength={300}
              placeholder="Présentez-vous brièvement : votre université, vos centres d'intérêt, vos attentes..."
              className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-200 focus:outline-none resize-none transition"
            />
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl ring-1 ring-gray-200 p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-900">Informations de contact</h2>
          <div>
            <label className="block text-xs text-gray-500 mb-2">Adresse email <span className="text-red-500">*</span></label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-200 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-2">Numéro de téléphone <span className="text-gray-400">(facultatif)</span></label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+212 6XX XXX XXX"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-200 focus:outline-none transition"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3 brand-gradient text-white text-sm font-semibold rounded-xl hover:shadow-md transition-shadow disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Enregistrement..." : saved ? "Profil sauvegardé !" : "Enregistrer le profil"}
        </button>
      </form>
    </div>
  );
}
