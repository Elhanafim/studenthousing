"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, Send, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { createBookingRequest } from "@/lib/actions/bookings";
import { BookingStatus } from "@prisma/client";

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; description: string }> = {
  INQUIRY: {
    label: "Demande envoyée",
    color: "bg-blue-100 text-blue-700",
    description: "Votre demande a été transmise à l'hôte.",
  },
  APPLICATION_SENT: {
    label: "Dossier soumis",
    color: "bg-indigo-100 text-indigo-700",
    description: "Votre dossier a été envoyé à l'hôte.",
  },
  PENDING_HOST_REVIEW: {
    label: "En cours d'examen",
    color: "bg-amber-100 text-amber-700",
    description: "L'hôte examine votre candidature.",
  },
  ACCEPTED: {
    label: "Acceptée !",
    color: "bg-green-100 text-green-700",
    description: "Félicitations ! Votre demande a été acceptée.",
  },
  REJECTED: {
    label: "Refusée",
    color: "bg-red-100 text-red-700",
    description: "Votre demande a été refusée. Vous pouvez contacter l'hôte ou chercher d'autres logements.",
  },
  BOOKED: {
    label: "Réservé !",
    color: "bg-emerald-100 text-emerald-700",
    description: "Ce logement vous est réservé. Bon emménagement !",
  },
};

interface BookingPanelProps {
  listingId: string;
  hostId: string;
  price: number;
  currentUser: { id: string; role: string } | null;
  existingBooking: { status: BookingStatus; id: string } | null;
  hasDossier: boolean;
}

export default function BookingPanel({
  listingId,
  hostId,
  price,
  currentUser,
  existingBooking,
  hasDossier,
}: BookingPanelProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [duration, setDuration] = useState(3);

  const isStudent = currentUser?.role === "STUDENT";
  const isOwner = currentUser?.id === hostId;

  async function handleRequest() {
    if (!currentUser) {
      router.push("/auth/signin");
      return;
    }
    setLoading(true);
    setError("");
    const result = await createBookingRequest({
      listingId,
      moveInDate: moveInDate || undefined,
      durationMonths: duration,
      tenantNote: note || undefined,
    });
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.refresh();
    }
  }

  // If owner viewing their own listing
  if (isOwner) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
        <p className="text-amber-700 font-medium text-sm">
          Ceci est votre annonce.
        </p>
      </div>
    );
  }

  // Active booking exists
  if (existingBooking && existingBooking.status !== "REJECTED") {
    const config = STATUS_CONFIG[existingBooking.status];
    return (
      <div className={`rounded-2xl p-5 border ${config.color} border-current/20`}>
        <div className="flex items-center gap-2 mb-2">
          {existingBooking.status === "ACCEPTED" || existingBooking.status === "BOOKED" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <Clock className="w-5 h-5" />
          )}
          <span className="font-black text-sm">{config.label}</span>
        </div>
        <p className="text-sm font-light">{config.description}</p>
        <Link
          href="/dashboard/bookings"
          className="mt-3 inline-block text-xs font-bold underline underline-offset-2"
        >
          Voir mes demandes →
        </Link>
      </div>
    );
  }

  // Not logged in
  if (!currentUser) {
    return (
      <div className="space-y-3">
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm mb-4">
            Connectez-vous pour contacter l&apos;hôte et envoyer une demande.
          </p>
          <Link
            href="/auth/signin"
            className="clay-gradient text-white px-8 py-3 rounded-2xl font-bold inline-block shadow w-full text-center text-sm"
          >
            Se connecter
          </Link>
          <Link
            href="/auth/signup"
            className="mt-2 block text-center text-sm text-accent font-bold hover:underline"
          >
            Créer un compte gratuitement
          </Link>
        </div>
      </div>
    );
  }

  // HOST role — no booking
  if (!isStudent) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-center">
        <p className="text-gray-500 font-medium text-sm">
          Seuls les étudiants peuvent envoyer des demandes.
        </p>
      </div>
    );
  }

  // Student — show booking form
  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      {!hasDossier && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
          <p className="text-amber-800 font-medium mb-1">💡 Conseil</p>
          <p className="text-amber-700 font-light">
            Créez votre{" "}
            <Link href="/dashboard/dossier" className="font-bold underline">
              dossier de location
            </Link>{" "}
            pour booster votre candidature.
          </p>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">
            Date d&apos;entrée souhaitée
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={moveInDate}
              onChange={(e) => setMoveInDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:ring-2 focus:ring-accent/20 outline-none font-medium"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">
            Durée souhaitée
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:ring-2 focus:ring-accent/20 outline-none font-medium"
          >
            {[1, 2, 3, 4, 6, 9, 12, 18, 24].map((m) => (
              <option key={m} value={m}>
                {m} mois{m > 1 ? "" : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">
            Message à l&apos;hôte (optionnel)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Présentez-vous brièvement : université, formation, disponibilités…"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:ring-2 focus:ring-accent/20 outline-none font-medium resize-none"
          />
        </div>
      </div>

      <button
        onClick={handleRequest}
        disabled={loading}
        className="w-full clay-gradient text-white py-4 rounded-2xl font-black text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        {loading ? "Envoi en cours…" : "Envoyer une demande"}
      </button>

      <p className="text-center text-[11px] text-gray-400">
        Aucun paiement requis à cette étape.
      </p>
    </div>
  );
}
