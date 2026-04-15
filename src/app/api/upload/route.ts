import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// NOTE: This writes to /public/uploads/ which works in local dev.
// For Vercel or any serverless deployment, replace with Cloudinary/S3:
// set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_SECRET in .env

const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEO = ["video/mp4", "video/quicktime", "video/webm"];
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;  // 10 MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 MB

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
  }

  const isImage = ALLOWED_IMAGE.includes(file.type);
  const isVideo = ALLOWED_VIDEO.includes(file.type);

  if (!isImage && !isVideo) {
    return NextResponse.json(
      { error: "Format non supporté. Utilisez JPG, PNG, WebP, MP4, MOV ou WebM." },
      { status: 400 }
    );
  }

  const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxBytes) {
    const limit = isVideo ? "100 Mo" : "10 Mo";
    return NextResponse.json(
      { error: `Fichier trop volumineux. Limite : ${limit}.` },
      { status: 400 }
    );
  }

  // Build a safe filename
  const originalExt = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const safeExt = originalExt.replace(/[^a-z0-9]/g, "");
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${safeExt}`;

  const uploadDir = join(process.cwd(), "public", "uploads", "listings");
  await mkdir(uploadDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  await writeFile(join(uploadDir, filename), Buffer.from(bytes));

  return NextResponse.json({ url: `/uploads/listings/${filename}` });
}
