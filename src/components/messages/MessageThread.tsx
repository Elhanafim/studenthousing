"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, CalendarCheck, Video, X, Check, XCircle } from "lucide-react";
import { sendMessage } from "@/lib/actions/messages";
import { sendVisitRequest, respondToVisitRequest } from "@/lib/actions/visits";
import { useRouter } from "next/navigation";

export interface SimpleMessage {
  id: string;
  content: string;
  createdAt: Date;
  isOwn: boolean;
  senderName: string;
  visitRequest?: {
    id: string;
    proposedAt: Date;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
  } | null;
}

interface MessageThreadProps {
  messages: SimpleMessage[];
  currentUserId: string;
  receiverId: string;
  listingId?: string;
  partnerName?: string;
  /** Pass the listing's hostId so we know who can accept/reject */
  hostId?: string;
}

export default function MessageThread({
  messages,
  currentUserId,
  receiverId,
  listingId,
  partnerName,
  hostId,
}: MessageThreadProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("10:00");
  const [visitLoading, setVisitLoading] = useState(false);
  const [visitError, setVisitError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const isHost = currentUserId === hostId;
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(text?: string) {
    const msg = text ?? content.trim();
    if (!msg) return;
    setLoading(true);
    setError("");
    const result = await sendMessage({ content: msg, receiverId, listingId });
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setContent("");
      router.refresh();
    }
  }

  async function handleVisitRequest() {
    if (!visitDate || !visitTime) {
      setVisitError("Veuillez choisir une date et une heure.");
      return;
    }
    if (!listingId) {
      setVisitError("Annonce introuvable.");
      return;
    }
    setVisitLoading(true);
    setVisitError("");
    const proposedAt = new Date(`${visitDate}T${visitTime}:00`).toISOString();
    const result = await sendVisitRequest({ listingId, hostId: receiverId, proposedAt });
    setVisitLoading(false);
    if (result.error) {
      setVisitError(result.error);
    } else {
      setShowVisitModal(false);
      setVisitDate("");
      setVisitTime("10:00");
      router.refresh();
    }
  }

  async function handleRespond(visitRequestId: string, response: "ACCEPTED" | "REJECTED") {
    setLoading(true);
    await respondToVisitRequest(visitRequestId, response);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col h-full min-h-[400px]">
      {/* Thread header */}
      {partnerName && (
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">
              {partnerName.charAt(0).toUpperCase()}
            </div>
            <span className="font-bold text-primary">{partnerName}</span>
          </div>
          {/* Only students (non-host) can request a visit */}
          {!isHost && listingId && (
            <button
              type="button"
              onClick={() => setShowVisitModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors border border-brand-200"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              Demander une visite
            </button>
          )}
        </div>
      )}

      {/* Visit request modal */}
      {showVisitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-primary">Proposer une date de visite</h3>
              <button onClick={() => setShowVisitModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={visitDate}
                  min={minDateStr}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Heure
                </label>
                <select
                  value={visitTime}
                  onChange={(e) => setVisitTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-accent/20"
                >
                  {["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {visitError && (
              <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{visitError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowVisitModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleVisitRequest}
                disabled={visitLoading}
                className="flex-1 py-2.5 rounded-xl clay-gradient text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {visitLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarCheck className="w-4 h-4" />}
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm font-light">
            Démarrez la conversation…
          </div>
        )}
        {messages.map((msg) => {
          if (msg.visitRequest) {
            // ── Visit request card ──────────────────────────────────
            const vr = msg.visitRequest;
            const dateStr = new Date(vr.proposedAt).toLocaleDateString("fr-MA", {
              weekday: "long", day: "numeric", month: "long", year: "numeric",
            });
            const timeStr = new Date(vr.proposedAt).toLocaleTimeString("fr-MA", {
              hour: "2-digit", minute: "2-digit",
            });

            const statusBadge =
              vr.status === "ACCEPTED"
                ? <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Acceptée ✓</span>
                : vr.status === "REJECTED"
                ? <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">Refusée</span>
                : <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">En attente</span>;

            return (
              <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[80%] bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-brand-600 shrink-0" />
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Demande de visite</span>
                    {statusBadge}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">{dateStr}</p>
                    <p className="text-sm text-gray-500">{timeStr}</p>
                  </div>
                  {/* Accept / Reject only for host when still pending */}
                  {isHost && vr.status === "PENDING" && (
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleRespond(vr.id, "ACCEPTED")}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-green-50 text-green-700 text-xs font-bold hover:bg-green-100 transition-colors border border-green-200 disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" /> Accepter
                      </button>
                      <button
                        onClick={() => handleRespond(vr.id, "REJECTED")}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 transition-colors border border-red-200 disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Refuser
                      </button>
                    </div>
                  )}
                  <div className="text-[10px] text-gray-400 font-medium">
                    {new Date(msg.createdAt).toLocaleTimeString("fr-MA", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            );
          }

          // ── Regular message ─────────────────────────────────────
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.isOwn ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className="w-7 h-7 rounded-full clay-gradient flex items-center justify-center text-white text-[10px] font-black shrink-0">
                {msg.senderName.charAt(0).toUpperCase()}
              </div>
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.isOwn
                    ? "clay-gradient text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-800 rounded-bl-sm"
                }`}
              >
                {msg.content}
                <div className={`text-[10px] mt-1 font-medium ${msg.isOwn ? "text-white/60" : "text-gray-400"}`}>
                  {new Date(msg.createdAt).toLocaleTimeString("fr-MA", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {error && <p className="text-red-500 text-xs px-4 pb-1">{error}</p>}
      <div className="border-t border-gray-100 p-4 flex gap-3">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Écrire un message…"
          className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-accent/20 font-medium"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !content.trim()}
          className="clay-gradient text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow hover:shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
