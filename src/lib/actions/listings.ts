"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@/lib/auth"; // We'll need to update auth.ts to export this

const listingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  type: z.enum(["ROOM", "STUDIO", "APARTMENT", "COLIVING"]),
  city: z.string().min(2, "City is required"),
  neighborhood: z.string().min(2, "Neighborhood is required"),
  address: z.string().min(5, "Address is required"),
  price: z.number().min(0),
  size: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  isFurnished: z.boolean().default(true),
  amenities: z.array(z.string()).optional(),
  safetyFeatures: z.array(z.string()).optional(),
  houseRules: z.any().optional(),
  images: z.array(z.string()).min(1, "At least one image is required"),
});

export async function createListing(data: z.infer<typeof listingSchema>) {
  try {
    // In a real app, we'd get the session here
    // const session = await auth();
    // if (!session?.user) return { error: "Unauthorized" };
    
    // For now, let's assume we have a hostId (we can pass it or hardcode for testing)
    // In production, we'd use session.user.id
    
    const validatedData = listingSchema.parse(data);

    // Mock hostId until auth is fully wired
    const host = await prisma.user.findFirst({ where: { role: "HOST" } });
    if (!host) return { error: "No host found to assign listing" };

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
        amenities: validatedData.amenities,
        safetyFeatures: validatedData.safetyFeatures,
        houseRules: validatedData.houseRules,
        hostId: host.id,
        images: {
          create: validatedData.images.map(url => ({ url }))
        }
      },
    });

    return { success: true, listingId: listing.id };
  } catch (error) {
    console.error("Listing creation error:", error);
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Failed to create listing" };
  }
}
