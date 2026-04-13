import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  Eye,
  Lock,
  CheckCircle,
  Users,
  Star,
  AlertCircle,
  MessageSquare,
} from "lucide-react";

export const metadata = { title: "Nos garanties | StudentHome.ma" };

const PILLARS = [
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    color: "bg-green-500",
    lightColor: "bg-green-50 border-green-100",
    title: "Annonces vérifiées",
    subtitle: "Chaque logement est contrôlé avant publication.",
    points: [
      "Vérification manuelle par notre équipe sous 48h",
      "Contrôle de l'identité du propriétaire",
      "Validation de la conformité des photos",
      "Badge « Vérifié » visible sur l'annonce",
      "Signalement possible à tout moment",
    ],
  },
  {
    icon: <FileText className="w-8 h-8" />,
    color: "bg-blue-500",
    lightColor: "bg-blue-50 border-blue-100",
    title: "Dossier numérique sécurisé",
    subtitle: "Vos documents restent sous votre contrôle.",
    points: [
      "Dossier constitué une fois, réutilisé partout",
      "Partagé uniquement avec votre accord explicite",
      "Documents jamais stockés en clair",
      "Suppression possible à tout moment",
      "Conformité RGPD et protection des données",
    ],
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    color: "bg-accent",
    lightColor: "bg-orange-50 border-orange-100",
    title: "Communication sécurisée",
    subtitle: "Vos coordonnées restent confidentielles.",
    points: [
      "Messagerie interne — aucune adresse email révélée",
      "Historique des échanges conservé",
      "Blocage et signalement en un clic",
      "Aucun paiement avant signature de contrat",
      "Assistance en cas de litige",
    ],
  },
];

const STATS = [
  { value: "< 48h", label: "Délai de vérification des annonces" },
  { value: "100%", label: "Annonces contrôlées manuellement" },
  { value: "0 MAD", label: "Aucune commission ni frais cachés" },
  { value: "6j/7", label: "Support disponible 9h–19h" },
];

const TIPS = [
  { icon: <Eye className="w-5 h-5" />, tip: "Visitez toujours le logement avant de signer quoi que ce soit." },
  { icon: <Lock className="w-5 h-5" />, tip: "Ne versez jamais d'argent en dehors de la plateforme." },
  { icon: <AlertCircle className="w-5 h-5" />, tip: "Un prix anormalement bas doit vous mettre en alerte." },
  { icon: <Users className="w-5 h-5" />, tip: "Préférez les propriétaires avec un badge de vérification et des avis." },
  { icon: <FileText className="w-5 h-5" />, tip: "Exigez toujours un contrat de bail écrit avant d'emménager." },
  { icon: <Star className="w-5 h-5" />, tip: "Laissez un avis après votre expérience pour aider les futurs étudiants." },
];

export default function GuaranteesPage() {
  return (
    <div className="min-h-screen bg-[#FAFBFE]">

      {/* Hero */}
      <section className="bg-primary py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-96 h-96 bg-accent rounded-full absolute -top-20 -right-20 blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4">
          <div className="w-16 h-16 bg-green-500 rounded-[1.5rem] flex items-center justify-center text-white mx-auto mb-6 shadow-xl">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-5xl font-black text-white mb-5 leading-tight">
            Votre sécurité,<br /><span className="text-accent">notre priorité</span>
          </h1>
          <p className="text-white/70 font-light text-lg max-w-xl mx-auto">
            StudentHome.ma s&apos;engage à offrir un environnement sûr et fiable pour les étudiants et les propriétaires marocains.
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-black text-accent mb-1">{s.value}</div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Three pillars */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-black text-primary mb-4">Nos trois piliers de confiance</h2>
          <p className="text-gray-400 font-light text-lg max-w-xl mx-auto">
            Chaque étape de votre expérience est pensée pour protéger les deux parties.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILLARS.map((p) => (
            <div key={p.title} className={`rounded-[2rem] border p-8 ${p.lightColor}`}>
              <div className={`w-14 h-14 ${p.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                {p.icon}
              </div>
              <h3 className="text-xl font-black text-primary mb-2">{p.title}</h3>
              <p className="text-gray-500 font-light text-sm mb-6">{p.subtitle}</p>
              <ul className="space-y-3">
                {p.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600 font-medium">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section className="bg-white border-y border-gray-100 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-primary mb-3">Nos conseils de sécurité</h2>
            <p className="text-gray-400 font-light">Quelques réflexes simples pour vous protéger.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TIPS.map(({ icon, tip }) => (
              <div key={tip} className="flex items-start gap-4 bg-gray-50 rounded-[1.5rem] p-6">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0">{icon}</div>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-black text-primary mb-4">Prêt à trouver votre logement en toute confiance ?</h2>
        <p className="text-gray-400 font-light mb-8 max-w-lg mx-auto">
          Rejoignez des milliers d&apos;étudiants qui trouvent leur logement idéal au Maroc grâce à StudentHome.ma.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/search" className="clay-gradient text-white px-10 py-4 rounded-2xl font-black text-base shadow-xl hover:scale-105 transition-all">
            Chercher un logement
          </Link>
          <Link href="/help" className="bg-gray-100 text-primary px-10 py-4 rounded-2xl font-bold text-base hover:bg-gray-200 transition-all">
            Centre d&apos;aide
          </Link>
        </div>
      </section>
    </div>
  );
}
