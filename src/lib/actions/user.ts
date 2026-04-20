"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

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
        emailVerified: new Date(),
      },
    });

    console.log(`[signup] Registration complete for ${user.email}`);
    return { success: true, userId: user.id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: "Une erreur est survenue. Réessayez." };
  }
}
