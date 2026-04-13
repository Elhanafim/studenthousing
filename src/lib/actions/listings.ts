"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@/lib/auth";

const listingSchema = z.object({
  title: z.string().min(5, "Le titre doit comporter au moins 5 caractères"),
  description: z.string().min(20, "La description doit comporter au moins 20 caractères"),
  type: z.enum(["ROOM", "STUDIO", "APARTMENT", "COLIVING", "HOMESTAY"]),
  city: z.string().min(2, "La ville est requise"),
  neighborhood: z.string().min(2, "Le quartier est requis"),
  address: z.string().min(5, "L'adresse est requise"),
  price: z.number().min(1, "Le loyer est requis"),
  size: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  isFurnished: z.boolean().default(true),
  amenities: z.array(z.string()).optional(),
  safetyFeatures: z.array(z.string()).optional(),
  houseRules: z.array(z.string()).optional(),
  images: z.array(z.string()).min(1, "Au moins une image est requise"),
  availableFrom: z.string().optional(),
  minDuration: z.number().min(1).default(1),
});

export async function createListing(data: z.infer<typeof listingSchema>) {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Non autorisé. Veuillez vous connecter." };

    const hostId = (session.user as any).id as string;
    if (!hostId) return { error: "Session invalide. Veuillez vous reconnecter." };

    const validatedData = listingSchema.parse(data);

    const listing = await prisma.listing.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        type: validatedData.type,
        city: validatedData.city,
        neighborhood: validatedData.neighborhood,
        address: validatedData.address,
        price: validatedData.price,
        size: validatedData.size,
        bedrooms: validatedData.bedrooms,
        bathrooms: validatedData.bathrooms,
        isFurnished: validatedData.isFurnished,
        amenities: validatedData.amenities ?? [],
        safetyFeatures: validatedData.safetyFeatures ?? [],
        houseRules: validatedData.houseRules ?? [],
        availableFrom: validatedData.availableFrom ? new Date(validatedData.availableFrom) : null,
        minDuration: validatedData.minDuration,
        hostId,
        images: { create: validatedData.images.map((url) => ({ url })) },
      },
    });

    return { success: true, listingId: listing.id };
  } catch (error) {
    console.error("Listing creation error:", error);
    if (error instanceof z.ZodError) return { error: error.issues[0].message };
    return { error: "Impossible de créer l'annonce. Réessayez." };
  }
}

export async function deleteListingById(listingId: string) {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Non autorisé." };

    const hostId = (session.user as any).id as string;
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) return { error: "Annonce introuvable." };
    if (listing.hostId !== hostId) return { error: "Vous n'êtes pas propriétaire de cette annonce." };

    await prisma.listing.delete({ where: { id: listingId } });
    return { success: true };
  } catch {
    return { error: "Impossible de supprimer l'annonce." };
  }
}
