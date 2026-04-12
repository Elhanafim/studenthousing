"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteListingById } from "@/lib/actions/listings";
import { useRouter } from "next/navigation";

export default function DeleteListingButton({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await deleteListingById(listingId);
    setLoading(false);
    setConfirmOpen(false);
    router.refresh();
  };

  if (confirmOpen) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Confirmer ?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs text-red-500 font-bold hover:underline disabled:opacity-50"
        >
          {loading ? "..." : "Supprimer"}
        </button>
        <button
          onClick={() => setConfirmOpen(false)}
          className="text-xs text-gray-400 hover:underline"
        >
          Annuler
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirmOpen(true)}
      className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
    >
      <Trash2 className="w-3.5 h-3.5" /> Supprimer
    </button>
  );
}
