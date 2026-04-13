export function getDossierCompletionPercent(dossier: {
  cinUrl?: string | null;
  studentCardUrl?: string | null;
  enrollmentUrl?: string | null;
  incomeProofUrl?: string | null;
  guarantorName?: string | null;
  about?: string | null;
  budget?: number | null;
  moveInDate?: Date | null;
} | null): number {
  if (!dossier) return 0;
  const checks = [
    !!dossier.cinUrl,
    !!(dossier.studentCardUrl || dossier.enrollmentUrl),
    !!dossier.incomeProofUrl,
    !!dossier.guarantorName,
    !!(dossier.about && dossier.about.length >= 50),
    !!dossier.budget,
    !!dossier.moveInDate,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}
