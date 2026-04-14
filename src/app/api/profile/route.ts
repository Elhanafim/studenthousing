import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { about: true, phone: true, image: true, email: true },
  });
  return NextResponse.json(user ?? {});
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const userId = (session.user as any).id as string;

  const body = await req.json();
  const { about, phone, email, image } = body;

  if (about && about.length > 300) {
    return NextResponse.json({ error: "La description ne peut dépasser 300 caractères." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      ...(about !== undefined && { about }),
      ...(phone !== undefined && { phone }),
      ...(email && { email }),
      ...(image !== undefined && { image }),
    },
  });

  return NextResponse.json({ success: true });
}
