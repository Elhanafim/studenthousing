import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import PublishWizard from "@/components/listings/PublishWizard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publier une annonce",
  description: "Publiez votre annonce de logement étudiant gratuitement au Maroc.",
};

export default async function PublishPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin?callbackUrl=/publish");

  return (
    <div className="min-h-screen bg-surface py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <span className="inline-block bg-accent-100 text-accent-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            100% Gratuit
          </span>
          <h1 className="text-3xl font-semibold text-gray-900">Publier une annonce</h1>
          <p className="text-gray-600 mt-2 text-sm">
            Votre annonce sera visible par des milliers d&apos;étudiants au Maroc.
          </p>
        </div>
        <PublishWizard />
      </div>
    </div>
  );
}
