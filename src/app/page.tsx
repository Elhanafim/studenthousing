import { prisma } from "@/lib/prisma";
import HomeClient from "@/components/home/HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const listings = await prisma.listing.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: {
      images: true,
      host: true,
    },
  });

  return <HomeClient listings={listings} />;
}
