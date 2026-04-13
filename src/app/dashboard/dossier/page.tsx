import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DossierForm from "@/components/dashboard/DossierForm";
import { getDossierCompletionPercent } from "@/lib/utils/dossier";
import { FileText, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mon dossier | StudentHome.ma" };

export default async function DossierPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const userId = (session.user as any).id as string;

  const dossier = await prisma.applicationFile.findUnique({ where: { userId } });
  const percent = getDossierCompletionPercent(dossier);

  const initial = dossier
    ? {
        cinUrl: dossier.cinUrl ?? "",
        studentCardUrl: dossier.studentCardUrl ?? "",
        enrollmentUrl: dossier.enrollmentUrl ?? "",
        incomeProofUrl: dossier.incomeProofUrl ?? "",
        guarantorName: dossier.guarantorName ?? "",
        guarantorPhone: dossier.guarantorPhone ?? "",
        guarantorRelation: dossier.guarantorRelation ?? "",
        about: dossier.about ?? "",
        budget: dossier.budget ?? undefined,
        moveInDate: dossier.moveInDate ? dossier.moveInDate.toISOString().split("T")[0] : "",
        durationMonths: dossier.durationMonths ?? undefined,
      }
    : {};

  return (
    <div className="min-h-screen bg-[#FAFBFE]">

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-accent font-medium transition-colors mb-6 inline-block">
            ← Tableau de bord
          </Link>
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 clay-gradient rounded-2xl flex items-center justify-center text-white shadow">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-primary">Mon dossier de location</h1>
              <p className="text-gray-400 font-light mt-1">Constituez-le une fois, utilisez-le partout.</p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-primary">Complétude du dossier</span>
            <span className={`text-sm font-black ${percent >= 70 ? "text-green-600" : percent >= 40 ? "text-amber-600" : "text-red-500"}`}>
              {percent}%
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${percent >= 70 ? "bg-green-500" : percent >= 40 ? "bg-amber-500" : "bg-red-400"}`}
              style={{ width: `${percent}%` }}
            />
          </div>
          {percent >= 70 && (
            <div className="mt-3 flex items-center gap-2 text-green-700 text-sm font-medium">
              <ShieldCheck className="w-4 h-4" />
              Dossier solide — les propriétaires vous font confiance.
            </div>
          )}
          {percent < 70 && (
            <p className="mt-3 text-xs text-gray-400">
              Un dossier complet augmente vos chances d&apos;acceptation de 3×.
            </p>
          )}
        </div>

        <DossierForm initial={initial} />
      </div>
    </div>
  );
}
