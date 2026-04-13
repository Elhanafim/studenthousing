import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://student-housing-morocco.vercel.app";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl,                              lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${baseUrl}/search`,                  lastModified: new Date(), changeFrequency: "hourly",  priority: 0.9 },
    { url: `${baseUrl}/publish`,                 lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/how-it-works`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/help`,                    lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/guarantees`,              lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/legal/privacy`,           lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${baseUrl}/legal/terms`,             lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${baseUrl}/legal/cookies`,           lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${baseUrl}/legal/mentions-legales`,  lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${baseUrl}/legal/charte-hotes`,      lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];

  let listingRoutes: MetadataRoute.Sitemap = [];
  try {
    const listings = await prisma.listing.findMany({
      where: { isActive: true, isVerified: true },
      select: { id: true, updatedAt: true },
    });
    listingRoutes = listings.map((l) => ({
      url: `${baseUrl}/listings/${l.id}`,
      lastModified: l.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch {
    // DB might not be available at build time
  }

  return [...staticRoutes, ...listingRoutes];
}
