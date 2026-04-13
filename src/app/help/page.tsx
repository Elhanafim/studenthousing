import Navbar from "@/components/shared/Navbar";
import Link from "next/link";
import { HelpCircle, MessageSquare, Phone, Mail, ChevronDown, BookOpen, Shield, Home, FileText, CreditCard, AlertCircle } from "lucide-react";

export const metadata = { title: "Centre d'aide | StudentHome.ma" };

const CATEGORIES = [
  {
    icon: <Home className="w-5 h-5" />,
    title: "Chercher un logement",
    faqs: [
      { q: "Comment fonctionne la recherche ?", r: "Utilisez les filtres (ville, type, prix, disponibilité) sur la page Recherche. Vous pouvez aussi activer « Hôtes vérifiés uniquement » pour plus de sécurité." },
      { q: "Que signifie « Annonce vérifiée » ?", r: "Notre équipe a contrôlé l'existence du logement, l'identité du propriétaire et la conformité des photos. C'est un gage de sérieux." },
      { q: "Puis-je visiter le logement avant de m'engager ?", r: "Oui. Utilisez la messagerie pour contacter le propriétaire et organiser une visite. Aucun paiement n'est demandé avant la signature du contrat." },
      { q: "Quels sont les types de logements disponibles ?", r: "Chambres, studios, appartements, colivings et logements chez l'habitant (homestay) — partout au Maroc." },
    ],
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Dossier de location",
    faqs: [
      { q: "Qu'est-ce qu'un dossier numérique ?", r: "C'est votre profil de locataire : CIN, carte étudiante, justificatif de revenus ou garant, et une lettre de motivation. Vous le créez une fois et le réutilisez pour toutes vos candidatures." },
      { q: "Quels documents dois-je fournir ?", r: "Au minimum : CIN ou passeport, carte étudiante ou certificat de scolarité, et le nom d'un garant (parent, tuteur ou employeur)." },
      { q: "Mon dossier est-il visible par tous les propriétaires ?", r: "Non. Il n'est transmis qu'au propriétaire à qui vous envoyez une demande de logement, et uniquement quand vous choisissez de le partager." },
      { q: "Puis-je mettre à jour mon dossier après l'avoir créé ?", r: "Oui, à tout moment depuis votre tableau de bord → Mon dossier." },
    ],
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    title: "Caution & Loyer",
    faqs: [
      { q: "Quelle caution les propriétaires peuvent-ils demander ?", r: "En pratique, la caution au Maroc est généralement d'1 à 2 mois de loyer. Elle doit être restituée en fin de bail si le logement est rendu en bon état." },
      { q: "Le loyer est-il négociable ?", r: "Cela dépend du propriétaire. La messagerie vous permet de discuter des conditions avant de vous engager." },
      { q: "StudentHome.ma prend-il une commission ?", r: "Actuellement non. La plateforme est gratuite pour les étudiants et les propriétaires." },
      { q: "Que faire si un propriétaire demande un virement avant visite ?", r: "N'envoyez jamais d'argent sans avoir visité le logement et signé un contrat. Signalez-le immédiatement à notre équipe via le bouton « Signaler »." },
    ],
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Sécurité & Fraudes",
    faqs: [
      { q: "Comment éviter les arnaques ?", r: "Ne payez jamais avant de visiter. Méfiez-vous des prix trop bas. Vérifiez que l'annonce porte le badge « Vérifié ». Passez toujours par la messagerie de la plateforme." },
      { q: "Comment signaler une annonce frauduleuse ?", r: "Cliquez sur « Signaler » sur la fiche de l'annonce, ou contactez-nous à securite@studenthome.ma." },
      { q: "Mes données personnelles sont-elles protégées ?", r: "Oui. Nous ne partageons jamais vos coordonnées directement. Toute communication passe par notre messagerie sécurisée." },
      { q: "Que faire en cas de litige avec un propriétaire ?", r: "Contactez notre service client. Nous documentons toutes les échanges sur la plateforme pour vous aider en cas de conflit." },
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#FAFBFE]">
      <Navbar />

      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="w-16 h-16 clay-gradient rounded-[1.5rem] flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black text-primary mb-4">Centre d&apos;aide</h1>
          <p className="text-gray-400 font-light text-lg mb-8">
            Trouvez rapidement des réponses à vos questions.
          </p>

          {/* Search (visual only) */}
          <div className="relative max-w-xl mx-auto">
            <BookOpen className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Chercher dans l'aide…"
              className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-accent/10 outline-none text-sm font-medium"
            />
          </div>
        </div>
      </section>

      {/* FAQ categories */}
      <section className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        {CATEGORIES.map((cat) => (
          <div key={cat.title}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">{cat.icon}</div>
              <h2 className="text-2xl font-black text-primary">{cat.title}</h2>
            </div>
            <div className="space-y-3">
              {cat.faqs.map((faq) => (
                <details key={faq.q} className="group bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-gray-50 transition-colors">
                    <span className="font-bold text-primary text-sm pr-4">{faq.q}</span>
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0 group-open:rotate-180 transition-transform duration-300" />
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-gray-500 font-light text-sm leading-relaxed border-t border-gray-50 pt-4">{faq.r}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Contact section */}
      <section className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-primary mb-3">Vous n&apos;avez pas trouvé votre réponse ?</h2>
            <p className="text-gray-400 font-light">Notre équipe est disponible du lundi au samedi, de 9h à 19h.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/dashboard/messages" className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 text-center hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mx-auto mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-black text-primary mb-2">Chat en direct</h3>
              <p className="text-gray-400 text-sm font-light">Réponse en moins d&apos;une heure.</p>
            </Link>

            <a href="mailto:support@studenthome.ma" className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 text-center hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-black text-primary mb-2">Email</h3>
              <p className="text-gray-400 text-sm font-light">support@studenthome.ma</p>
            </a>

            <a href="tel:+212522000000" className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 text-center hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-black text-primary mb-2">Téléphone</h3>
              <p className="text-gray-400 text-sm font-light">+212 5 22 00 00 00<br />Lun–Sam · 9h–19h</p>
            </a>
          </div>

          <div className="mt-10 bg-amber-50 border border-amber-200 rounded-[2rem] p-7 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-black text-amber-800 mb-1">Signaler une fraude</h4>
              <p className="text-amber-700 text-sm font-light">
                Si vous avez été victime d&apos;une arnaque ou si vous suspectez une annonce frauduleuse, contactez-nous immédiatement à{" "}
                <a href="mailto:securite@studenthome.ma" className="font-bold underline">securite@studenthome.ma</a>.
                Nous traitons ces signalements en priorité.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
