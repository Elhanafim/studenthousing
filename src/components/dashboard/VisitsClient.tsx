"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Calendar, Clock, CheckCircle, Plus, Trash2,
  User, Building2, AlertCircle, Download,
} from "lucide-react";
import { createVisitSlot, deleteVisitSlot } from "@/lib/actions/visits";

interface VisitSlotWithRelations {
  id: string;
  date: string;
  durationMinutes: number;
  isBooked: boolean;
  listing: { id: string; title: string };
  bookedBy?: { name: string | null; email: string | null } | null;
  host?: { name: string | null; email: string | null } | null;
}

interface VisitsClientProps {
  hostedSlots: VisitSlotWithRelations[];
  bookedSlots: VisitSlotWithRelations[];
  myListings: { id: string; title: string }[];
}

function slotStatus(date: string, isBooked: boolean): "past" | "booked" | "available" {
  if (new Date(date) < new Date()) return "past";
  if (isBooked) return "booked";
  return "available";
}

function generateICS(slot: VisitSlotWithRelations): string {
  const start = new Date(slot.date);
  const end = new Date(start.getTime() + slot.durationMinutes * 60000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:Visite — ${slot.listing.title}`,
    `DESCRIPTION:Visite du logement ${slot.listing.title}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n");
}

export default function VisitsClient({ hostedSlots, bookedSlots, myListings }: VisitsClientProps) {
  const [tab, setTab] = useState<"hosted" | "booked">("hosted");
  const [isPending, startTransition] = useTransition();
  const [addOpen, setAddOpen] = useState(false);
  const [newSlot, setNewSlot] = useState({ listingId: myListings[0]?.id ?? "", date: "", time: "", duration: 30 });
  const [feedback, setFeedback] = useState("");

  const handleAddSlot = () => {
    if (!newSlot.listingId || !newSlot.date || !newSlot.time) {
      setFeedback("Veuillez remplir tous les champs.");
      return;
    }
    const isoDate = new Date(`${newSlot.date}T${newSlot.time}`).toISOString();
    startTransition(async () => {
      const res = await createVisitSlot({ listingId: newSlot.listingId, date: isoDate, durationMinutes: newSlot.duration });
      if (res.error) setFeedback(res.error);
      else { setFeedback("Créneau ajouté !"); setAddOpen(false); }
    });
  };

  const handleDelete = (slotId: string) => {
    startTransition(async () => {
      const res = await deleteVisitSlot(slotId);
      if (res.error) setFeedback(res.error);
    });
  };

  const handleDownloadICS = (slot: VisitSlotWithRelations) => {
    const content = generateICS(slot);
    const blob = new Blob([content], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `visite-${slot.listing.title.toLowerCase().replace(/\s+/g, "-")}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusBadge = (status: ReturnType<typeof slotStatus>) => {
    const config = {
      available: "bg-accent-100 text-accent-700",
      booked:    "bg-amber-100 text-amber-700",
      past:      "bg-gray-100 text-gray-500",
    };
    const labels = { available: "Disponible", booked: "Réservé", past: "Passé" };
    return (
      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${config[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Mes visites</h1>
          <p className="text-gray-600 text-sm mt-1">Gérez vos créneaux de visite et vos visites planifiées.</p>
        </div>
        {myListings.length > 0 && (
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2 brand-gradient text-white text-sm font-semibold rounded-xl hover:shadow-md transition-shadow"
          >
            <Plus className="w-4 h-4" /> Ajouter un créneau
          </button>
        )}
      </div>

      {/* Add slot modal */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl ring-1 ring-gray-200 p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Nouveau créneau de visite</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5" htmlFor="sl-listing">
                  Annonce
                </label>
                <select
                  id="sl-listing"
                  value={newSlot.listingId}
                  onChange={(e) => setNewSlot((p) => ({ ...p, listingId: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
                >
                  {myListings.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5" htmlFor="sl-date">Date</label>
                  <input id="sl-date" type="date" value={newSlot.date} min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setNewSlot((p) => ({ ...p, date: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5" htmlFor="sl-time">Heure</label>
                  <input id="sl-time" type="time" value={newSlot.time}
                    onChange={(e) => setNewSlot((p) => ({ ...p, time: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5" htmlFor="sl-dur">
                  Durée
                </label>
                <select id="sl-dur" value={newSlot.duration}
                  onChange={(e) => setNewSlot((p) => ({ ...p, duration: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none">
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                  <option value={45}>45 min</option>
                  <option value={60}>1 heure</option>
                </select>
              </div>
            </div>

            {feedback && (
              <p className="mt-3 text-xs text-danger flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> {feedback}
              </p>
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={() => setAddOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={handleAddSlot} disabled={isPending}
                className="flex-1 py-2.5 rounded-xl brand-gradient text-white text-sm font-semibold hover:shadow-md transition-shadow disabled:opacity-50">
                {isPending ? "…" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6 w-fit">
        {(["hosted", "booked"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}>
            {t === "hosted" ? `Mes créneaux (${hostedSlots.length})` : `Visites réservées (${bookedSlots.length})`}
          </button>
        ))}
      </div>

      {/* Hosted slots */}
      {tab === "hosted" && (
        <div className="space-y-3">
          {hostedSlots.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl ring-1 ring-gray-200">
              <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 text-sm font-medium">Aucun créneau défini</p>
              <p className="text-gray-400 text-xs mt-1">Ajoutez des créneaux pour permettre aux étudiants de visiter vos logements.</p>
            </div>
          ) : hostedSlots.map((slot) => {
            const status = slotStatus(slot.date, slot.isBooked);
            const d = new Date(slot.date);
            return (
              <div key={slot.id} className="bg-white rounded-xl ring-1 ring-gray-200 p-4 flex items-center gap-4">
                <div className="w-12 h-12 brand-gradient rounded-xl flex items-center justify-center text-white shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Link href={`/listings/${slot.listing.id}`} className="font-medium text-gray-900 text-sm hover:text-brand-600 truncate">
                      {slot.listing.title}
                    </Link>
                    {statusBadge(status)}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {d.toLocaleDateString("fr-MA", { weekday: "short", day: "numeric", month: "short" })} à {d.toLocaleTimeString("fr-MA", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span>{slot.durationMinutes} min</span>
                  </div>
                  {slot.isBooked && slot.bookedBy && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                      <User className="w-3 h-3" />
                      {slot.bookedBy.name ?? slot.bookedBy.email}
                    </div>
                  )}
                </div>
                {status !== "booked" && status !== "past" && (
                  <button onClick={() => handleDelete(slot.id)} disabled={isPending}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-danger hover:bg-red-50 transition-colors"
                    aria-label="Supprimer le créneau">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Booked slots */}
      {tab === "booked" && (
        <div className="space-y-3">
          {bookedSlots.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl ring-1 ring-gray-200">
              <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 text-sm font-medium">Aucune visite planifiée</p>
              <p className="text-gray-400 text-xs mt-1">Réservez une visite depuis la page d'un logement.</p>
            </div>
          ) : bookedSlots.map((slot) => {
            const status = slotStatus(slot.date, true);
            const d = new Date(slot.date);
            return (
              <div key={slot.id} className="bg-white rounded-xl ring-1 ring-gray-200 p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-accent-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Link href={`/listings/${slot.listing.id}`} className="font-medium text-gray-900 text-sm hover:text-brand-600 truncate">
                      {slot.listing.title}
                    </Link>
                    {statusBadge(status)}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {d.toLocaleDateString("fr-MA", { weekday: "short", day: "numeric", month: "short" })} à {d.toLocaleTimeString("fr-MA", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {slot.host && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> {slot.host.name}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDownloadICS(slot)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  aria-label="Ajouter à mon calendrier"
                >
                  <Download className="w-3.5 h-3.5" /> .ics
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
