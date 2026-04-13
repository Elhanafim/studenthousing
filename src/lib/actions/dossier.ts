"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const dossierSchema = z.object({
  cinUrl: z.string().url("URL invalide").optional().or(z.literal("")),
  studentCardUrl: z.string().url("URL invalide").optional().or(z.literal("")),
  enrollmentUrl: z.string().url("URL invalide").optional().or(z.literal("")),
  incomeProofUrl: z.string().url("URL invalide").optional().or(z.literal("")),
  guarantorName: z.string().max(100).optional(),
  guarantorPhone: z.string().max(20).optional(),
  guarantorRelation: z.string().max(50).optional(),
  about: z.string().max(1000).optional(),
  budget: z.number().min(0).max(50000).optional(),
  moveInDate: z.string().optional(),
  durationMonths: z.number().min(1).max(24).optional(),
});

export type DossierFormData = z.infer<typeof dossierSchema>;

function computeDossierCompleteness(data: DossierFormData): boolean {
  const score = [
    data.cinUrl,
    data.studentCardUrl || data.enrollmentUrl,
    data.guarantorName,
    data.about && data.about.length >= 50,
    data.budget,
    data.moveInDate,
  ].filter(Boolean).length;
  return score >= 4;
}

export async function upsertDossier(data: DossierFormData) {
  const session = await auth();
  if (!session?.user) return { error: "Non autorisé." };
  const userId = (session.user as any).id as string;

  try {
    const validated = dossierSchema.parse(data);
    const isComplete = computeDossierCompleteness(validated);

    const dossier = await prisma.applicationFile.upsert({
      where: { userId },
      update: {
        ...validated,
        budget: validated.budget ?? null,
        moveInDate: validated.moveInDate ? new Date(validated.moveInDate) : null,
        durationMonths: validated.durationMonths ?? null,
        isComplete,
      },
      create: {
        userId,
        ...validated,
        budget: validated.budget ?? null,
        moveInDate: validated.moveInDate ? new Date(validated.moveInDate) : null,
        durationMonths: validated.durationMonths ?? null,
        isComplete,
      },
    });

    revalidatePath("/dashboard/dossier");
    return { success: true, dossier, isComplete };
  } catch (error) {
    if (error instanceof z.ZodError) return { error: error.issues[0].message };
    return { error: "Impossible de sauvegarder le dossier." };
  }
}

export async function getDossier(userId: string) {
  return prisma.applicationFile.findUnique({ where: { userId } });
}
