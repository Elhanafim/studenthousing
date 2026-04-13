import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales de StudentHome.ma conformément au droit marocain.",
};

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">Mentions légales</h1>
      <p className="text-gray-500 text-sm mb-10">Conformément aux dispositions légales marocaines</p>

      <div className="space-y-8 text-gray-700 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Éditeur du site</h2>
          <ul className="space-y-1">
            <li><strong>Nom de la société :</strong> StudentHome.ma SARL</li>
            <li><strong>Siège social :</strong> Casablanca, Maroc</li>
            <li><strong>Email :</strong> <a href="mailto:legal@studenthome.ma" className="text-brand-600 hover:underline">legal@studenthome.ma</a></li>
            <li><strong>Téléphone :</strong> +212 522 00 00 00</li>
            <li><strong>Registre de commerce :</strong> RC Casablanca — à compléter</li>
            <li><strong>Identifiant fiscal :</strong> IF — à compléter</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Directeur de la publication</h2>
          <p>Le Directeur Général de StudentHome.ma SARL.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Hébergement</h2>
          <ul className="space-y-1">
            <li><strong>Hébergeur principal :</strong> Vercel Inc.</li>
            <li><strong>Adresse :</strong> 340 Pine Street, Suite 900, San Francisco, CA 94104, USA</li>
            <li><strong>Site :</strong> <a href="https://vercel.com" className="text-brand-600 hover:underline" target="_blank" rel="noopener noreferrer">vercel.com</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Propriété intellectuelle</h2>
          <p>L&apos;ensemble du contenu de StudentHome.ma (textes, images, logo, charte graphique, code source) est protégé par le droit d&apos;auteur marocain. Toute reproduction, totale ou partielle, sans autorisation préalable est strictement interdite.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Données personnelles</h2>
          <p>
            Conformément à la loi n° 09-08 relative à la protection des personnes physiques à l&apos;égard du traitement des données à caractère personnel, la plateforme a effectué les déclarations nécessaires auprès de la Commission Nationale de contrôle de la protection des Données à caractère Personnel (CNDP). Consultez notre{" "}
            <a href="/legal/privacy" className="text-brand-600 hover:underline">politique de confidentialité</a> pour plus d&apos;informations.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Limitation de responsabilité</h2>
          <p>StudentHome.ma est une plateforme de mise en relation. Elle ne saurait être tenue responsable des contenus publiés par les utilisateurs, ni des accords conclus entre parties. Toute transaction est sous la responsabilité exclusive des parties concernées.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Liens hypertextes</h2>
          <p>Le site peut contenir des liens vers des sites tiers. StudentHome.ma n&apos;est pas responsable du contenu de ces sites et ne peut être tenu pour responsable des dommages résultant de leur utilisation.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Droit applicable</h2>
          <p>Les présentes mentions légales sont soumises au droit marocain. En cas de litige, les tribunaux de Casablanca sont seuls compétents.</p>
        </section>
      </div>
    </div>
  );
}
