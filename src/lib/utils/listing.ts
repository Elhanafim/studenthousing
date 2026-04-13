export function computeCompletionScore(listing: {
  title: string;
  description: string;
  images: { url: string }[];
  price: number;
  neighborhood: string;
  amenities: unknown;
  safetyFeatures: unknown;
  availableFrom: Date | null;
  minDuration: number;
  size: number | null;
}): number {
  let score = 0;

  if (listing.title.length >= 10) score += 10;
  if (listing.description.length >= 100) score += 10;
  if (listing.images.length >= 3) score += 20;
  else if (listing.images.length >= 1) score += 10;
  if (listing.price > 0) score += 10;
  if (listing.neighborhood.length >= 2) score += 10;
  if (Array.isArray(listing.amenities) && (listing.amenities as string[]).length >= 3) score += 10;
  if (Array.isArray(listing.safetyFeatures) && (listing.safetyFeatures as string[]).length >= 1) score += 10;
  if (listing.availableFrom) score += 10;
  if (listing.minDuration > 1) score += 5;
  if (listing.size && listing.size > 0) score += 5;

  return Math.min(score, 100);
}

export function completionLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Bon";
  if (score >= 40) return "Incomplet";
  return "À compléter";
}

export function completionColor(score: number): string {
  if (score >= 70) return "bg-green-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-red-400";
}
