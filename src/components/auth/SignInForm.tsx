"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowRight, RefreshCw, CheckCircle } from "lucide-react";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [unverified, setUnverified] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const verified = searchParams.get("verified") === "1";
  const tokenError = searchParams.get("error");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setUnverified(false);

    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      if (result.error.includes("EMAIL_NOT_VERIFIED")) {
        setUnverified(true);
      } else {
        setError("Email ou mot de passe incorrect.");
      }
    } else {
      // Check role to redirect admin to /admin, everyone else to /dashboard
      const session = await getSession();
      const role = (session?.user as any)?.role;
      router.push(role === "ADMIN" ? "/admin" : "/dashboard");
      router.refresh();
    }
  };

  const handleResend = async () => {
    if (!formData.email) {
      setError("Veuillez saisir votre adresse email pour renvoyer le lien.");
      return;
    }
    setResending(true);
    const res = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email }),
    });
    setResending(false);
    if (res.ok) {
      setResent(true);
    } else {
      const d = await res.json();
      setError(d.error ?? "Erreur lors de l'envoi.");
    }
  };

  const inputCls =
    "w-full p-4 rounded-2xl bg-white border border-gray-100 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium";

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-5">
      {verified && (
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-2xl text-sm font-medium">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Email vérifié avec succès ! Vous pouvez maintenant vous connecter.
        </div>
      )}

      {tokenError === "token_expired" && (
        <p className="text-amber-600 text-sm text-center bg-amber-50 py-3 px-4 rounded-2xl">
          Le lien de vérification a expiré. Connectez-vous pour en recevoir un nouveau.
        </p>
      )}

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Adresse email
        </label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
          placeholder="vous@example.com"
          className={inputCls}
          autoComplete="email"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Mot de passe
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={formData.password}
            onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
            placeholder="••••••••"
            className={`${inputCls} pr-12`}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {unverified && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
          <p className="text-amber-700 text-sm font-medium">
            Veuillez vérifier votre adresse email avant de vous connecter.
          </p>
          {resent ? (
            <p className="text-green-600 text-sm flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Email renvoyé avec succès.
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${resending ? "animate-spin" : ""}`} />
              {resending ? "Envoi en cours..." : "Renvoyer l'email de vérification"}
            </button>
          )}
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm text-center bg-red-50 py-3 px-4 rounded-2xl">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-2xl clay-gradient text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 transition-all"
      >
        {loading ? "Connexion..." : "Se connecter"}
        <ArrowRight className="w-5 h-5" />
      </button>
    </form>
  );
}
