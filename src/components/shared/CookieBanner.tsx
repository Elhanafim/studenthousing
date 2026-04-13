"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, Settings } from "lucide-react";

const COOKIE_NAME = "consent_preferences";
const COOKIE_DAYS = 365;

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict; Secure`;
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false });

  useEffect(() => {
    const stored = getCookie(COOKIE_NAME);
    if (!stored) setVisible(true);
  }, []);

  const save = (analytics: boolean, marketing: boolean) => {
    setCookie(COOKIE_NAME, JSON.stringify({ essential: true, analytics, marketing }), COOKIE_DAYS);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-[60] max-w-xl mx-auto"
      role="dialog"
      aria-label="Consentement aux cookies"
      aria-modal="false"
    >
      <div className="bg-white rounded-2xl ring-1 ring-gray-200 shadow-2xl p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 brand-gradient rounded-xl flex items-center justify-center shrink-0">
            <Cookie className="w-4 h-4 text-white" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">Nous utilisons des cookies</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Des cookies essentiels sont requis pour le bon fonctionnement du site.
              Vous pouvez accepter les cookies analytiques pour nous aider à améliorer l&apos;expérience.{" "}
              <Link href="/legal/cookies" className="text-brand-600 underline hover:no-underline">
                En savoir plus
              </Link>
            </p>
          </div>
          <button
            onClick={() => save(false, false)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors shrink-0"
            aria-label="Refuser tous les cookies et fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {customOpen && (
          <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
            <label className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-gray-700">Cookies essentiels</p>
                <p className="text-xs text-gray-500">Requis pour la connexion et la sécurité.</p>
              </div>
              <input type="checkbox" checked disabled className="accent-brand-600" aria-label="Cookies essentiels (obligatoires)" />
            </label>
            <label className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-gray-700">Cookies analytiques</p>
                <p className="text-xs text-gray-500">Nous aident à améliorer la plateforme (anonymes).</p>
              </div>
              <input type="checkbox" checked={prefs.analytics}
                onChange={(e) => setPrefs((p) => ({ ...p, analytics: e.target.checked }))}
                className="accent-brand-600" aria-label="Cookies analytiques" />
            </label>
            <label className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-gray-700">Cookies marketing</p>
                <p className="text-xs text-gray-500">Publicités personnalisées (désactivés par défaut).</p>
              </div>
              <input type="checkbox" checked={prefs.marketing}
                onChange={(e) => setPrefs((p) => ({ ...p, marketing: e.target.checked }))}
                className="accent-brand-600" aria-label="Cookies marketing" />
            </label>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => save(true, false)}
            className="flex-1 py-2 brand-gradient text-white text-xs font-semibold rounded-xl hover:shadow-md transition-shadow"
          >
            Accepter tout
          </button>
          <button
            onClick={() => save(false, false)}
            className="flex-1 py-2 border border-gray-200 text-gray-700 text-xs font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            Refuser
          </button>
          {customOpen ? (
            <button
              onClick={() => save(prefs.analytics, prefs.marketing)}
              className="py-2 px-4 bg-gray-100 text-gray-700 text-xs font-medium rounded-xl hover:bg-gray-200 transition-colors"
            >
              Enregistrer mes choix
            </button>
          ) : (
            <button
              onClick={() => setCustomOpen(true)}
              className="py-2 px-3 border border-gray-200 text-gray-600 text-xs font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-1"
            >
              <Settings className="w-3.5 h-3.5" aria-hidden="true" /> Personnaliser
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
