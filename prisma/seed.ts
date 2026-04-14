import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

console.log("🌱 Starting database seed...");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Demo listings have been removed — seed now only creates the demo host account.
  // The listings were deleted as part of the production cleanup (FIX 3).

  const hashedPassword = await bcrypt.hash("password123", 12);

  await prisma.user.upsert({
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

  /* ── DEMO LISTINGS REMOVED ────────────────────────────────────────────────
   * The two example listings ("L'Escale Residence" and "Les Arcades du Savoir")
   * were seeded during development. They are intentionally disabled here so
   * the listings page starts empty in production.
   * To re-enable them for local testing, uncomment the block below.
   *
   * const listings = [ ... ];
   * for (const listing of listings) { await prisma.listing.create({ data: listing }); }
   * ─────────────────────────────────────────────────────────────────────── */

  console.log("Seed completed (no demo listings created).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
