"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, CalendarCheck, Video } from "lucide-react";
import { sendMessage } from "@/lib/actions/messages";
import { useRouter } from "next/navigation";

interface SimpleMessage {
  id: string;
  content: string;
  createdAt: Date;
  isOwn: boolean;
  senderName: string;
}

interface MessageThreadProps {
  messages: SimpleMessage[];
  currentUserId: string;
  receiverId: string;
  listingId?: string;
  partnerName?: string;
}

export default function MessageThread({
  messages,
  currentUserId,
  receiverId,
  listingId,
  partnerName,
}: MessageThreadProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  function sendVisitRequest(type: "personne" | "virtuelle") {
    const text =
      type === "personne"
        ? "📅 Je souhaite faire une visite en personne de votre logement. Seriez-vous disponible prochainement ? Merci de me proposer un créneau."
        : "💻 Je souhaite faire une visite virtuelle (vidéo) de votre logement. Seriez-vous disponible pour un appel vidéo ? Merci de me proposer un créneau.";
    handleSend(text);
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
          {/* Visit request buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => sendVisitRequest("personne")}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors disabled:opacity-50 border border-brand-200"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              Visite en personne
            </button>
            <button
              type="button"
              onClick={() => sendVisitRequest("virtuelle")}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-accent-50 text-accent-700 hover:bg-accent-100 transition-colors disabled:opacity-50 border border-accent-200"
            >
              <Video className="w-3.5 h-3.5" />
              Visite virtuelle
            </button>
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
        {messages.map((msg) => (
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
        ))}
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
