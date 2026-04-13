import Link from "next/link";
import { Building2, Mail, Phone, MapPin, Gift } from "lucide-react";

const PLATFORM_LINKS = [
  { href: "/search",       label: "Rechercher un logement" },
  { href: "/publish",      label: "Publier une annonce" },
  { href: "/how-it-works", label: "Comment ça marche" },
  { href: "/guarantees",   label: "Nos garanties" },
  { href: "/hosts",        label: "Espace propriétaires" },
];

const LEGAL_LINKS = [
  { href: "/legal/terms",            label: "Conditions d'utilisation" },
  { href: "/legal/privacy",          label: "Politique de confidentialité" },
  { href: "/legal/cookies",          label: "Politique de cookies" },
  { href: "/legal/mentions-legales", label: "Mentions légales" },
  { href: "/legal/charte-hotes",     label: "Charte des hôtes" },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200" aria-label="Pied de page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1 — Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="StudentHome.ma — Accueil">
              <div className="w-8 h-8 brand-gradient rounded-lg flex items-center justify-center shadow-sm">
                <Building2 className="text-white w-4 h-4" aria-hidden="true" />
              </div>
              <span className="text-[15px] font-semibold tracking-tight text-gray-900">
                StudentHome<span className="text-brand-600">.ma</span>
              </span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              La première plateforme dédiée au logement étudiant au Maroc.
            </p>
            <div className="inline-flex items-center gap-1.5 bg-accent-100 text-accent-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-accent-100">
              <Gift className="w-3.5 h-3.5" aria-hidden="true" />
              100% Gratuit — 0% commission
            </div>
          </div>

          {/* Col 2 — Plateforme */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Plateforme</h3>
            <ul className="space-y-3">
              {PLATFORM_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-600 hover:text-brand-600 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Légal */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Légal</h3>
            <ul className="space-y-3">
              {LEGAL_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-600 hover:text-brand-600 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" aria-hidden="true" />
                <a href="mailto:support@studenthome.ma" className="hover:text-brand-600 transition-colors">
                  support@studenthome.ma
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" aria-hidden="true" />
                <a href="tel:+212522000000" className="hover:text-brand-600 transition-colors">
                  +212 522 00 00 00
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" aria-hidden="true" />
                <span>Casablanca, Maroc</span>
              </li>
              <li className="text-xs text-gray-400 pl-6">Lun–Sam, 9h–19h</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            © 2026 StudentHome.ma — Tous droits réservés
          </p>
          <p className="text-xs text-gray-400">
            Conforme WCAG AA · Données protégées au Maroc
          </p>
        </div>
      </div>
    </footer>
  );
}
