import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  if (user.emailVerified) return NextResponse.json({ error: "Email déjà vérifié" }, { status: 400 });

  // Delete existing tokens for this email
  await prisma.verificationToken.deleteMany({ where: { email } });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  await prisma.verificationToken.create({ data: { token, email, expiresAt } });

  try {
    await sendVerificationEmail(email, token);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email send error:", err);
    return NextResponse.json({ error: "Impossible d'envoyer l'email. Réessayez plus tard." }, { status: 500 });
  }
}
