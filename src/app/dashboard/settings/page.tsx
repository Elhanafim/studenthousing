import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Paramètres" };

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const userId = (session.user as any).id as string;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, phone: true, university: true, city: true },
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Paramètres du compte</h1>
        <p className="text-gray-600 text-sm mt-1">Gérez vos informations personnelles.</p>
      </div>

      <div className="bg-white rounded-2xl ring-1 ring-gray-200 p-6 space-y-5">
        {[
          { label: "Nom complet",   value: user?.name   ?? "—" },
          { label: "Email",         value: user?.email  ?? "—" },
          { label: "Téléphone",     value: user?.phone  ?? "Non renseigné" },
          { label: "Université",    value: user?.university ?? "Non renseignée" },
          { label: "Ville",         value: user?.city   ?? "Non renseignée" },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm font-medium text-gray-900">{value}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-6 text-center">
        Pour modifier vos informations, contactez{" "}
        <a href="mailto:support@studenthome.ma" className="text-brand-600 hover:underline">
          support@studenthome.ma
        </a>
      </p>
    </div>
  );
}
