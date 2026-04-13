import Link from "next/link";
import { Search, Home } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page introuvable" };

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-surface">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 brand-gradient rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-3xl font-bold" aria-hidden="true">404</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Page introuvable</h1>
        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
          Utilisez la recherche pour trouver ce dont vous avez besoin.
        </p>

        <div className="bg-white rounded-xl ring-1 ring-gray-200 p-4 mb-6">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400 shrink-0" aria-hidden="true" />
            <Link href="/search" className="flex-1 text-sm text-gray-500 text-left hover:text-brand-600 transition-colors">
              Rechercher un logement étudiant…
            </Link>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 brand-gradient text-white text-sm font-semibold rounded-xl hover:shadow-md transition-shadow"
        >
          <Home className="w-4 h-4" /> Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
