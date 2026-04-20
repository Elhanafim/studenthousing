"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export default function SignInForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email ou mot de passe incorrect.");
    } else {
      const session = await getSession();
      const role = (session?.user as any)?.role;
      router.push(role === "ADMIN" ? "/admin" : "/dashboard");
      router.refresh();
    }
  };

  const inputCls =
    "w-full p-4 rounded-2xl bg-white border border-gray-100 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium";

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-5">
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
