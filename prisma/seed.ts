import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not defined in the environment!");
  process.exit(1);
}

console.log("🌱 Starting database seed...");
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 12);

  const user = await prisma.user.upsert({
    where: { email: "ahmed.k@studenthome.ma" },
    update: {},
    create: {
      email: "ahmed.k@studenthome.ma",
      name: "Ahmed K.",
      password: hashedPassword,
      role: "HOST",
      isVerified: true,
    },
  });

  const listings = [
    {
      title: "L'Escale Residence - Modern Studio",
      description: "Located in the heart of Maarif, this modern studio is designed specifically for students seeking a quiet and secure environment.",
      type: "STUDIO",
      city: "Casablanca",
      neighborhood: "Maarif",
      address: "15 Rue de la Liberté",
      price: 4500,
      size: 35,
      bedrooms: 1,
      bathrooms: 1,
      isFurnished: true,
      amenities: ["Fiber Internet", "Gym", "Security 24/7"],
      safetyFeatures: ["Security Cameras", "Double Lock", "Outdoor Lighting"],
      houseRules: ["No Smoking", "Quiet after 10PM"],
      hostId: user.id,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070", isMain: true },
        ],
      },
    },
    {
      title: "Les Arcades du Savoir",
      description: "Premium shared apartment near UM6P Rabat. Includes library and rooftop access.",
      type: "ROOM",
      city: "Rabat",
      neighborhood: "Agdal",
      address: "42 Avenue Mohammed V",
      price: 5200,
      size: 120,
      bedrooms: 3,
      bathrooms: 2,
      isFurnished: true,
      amenities: ["Library", "Rooftop", "Cleaning"],
      safetyFeatures: ["Emergency Exit", "Fire Alarm"],
      houseRules: ["Female only", "No pets"],
      hostId: user.id,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070", isMain: true },
        ],
      },
    },
  ];

  for (const listing of listings) {
    await prisma.listing.create({
      data: listing,
    });
  }

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
