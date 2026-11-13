import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Required env vars: CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET
// Recommended: CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET. When both are set,
// uploads are signed; then switch the preset's Signing Mode to "Signed" in
// console.cloudinary.com → Settings → Upload → Upload presets, so nobody can
// upload to the account directly with the (public) cloud name and preset name.

const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEO = ["video/mp4", "video/quicktime", "video/webm"];
// Vercel serverless functions have a 4.5 MB request body limit — keep images below that.
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;    // 4 MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;  // 100 MB

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const cloudName    = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    console.error("[upload] Missing CLOUDINARY_CLOUD_NAME or CLOUDINARY_UPLOAD_PRESET env vars");
    return NextResponse.json(
      { error: "Configuration upload manquante. Ajoutez CLOUDINARY_CLOUD_NAME et CLOUDINARY_UPLOAD_PRESET dans vos variables d'environnement Vercel." },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Impossible de lire le fichier envoyé." }, { status: 400 });
  }

  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Aucun fichier fourni." }, { status: 400 });
  }

  const isImage = ALLOWED_IMAGE.includes(file.type);
  const isVideo = ALLOWED_VIDEO.includes(file.type);

  if (!isImage && !isVideo) {
    return NextResponse.json(
      { error: "Format non supporté. Utilisez JPG, PNG, WebP, MP4, MOV ou WebM." },
      { status: 400 }
    );
  }

  // Derived from the validated MIME type, never from client input: a client-chosen
  // value could request "raw" uploads of arbitrary files or alter the API path.
  const resourceType = isVideo ? "video" : "image";

  const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxBytes) {
    const limit = isVideo ? "100 Mo" : "4 Mo";
    return NextResponse.json(
      { error: `Fichier trop volumineux. Limite : ${limit}.` },
      { status: 400 }
    );
  }

  const folder = "bayt-talib/listings";
  const cldForm = new FormData();
  cldForm.append("file", file);
  cldForm.append("upload_preset", uploadPreset);
  cldForm.append("folder", folder);

  const apiKey    = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (apiKey && apiSecret) {
    // Cloudinary signature: SHA-1 of the signed params (sorted, "&"-joined) + API secret.
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const toSign = `folder=${folder}&timestamp=${timestamp}&upload_preset=${uploadPreset}`;
    cldForm.append("api_key", apiKey);
    cldForm.append("timestamp", timestamp);
    cldForm.append("signature", createHash("sha1").update(toSign + apiSecret).digest("hex"));
  }

  let cldRes: Response;
  try {
    cldRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      { method: "POST", body: cldForm }
    );
  } catch (err) {
    console.error("[upload] Cloudinary fetch failed:", err);
    return NextResponse.json({ error: "Impossible de joindre Cloudinary. Réessayez." }, { status: 502 });
  }

  const cldData = await cldRes.json();

  if (!cldRes.ok) {
    const msg: string = cldData?.error?.message ?? `Cloudinary error ${cldRes.status}`;
    console.error("[upload] Cloudinary rejected the upload:", cldRes.status, JSON.stringify(cldData));
    // Common cause: preset signing mode does not match the configured credentials
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  return NextResponse.json({ url: cldData.secure_url as string });
}
