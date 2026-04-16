import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Server-side Cloudinary proxy — env vars are read at runtime, not baked into the bundle.
// Required Vercel env vars: CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET

const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEO = ["video/mp4", "video/quicktime", "video/webm"];
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;   // 10 MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;  // 100 MB

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const cloudName   = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    console.error("[upload] CLOUDINARY_CLOUD_NAME or CLOUDINARY_UPLOAD_PRESET is not set in env");
    return NextResponse.json(
      { error: "Configuration upload manquante. Contactez l'administrateur." },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file         = formData.get("file") as File | null;
  const resourceType = (formData.get("resourceType") as string | null) ?? "image";

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

  // Forward to Cloudinary using the unsigned upload preset
  const cldForm = new FormData();
  cldForm.append("file", file);
  cldForm.append("upload_preset", uploadPreset);
  cldForm.append("folder", "bayt-talib/listings");

  const cldRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    { method: "POST", body: cldForm }
  );

  const cldData = await cldRes.json();

  if (!cldRes.ok) {
    const msg: string = cldData?.error?.message ?? `Cloudinary error ${cldRes.status}`;
    console.error("[upload] Cloudinary rejected the upload:", cldRes.status, cldData);
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  return NextResponse.json({ url: cldData.secure_url as string });
}
