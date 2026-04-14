"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";

const registerSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit comporter au moins 8 caractères"),
  role: z.enum(["STUDENT", "HOST"]),
  phone: z.string().optional(),
  university: z.string().optional(),
  profession: z.string().optional(),
  safetyAnswers: z.any().optional(),
});

export async function registerUser(formData: z.infer<typeof registerSchema>) {
  try {
    const validatedData = registerSchema.parse(formData);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return { error: "Un compte existe déjà avec cet email." };
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
        phone: validatedData.phone,
        university: validatedData.university,
        profession: validatedData.profession,
        safetyAnswers: validatedData.safetyAnswers,
        // emailVerified intentionally null — must verify first
      },
    });

    // Create verification token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await prisma.verificationToken.create({
      data: { token, email: user.email!, expiresAt },
    });

    // Send verification email (non-blocking — if Resend not configured, registration still succeeds)
    try {
      await sendVerificationEmail(user.email!, token, user.name ?? undefined);
    } catch (err) {
      console.error("Failed to send verification email:", err);
    }

    return { success: true, userId: user.id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: "Une erreur est survenue. Réessayez." };
  }
}
