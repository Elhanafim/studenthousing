import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin?error=invalid_token", req.url));
  }

  const record = await prisma.verificationToken.findUnique({ where: { token } });

  if (!record) {
    return NextResponse.redirect(new URL("/auth/signin?error=invalid_token", req.url));
  }

  if (record.expiresAt < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return NextResponse.redirect(new URL("/auth/signin?error=token_expired", req.url));
  }

  await prisma.user.update({
    where: { email: record.email },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({ where: { token } });

  return NextResponse.redirect(new URL("/auth/signin?verified=1", req.url));
}
