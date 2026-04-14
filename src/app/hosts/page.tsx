import Link from "next/link";
import { ShieldCheck, TrendingUp, Users, Star, CheckCircle, Building, MessageSquare, BarChart3 } from "lucide-react";

export const metadata = { title: "Propriétaires | Bayt-Talib" };

const STEPS = [
  { n: "01", title: "Créez votre compte", desc: "Inscription gratuite en 2 minutes. Choisissez le rôle « Propriétaire »." },
  { n: "02", title: "Publiez votre annonce", desc: "Notre wizard vous guide étape par étape : photos, prix, équipements, règles." },
  { n: "03", title: "Recevez les candidatures", desc: "Les étudiants vous envoient leur dossier directement via la plateforme." },
  { n: "04", title: "Choisissez votre locataire", desc: "Acceptez ou refusez librement. Échangez par messagerie intégrée." },
];

const BENEFITS = [
  { icon: <Users className="w-6 h-6" />, title: "Des étudiants sérieux", desc: "Chaque étudiant constitue un dossier numérique : CIN, carte étudiante, garant, lettre de motivation." },
  { icon: <ShieldCheck className="w-6 h-6" />, title: "Sécurité renforcée", desc: "Vérification d'identité, badge de confiance, et historique d'avis pour rassurer les deux parties." },
  { icon: <TrendingUp className="w-6 h-6" />, title: "Visibilité maximale", desc: "Votre annonce exposée à des milliers d'étudiants marocains cherchant un logement." },
  { icon: <MessageSquare className="w-6 h-6" />, title: "Messagerie intégrée", desc: "Communiquez directement avec les candidats sans divulguer vos coordonnées." },
  { icon: <BarChart3 className="w-6 h-6" />, title: "Tableau de bord complet", desc: "Gérez toutes vos annonces, demandes et messages en un seul endroit." },
  { icon: <Star className="w-6 h-6" />, title: "Avis vérifiés", desc: "Construisez votre réputation grâce aux avis laissés par vos anciens locataires." },
];

const FAQS = [
  { q: "Combien coûte la mise en ligne d'une annonce ?", r: "La publication est entièrement gratuite. Bayt-Talib est une plateforme sans commission pour les propriétaires." },
  { q: "Comment se passe la vérification de mon annonce ?", r: "Notre équipe examine chaque annonce sous 24 à 48 h pour valider les informations et attribuer le badge « Vérifié »." },
  { q: "Puis-je publier plusieurs annonces ?", r: "Oui, il n'y a aucune limite. Gérez toutes vos propriétés depuis un seul tableau de bord." },
  { q: "Comment suis-je notifié d'une nouvelle candidature ?", r: "Vous recevez un message dans votre boîte de messagerie dès qu'un étudiant envoie une demande." },
  { q: "Puis-je refuser une candidature ?", r: "Absolument. Vous restez libre d'accepter ou de refuser sans avoir à justifier votre décision." },
];

export default function HostsPage() {
  return (
    <div className="min-h-screen bg-[#FAFBFE]">

      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-96 h-96 bg-accent rounded-full absolute -top-20 -right-20 blur-3xl" />
          <div className="w-64 h-64 bg-accent rounded-full absolute bottom-0 left-10 blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Building className="w-4 h-4" /> Pour les propriétaires
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Louez à des étudiants<br />
            <span className="text-accent">en toute sérénité</span>
          </h1>
          <p className="text-xl text-white/70 font-light max-w-2xl mx-auto mb-10">
            Rejoignez la première plateforme marocaine dédiée au logement étudiant. Publication gratuite, dossiers numériques, messagerie intégrée.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="clay-gradient text-white px-10 py-4 rounded-2xl font-black text-lg shadow-2xl hover:scale-105 transition-all">
              Publier une annonce — Gratuit
            </Link>
            <Link href="/search" className="bg-white/10 text-white border border-white/20 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all">
              Voir la plateforme
            </Link>
          </div>
          <p className="text-white/40 text-sm mt-6">Aucun engagement · Aucune commission · Aucune carte de crédit</p>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-primary mb-4">Pourquoi choisir Bayt-Talib ?</h2>
          <p className="text-gray-400 font-light text-lg max-w-xl mx-auto">Une plateforme pensée pour simplifier la relation propriétaire-étudiant.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map((b) => (
            <div key={b.title} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-5">{b.icon}</div>
              <h3 className="font-black text-primary text-lg mb-2">{b.title}</h3>
              <p className="text-gray-400 font-light text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-gray-100 py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-primary mb-4">Comment ça marche</h2>
            <p className="text-gray-400 font-light text-lg">De la publication à la signature — en quelques clics.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center">
                <div className="w-16 h-16 clay-gradient rounded-[1.5rem] flex items-center justify-center text-white font-black text-xl mx-auto mb-5 shadow-lg">
                  {s.n}
                </div>
                <h3 className="font-black text-primary mb-2">{s.title}</h3>
                <p className="text-gray-400 font-light text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="bg-primary rounded-[3rem] p-12 text-center text-white">
          <h2 className="text-4xl font-black mb-4">Rejoignez des centaines de propriétaires</h2>
          <p className="text-white/70 font-light text-lg mb-8 max-w-xl mx-auto">
            Des propriétaires à Casablanca, Rabat, Fès et partout au Maroc font confiance à Bayt-Talib pour trouver leurs locataires.
          </p>
          <div className="flex justify-center gap-12 mb-10 flex-wrap">
            {[
              { value: "500+", label: "Annonces publiées" },
              { value: "2 000+", label: "Étudiants inscrits" },
              { value: "48h", label: "Délai de vérification moyen" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl font-black text-accent">{s.value}</div>
                <div className="text-white/50 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <Link href="/auth/signup" className="clay-gradient text-white px-12 py-4 rounded-2xl font-black text-lg shadow-2xl hover:scale-105 transition-all inline-block">
            Commencer gratuitement
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 pb-24">
        <h2 className="text-3xl font-black text-primary text-center mb-10">Questions fréquentes</h2>
        <div className="space-y-4">
          {FAQS.map((faq) => (
            <div key={faq.q} className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-7">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-primary mb-2">{faq.q}</h4>
                  <p className="text-gray-500 font-light text-sm leading-relaxed">{faq.r}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
