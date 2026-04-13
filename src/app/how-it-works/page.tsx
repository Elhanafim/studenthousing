import type { Metadata } from "next";
import Link from "next/link";
import {
  Search, FileText, MessageSquare, ShieldCheck,
  Users, Home, BadgeCheck, ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Comment ça marche",
  description: "Découvrez comment StudentHome.ma fonctionne pour trouver ou publier un logement étudiant au Maroc.",
};

const STUDENT_STEPS = [
  { step: "01", icon: Search,        title: "Recherchez",              desc: "Filtrez par ville, type de logement et budget. Toutes les annonces sont vérifiées." },
  { step: "02", icon: FileText,       title: "Créez votre dossier",     desc: "Remplissez votre dossier de location une seule fois. Il sera envoyé automatiquement à chaque candidature." },
  { step: "03", icon: MessageSquare,  title: "Contactez l'hôte",        desc: "Envoyez une demande, réservez une visite en ligne, et échangez directement avec le propriétaire." },
  { step: "04", icon: ShieldCheck,    title: "Emménagez sereinement",   desc: "Signez votre bail. Notre équipe reste disponible en cas de problème." },
];

const HOST_STEPS = [
  { step: "01", icon: Home,           title: "Choisissez votre scénario", desc: "Colocation, sous-location temporaire ou cession de chambre — chaque situation est prise en compte." },
  { step: "02", icon: FileText,       title: "Publiez votre annonce",     desc: "Remplissez le formulaire, ajoutez des photos et une vidéo. Publication gratuite, sans commission." },
  { step: "03", icon: BadgeCheck,     title: "Validation de l'équipe",    desc: "Notre équipe vérifie votre annonce sous 24h pour garantir la sécurité de la plateforme." },
  { step: "04", icon: Users,          title: "Accueillez un étudiant",    desc: "Gérez les demandes, organisez les visites et choisissez votre locataire en toute confiance." },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">Comment ça marche ?</h1>
          <p className="text-gray-600 leading-relaxed">
            StudentHome.ma est conçu pour être simple, rapide et sécurisé — que vous cherchiez un logement
            ou que vous souhaitiez en partager un.
          </p>
        </div>
      </section>

      {/* Student flow */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center">
              <Search className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Pour les étudiants chercheurs</h2>
              <p className="text-gray-500 text-sm">Trouvez le logement idéal en 4 étapes</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {STUDENT_STEPS.map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="bg-white rounded-2xl ring-1 ring-gray-200 p-6 flex gap-4">
                <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center text-white shrink-0">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-brand-600 uppercase tracking-widest mb-1">{step}</div>
                  <h3 className="font-semibold text-gray-900 mb-1.5">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/search" className="inline-flex items-center gap-2 px-6 py-3 brand-gradient text-white text-sm font-semibold rounded-xl hover:shadow-md transition-shadow">
              Chercher un logement <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Host flow */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-accent-600 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Pour les étudiants-hôtes</h2>
              <p className="text-gray-500 text-sm">Publiez votre logement gratuitement en 4 étapes</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {HOST_STEPS.map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="bg-white rounded-2xl ring-1 ring-gray-200 p-6 flex gap-4">
                <div className="w-10 h-10 bg-accent-600 rounded-xl flex items-center justify-center text-white shrink-0">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-accent-600 uppercase tracking-widest mb-1">{step}</div>
                  <h3 className="font-semibold text-gray-900 mb-1.5">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/publish" className="inline-flex items-center gap-2 px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white text-sm font-semibold rounded-xl transition-colors hover:shadow-md">
              Publier une annonce <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 border-t border-gray-100 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Questions fréquentes</h2>
          <div className="space-y-4">
            {[
              { q: "Est-ce vraiment gratuit ?", a: "Oui, totalement. Aucun frais d'inscription, aucune commission sur les transactions, aucun abonnement. StudentHome.ma est 100% gratuit pour les étudiants et les hôtes." },
              { q: "Comment les annonces sont-elles vérifiées ?", a: "Notre équipe vérifie chaque annonce manuellement avant publication. Nous contactons l'hôte pour confirmer l'adresse, les photos et les informations fournies." },
              { q: "Puis-je publier une annonce si je suis locataire ?", a: "Oui, à condition d'avoir l'accord écrit de votre propriétaire. Consultez notre charte des hôtes pour les conditions détaillées." },
              { q: "Comment réserver une visite ?", a: "Depuis la page de l'annonce, consultez les créneaux disponibles proposés par l'hôte et réservez directement en un clic. Vous recevez une confirmation et un fichier .ics pour ajouter la visite à votre calendrier." },
              { q: "StudentHome.ma gère-t-il les paiements ?", a: "Non. Les transactions financières se font directement entre le locataire et l'hôte. Nous facilitons la mise en relation mais ne gérons aucun paiement." },
            ].map(({ q, a }) => (
              <details key={q} className="group bg-surface rounded-xl ring-1 ring-gray-200 p-5">
                <summary className="font-semibold text-gray-900 text-sm cursor-pointer list-none flex items-center justify-between">
                  {q}
                  <span className="w-5 h-5 text-gray-400 group-open:rotate-45 transition-transform shrink-0 text-lg leading-none">+</span>
                </summary>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
