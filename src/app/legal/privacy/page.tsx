import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité de StudentHome.ma — comment nous collectons et protégeons vos données.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">Politique de confidentialité</h1>
      <p className="text-gray-500 text-sm mb-10">Dernière mise à jour : 13 avril 2026</p>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Responsable du traitement</h2>
          <p>
            StudentHome.ma, plateforme opérée depuis Casablanca, Maroc, est responsable du traitement des données
            personnelles collectées via ce site. Contact : <a href="mailto:privacy@studenthome.ma" className="text-brand-600 hover:underline">privacy@studenthome.ma</a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Données collectées</h2>
          <p>Nous collectons les données suivantes :</p>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>Informations d&apos;identification (nom, prénom, email, téléphone)</li>
            <li>Documents d&apos;identité et justificatifs de scolarité (facultatifs, pour la vérification)</li>
            <li>Informations de profil (université, ville, niveau d&apos;études)</li>
            <li>Contenu des annonces et des messages</li>
            <li>Données de navigation (adresse IP, cookies, pages visitées)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Finalités du traitement</h2>
          <p>Vos données sont traitées pour :</p>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>La création et la gestion de votre compte</li>
            <li>La mise en relation entre étudiants et propriétaires</li>
            <li>La vérification de l&apos;identité et la sécurité de la plateforme</li>
            <li>L&apos;envoi de notifications relatives à votre activité</li>
            <li>L&apos;amélioration de nos services (avec votre consentement)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Base légale</h2>
          <p>Le traitement est fondé sur votre consentement explicite lors de l&apos;inscription, ou sur l&apos;exécution du contrat de service entre vous et StudentHome.ma.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Conservation des données</h2>
          <p>Vos données sont conservées pendant la durée de votre compte actif, plus une période de 3 ans après sa fermeture, conformément aux obligations légales marocaines.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Vos droits</h2>
          <p>Conformément à la loi 09-08 relative à la protection des personnes physiques à l&apos;égard du traitement des données à caractère personnel, vous disposez des droits suivants :</p>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>Droit d&apos;accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l&apos;effacement (droit à l&apos;oubli)</li>
            <li>Droit d&apos;opposition au traitement</li>
            <li>Droit à la portabilité de vos données</li>
          </ul>
          <p className="mt-3">Pour exercer ces droits : <a href="mailto:privacy@studenthome.ma" className="text-brand-600 hover:underline">privacy@studenthome.ma</a></p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Partage avec des tiers</h2>
          <p>Nous ne vendons jamais vos données. Elles peuvent être partagées uniquement avec nos prestataires techniques (hébergement, envoi d&apos;emails) dans le cadre strict de la fourniture du service.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Sécurité</h2>
          <p>Nous mettons en œuvre des mesures techniques appropriées (chiffrement, accès restreint, audit régulier) pour protéger vos données contre tout accès non autorisé.</p>
        </section>
      </div>
    </div>
  );
}
