import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Charte des hôtes étudiants",
  description: "Règles et engagements des hôtes étudiants sur StudentHome.ma.",
};

export default function CharteHotesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">Charte des hôtes étudiants</h1>
      <p className="text-gray-500 text-sm mb-10">En vigueur depuis le 1er janvier 2026</p>

      <div className="bg-brand-50 rounded-2xl p-6 flex gap-4 mb-10 border border-brand-100">
        <ShieldCheck className="w-6 h-6 text-brand-600 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-gray-700">
          En tant qu&apos;hôte sur StudentHome.ma, vous vous engagez à respecter cette charte. Elle garantit un environnement sûr et de confiance pour l&apos;ensemble de la communauté étudiante.
        </p>
      </div>

      <div className="space-y-8 text-gray-700 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Honnêteté et transparence</h2>
          <ul className="list-disc ml-5 space-y-1">
            <li>Publier uniquement des logements qui vous appartiennent ou dont vous avez le droit de sous-louer</li>
            <li>Fournir des informations exactes : superficie, prix réel, équipements disponibles</li>
            <li>Utiliser des photos récentes et représentatives du logement</li>
            <li>Préciser clairement les conditions de location (durée, règles, charges)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Réactivité</h2>
          <ul className="list-disc ml-5 space-y-1">
            <li>Répondre aux demandes de candidature dans un délai de 48 heures</li>
            <li>Confirmer ou annuler les créneaux de visite au moins 24h à l&apos;avance</li>
            <li>Mettre à jour le statut de votre annonce en cas de location ou d&apos;indisponibilité</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Non-discrimination</h2>
          <p>Vous vous engagez à traiter toutes les candidatures de manière équitable, sans discrimination fondée sur le genre, l&apos;origine, la religion, la situation familiale ou tout autre critère protégé par la loi marocaine.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Sécurité du logement</h2>
          <ul className="list-disc ml-5 space-y-1">
            <li>S&apos;assurer que le logement est en bon état de fonctionnement</li>
            <li>Signaler tout problème de sécurité (électricité, plomberie) avant la mise en location</li>
            <li>Fournir les équipements de sécurité de base (serrure fonctionnelle, accès aux secours)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Légalité de la sous-location</h2>
          <p>Si vous êtes locataire et souhaitez sous-louer, vous devez avoir l&apos;accord écrit de votre propriétaire. StudentHome.ma se dégage de toute responsabilité en cas de sous-location non autorisée par le propriétaire principal.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Prix et paiement</h2>
          <ul className="list-disc ml-5 space-y-1">
            <li>Le loyer affiché doit correspondre au loyer réellement demandé</li>
            <li>Aucun frais d&apos;agence ni de dossier ne peut être réclamé au candidat</li>
            <li>StudentHome.ma ne gère pas les transactions financières — les paiements se font directement entre les parties</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Sanctions</h2>
          <p>Le non-respect de cette charte peut entraîner la suspension ou la suppression définitive du compte hôte, ainsi que le retrait de toutes les annonces publiées, sans préavis ni remboursement.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Signalement</h2>
          <p>
            Tout utilisateur peut signaler un hôte qui ne respecte pas cette charte via le bouton &quot;Signaler&quot; sur l&apos;annonce concernée, ou en contactant notre équipe à{" "}
            <a href="mailto:support@studenthome.ma" className="text-brand-600 hover:underline">support@studenthome.ma</a>.
          </p>
        </section>
      </div>

      <div className="mt-10 p-5 bg-surface rounded-xl border border-gray-200 text-center">
        <p className="text-sm text-gray-600 mb-3">Prêt à accueillir un étudiant dans votre logement ?</p>
        <Link href="/publish" className="inline-flex px-6 py-2.5 brand-gradient text-white text-sm font-semibold rounded-xl hover:shadow-md transition-shadow">
          Publier une annonce gratuitement
        </Link>
      </div>
    </div>
  );
}
