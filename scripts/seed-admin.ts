/**
 * Seed the admin user.
 * Usage: npx tsx scripts/seed-admin.ts
 *
 * Make sure your .env is set with ADMIN_EMAIL, ADMIN_PASSWORD, and DATABASE_URL.
 */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "mohamed345el@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Elhanafi2005@";

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });

  if (existing) {
    // Update role to ADMIN and mark verified
    await prisma.user.update({
      where: { email: ADMIN_EMAIL },
      data: { role: "ADMIN", emailVerified: new Date(), isVerified: true },
    });
    console.log(`✅ Existing user ${ADMIN_EMAIL} promoted to ADMIN.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await prisma.user.create({
    data: {
      name: "EL HANAFI MOHAMMED",
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "ADMIN",
      emailVerified: new Date(),
      isVerified: true,
    },
  });

  console.log(`✅ Admin user created: ${ADMIN_EMAIL}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
