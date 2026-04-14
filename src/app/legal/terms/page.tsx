import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description: "Conditions générales d'utilisation de la plateforme Bayt-Talib.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">Conditions générales d&apos;utilisation</h1>
      <p className="text-gray-500 text-sm mb-10">Dernière mise à jour : 13 avril 2026</p>

      <div className="space-y-8 text-gray-700 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Objet</h2>
          <p>Les présentes Conditions Générales d&apos;Utilisation régissent l&apos;accès et l&apos;utilisation de la plateforme Bayt-Talib, service gratuit de mise en relation entre étudiants chercheurs de logement et propriétaires ou étudiants-hôtes au Maroc.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Accès et inscription</h2>
          <p>L&apos;utilisation du service est gratuite. L&apos;inscription est ouverte à toute personne disposant d&apos;une adresse email valide. Vous êtes responsable de la confidentialité de vos identifiants. Vous devez avoir au moins 18 ans pour créer un compte.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Service gratuit</h2>
          <p>Bayt-Talib est entièrement gratuit pour les étudiants et les hôtes. La plateforme ne perçoit aucune commission sur les transactions. Aucun frais n&apos;est facturé pour la publication d&apos;annonces.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Obligations des utilisateurs</h2>
          <p>En utilisant Bayt-Talib, vous vous engagez à :</p>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>Fournir des informations exactes et à jour</li>
            <li>Ne pas publier de contenu illicite, trompeur ou offensant</li>
            <li>Respecter les autres utilisateurs</li>
            <li>Ne pas utiliser la plateforme à des fins commerciales non autorisées</li>
            <li>Signaler tout abus ou contenu inapproprié</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Annonces et contenu</h2>
          <p>Les annonces publiées doivent correspondre à des logements réels et disponibles. Bayt-Talib se réserve le droit de supprimer toute annonce ne respectant pas ces conditions. La plateforme n&apos;est pas partie aux contrats de location conclus entre les utilisateurs.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Responsabilité</h2>
          <p>Bayt-Talib met à disposition un outil de mise en relation. Nous ne pouvons être tenus responsables des transactions, accords ou litiges entre utilisateurs. Les descriptions des logements sont sous la responsabilité exclusive des hôtes.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Suspension de compte</h2>
          <p>Nous nous réservons le droit de suspendre ou de supprimer tout compte en cas de violation des présentes CGU, de comportement frauduleux ou de signalements répétés d&apos;autres utilisateurs.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Modification des CGU</h2>
          <p>Bayt-Talib peut modifier les présentes conditions à tout moment. Les utilisateurs seront notifiés par email des modifications importantes. L&apos;utilisation continue de la plateforme vaut acceptation des nouvelles conditions.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Droit applicable</h2>
          <p>Les présentes CGU sont soumises au droit marocain. En cas de litige, les tribunaux compétents de Casablanca seront seuls compétents.</p>
        </section>
      </div>
    </div>
  );
}
