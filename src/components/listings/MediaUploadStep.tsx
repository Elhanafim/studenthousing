"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Video, ImageIcon, AlertCircle } from "lucide-react";

interface MediaUploadStepProps {
  images: string[];
  videos: string[];
  onImagesChange: (urls: string[]) => void;
  onVideosChange: (urls: string[]) => void;
}

const MAX_IMAGES = 10;
const MAX_IMAGE_MB = 4;
const MAX_VIDEO_MB = 100;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

export default function MediaUploadStep({
  images, videos, onImagesChange, onVideosChange,
}: MediaUploadStepProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [imgUploading, setImgUploading] = useState(false);
  const [vidUploading, setVidUploading] = useState(false);
  const [imgError, setImgError] = useState("");
  const [vidError, setVidError] = useState("");
  const [dragOver, setDragOver] = useState<"image" | "video" | null>(null);

  /* ── Upload via server-side proxy (/api/upload → Cloudinary) ── */
  async function uploadFile(file: File, resourceType: "image" | "video"): Promise<string> {
    const body = new FormData();
    body.append("file", file);
    body.append("resourceType", resourceType);

    const res = await fetch("/api/upload", { method: "POST", body });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.error ?? `Erreur serveur (${res.status})`);
    }

    return data.url as string;
  }

  async function handleImageFiles(files: File[]) {
    setImgError("");
    const valid = files.filter((f) => {
      if (!ALLOWED_IMAGE_TYPES.includes(f.type)) {
        setImgError("Format non supporté. Utilisez JPG, PNG ou WebP.");
        return false;
      }
      if (f.size > MAX_IMAGE_MB * 1024 * 1024) {
        setImgError(`Taille max : ${MAX_IMAGE_MB} Mo par image.`);
        return false;
      }
      return true;
    });

    if (images.length + valid.length > MAX_IMAGES) {
      setImgError(`Maximum ${MAX_IMAGES} photos.`);
      return;
    }

    setImgUploading(true);
    try {
      const urls = await Promise.all(valid.map((f) => uploadFile(f, "image")));
      onImagesChange([...images, ...urls]);
    } catch (err: any) {
      setImgError(err?.message ?? "Erreur lors de l'upload. Réessayez.");
    } finally {
      setImgUploading(false);
    }
  }

  async function handleVideoFiles(files: File[]) {
    setVidError("");
    const file = files[0];
    if (!file) return;

    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      setVidError("Format non supporté. Utilisez MP4, MOV ou WebM.");
      return;
    }
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      setVidError(`Taille max : ${MAX_VIDEO_MB} Mo.`);
      return;
    }

    setVidUploading(true);
    try {
      const url = await uploadFile(file, "video");
      onVideosChange([...videos, url]);
    } catch (err: any) {
      setVidError(err?.message ?? "Erreur lors de l'upload. Réessayez.");
    } finally {
      setVidUploading(false);
    }
  }

  return (
    <div className="space-y-6">

      {/* ── Photos ───────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Photos <span className="text-danger">*</span>
          </label>
          <span className={`text-xs font-medium ${images.length >= 2 ? "text-accent-600" : "text-gray-500"}`}>
            {images.length}/{MAX_IMAGES} — min. 2 requises
          </span>
        </div>

        {/* Drop zone */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragOver === "image" ? "border-brand-400 bg-brand-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
          onClick={() => imageInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver("image"); }}
          onDragLeave={() => setDragOver(null)}
          onDrop={(e) => { e.preventDefault(); setDragOver(null); handleImageFiles(Array.from(e.dataTransfer.files)); }}
          role="button"
          aria-label="Ajouter des photos"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && imageInputRef.current?.click()}
        >
          {imgUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Upload en cours…</p>
            </div>
          ) : (
            <>
              <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-3" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-700">Glissez vos photos ici ou cliquez pour parcourir</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — max {MAX_IMAGE_MB} Mo chacune</p>
            </>
          )}
        </div>

        <input
          ref={imageInputRef}
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          multiple
          className="hidden"
          onChange={(e) => handleImageFiles(Array.from(e.target.files ?? []))}
        />

        {imgError && (
          <div className="flex items-center gap-2 mt-2 text-xs text-danger">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {imgError}
          </div>
        )}

        {/* Image grid preview */}
        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-3">
            {images.map((url, i) => (
              <div key={url} className="relative group rounded-xl overflow-hidden aspect-square bg-gray-100 ring-1 ring-gray-200">
                <Image src={url} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="120px" />
                <button
                  type="button"
                  onClick={() => onImagesChange(images.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 w-6 h-6 bg-gray-900/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Supprimer la photo ${i + 1}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-white/90 text-gray-700 px-1.5 py-0.5 rounded">
                    Principale
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Video ────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Vidéo <span className="text-danger">*</span>
          </label>
          <span className={`text-xs font-medium ${videos.length >= 1 ? "text-accent-600" : "text-gray-500"}`}>
            {videos.length}/3 — min. 1 requise
          </span>
        </div>

        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragOver === "video" ? "border-brand-400 bg-brand-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
          onClick={() => videoInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver("video"); }}
          onDragLeave={() => setDragOver(null)}
          onDrop={(e) => { e.preventDefault(); setDragOver(null); handleVideoFiles(Array.from(e.dataTransfer.files)); }}
          role="button"
          aria-label="Ajouter une vidéo"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && videoInputRef.current?.click()}
        >
          {vidUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Upload en cours…</p>
            </div>
          ) : (
            <>
              <Video className="w-8 h-8 text-gray-300 mx-auto mb-3" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-700">Glissez votre vidéo ici ou cliquez pour parcourir</p>
              <p className="text-xs text-gray-400 mt-1">MP4, MOV, WebM — max {MAX_VIDEO_MB} Mo, max 3 min</p>
            </>
          )}
        </div>

        <input
          ref={videoInputRef}
          type="file"
          accept={ALLOWED_VIDEO_TYPES.join(",")}
          className="hidden"
          onChange={(e) => handleVideoFiles(Array.from(e.target.files ?? []))}
        />

        {vidError && (
          <div className="flex items-center gap-2 mt-2 text-xs text-danger">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {vidError}
          </div>
        )}

        {/* Video previews */}
        {videos.length > 0 && (
          <div className="mt-3 space-y-2">
            {videos.map((url, i) => (
              <div key={url} className="relative rounded-xl overflow-hidden bg-black ring-1 ring-gray-200">
                <video src={url} controls className="w-full max-h-64 rounded-xl" />
                <button
                  type="button"
                  onClick={() => onVideosChange(videos.filter((_, idx) => idx !== i))}
                  className="absolute top-2 right-2 w-7 h-7 bg-gray-900/70 text-white rounded-full flex items-center justify-center hover:bg-gray-900/90"
                  aria-label={`Supprimer la vidéo ${i + 1}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Requirements summary */}
      <div className="bg-surface rounded-xl p-4 flex items-start gap-3">
        <Upload className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" aria-hidden="true" />
        <div className="text-xs text-gray-600 space-y-0.5">
          <p><strong className={images.length >= 2 ? "text-accent-600" : "text-gray-700"}>Photos :</strong> {images.length >= 2 ? "✓ Condition remplie" : `${2 - images.length} photo(s) manquante(s)`}</p>
          <p><strong className={videos.length >= 1 ? "text-accent-600" : "text-gray-700"}>Vidéo :</strong> {videos.length >= 1 ? "✓ Condition remplie" : "1 vidéo manquante"}</p>
        </div>
      </div>
    </div>
  );
}
