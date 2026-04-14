import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de cookies",
  description: "Politique de cookies de Bayt-Talib — quels cookies nous utilisons et pourquoi.",
};

export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">Politique de cookies</h1>
      <p className="text-gray-500 text-sm mb-10">Dernière mise à jour : 13 avril 2026</p>

      <div className="space-y-8 text-gray-700 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Qu&apos;est-ce qu&apos;un cookie ?</h2>
          <p>Un cookie est un petit fichier texte déposé sur votre navigateur lors de la visite d&apos;un site web. Il permet de mémoriser des informations entre vos visites.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Cookies essentiels</h2>
          <p className="mb-3">Ces cookies sont nécessaires au fonctionnement de la plateforme et ne peuvent pas être désactivés.</p>
          <div className="bg-gray-50 rounded-xl overflow-hidden ring-1 ring-gray-200">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Nom</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Finalité</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Durée</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 font-mono text-gray-600">next-auth.session-token</td>
                  <td className="px-4 py-3 text-gray-600">Session utilisateur (authentification)</td>
                  <td className="px-4 py-3 text-gray-600">7 jours</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-gray-600">next-auth.csrf-token</td>
                  <td className="px-4 py-3 text-gray-600">Protection CSRF</td>
                  <td className="px-4 py-3 text-gray-600">Session</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-gray-600">consent_preferences</td>
                  <td className="px-4 py-3 text-gray-600">Mémorisation de vos choix de cookies</td>
                  <td className="px-4 py-3 text-gray-600">365 jours</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Cookies analytiques (avec consentement)</h2>
          <p>Ces cookies nous aident à comprendre comment les visiteurs utilisent le site. Les données sont anonymisées et ne permettent pas de vous identifier personnellement. Ils ne sont chargés qu&apos;après votre consentement explicite.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Cookies marketing (avec consentement)</h2>
          <p>Ces cookies permettent d&apos;afficher des publicités pertinentes. Ils sont désactivés par défaut. Vous pouvez les accepter via notre bannière de consentement.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Gestion de vos préférences</h2>
          <p>Vous pouvez modifier vos préférences de cookies à tout moment en cliquant sur le lien &quot;Gérer mes cookies&quot; en bas de page, ou en effaçant les cookies de votre navigateur. Notez que la désactivation des cookies essentiels peut affecter le fonctionnement du site.</p>
        </section>
      </div>
    </div>
  );
}
