/**
 * One-time script: delete demo/test listings from the database.
 *
 * Deletes any listing whose title contains "test", "demo", "exemple", or "annonce",
 * OR whose host email is the development seed account (ahmed.k@studenthome.ma).
 *
 * Usage:
 *   npx tsx --env-file=.env scripts/deleteDemoListings.js
 *   — OR —
 *   node --require dotenv/config scripts/deleteDemoListings.js
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DEMO_EMAILS = ["ahmed.k@studenthome.ma"];
const DEMO_KEYWORDS = ["test", "demo", "exemple", "annonce"];

async function main() {
  console.log("🔍 Searching for demo listings...\n");

  // Find host IDs for known demo accounts
  const demoHosts = await prisma.user.findMany({
    where: { email: { in: DEMO_EMAILS } },
    select: { id: true, email: true },
  });

  const demoHostIds = demoHosts.map((h) => h.id);
  if (demoHosts.length > 0) {
    console.log(`Found demo host accounts: ${demoHosts.map((h) => h.email).join(", ")}`);
  }

  // Find listings by host or by keyword in title
  const candidates = await prisma.listing.findMany({
    where: {
      OR: [
        ...(demoHostIds.length > 0 ? [{ hostId: { in: demoHostIds } }] : []),
        ...DEMO_KEYWORDS.map((kw) => ({
          title: { contains: kw, mode: "insensitive" },
        })),
      ],
    },
    select: { id: true, title: true, city: true, host: { select: { email: true } } },
  });

  if (candidates.length === 0) {
    console.log("✅ No demo listings found. The database is already clean.");
    return;
  }

  console.log(`\nFound ${candidates.length} demo listing(s) to delete:`);
  for (const l of candidates) {
    console.log(`  • [${l.id}] "${l.title}" — ${l.city} (host: ${l.host.email})`);
  }

  const ids = candidates.map((l) => l.id);
  const deleted = await prisma.listing.deleteMany({ where: { id: { in: ids } } });

  console.log(`\n🗑  Deleted ${deleted.count} listing(s).`);
  console.log("✅ Done. The listings page should now be empty.");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
