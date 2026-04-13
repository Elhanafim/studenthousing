import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/shared/Navbar";
import MessageThread from "@/components/messages/MessageThread";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Messages | StudentHome.ma" };

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ threadId?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const userId = (session.user as any).id as string;
  const { threadId } = await searchParams;

  // All messages involving this user, ordered newest first
  const allMessages = await prisma.message.findMany({
    where: { OR: [{ senderId: userId }, { receiverId: userId }] },
    include: {
      sender: { select: { id: true, name: true } },
      receiver: { select: { id: true, name: true } },
      listing: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Group into conversation threads (by partner + listing)
  const threads = new Map<
    string,
    { key: string; partner: { id: string; name: string | null }; listingTitle: string | null; listingId: string | null; lastMessage: string; lastAt: Date; unread: number }
  >();

  for (const msg of allMessages) {
    const partner = msg.senderId === userId ? msg.receiver : msg.sender;
    const key = `${partner.id}__${msg.listingId ?? "dm"}`;
    if (!threads.has(key)) {
      threads.set(key, {
        key,
        partner,
        listingTitle: msg.listing?.title ?? null,
        listingId: msg.listingId ?? null,
        lastMessage: msg.content,
        lastAt: msg.createdAt,
        unread: 0,
      });
    }
    if (!msg.isRead && msg.receiverId === userId) {
      threads.get(key)!.unread += 1;
    }
  }

  const conversationList = Array.from(threads.values());

  // Active thread
  let activeThread: typeof conversationList[0] | null = null;
  let threadMessages: typeof allMessages = [];

  if (threadId) {
    activeThread = conversationList.find((t) => t.key === threadId) ?? null;
    if (activeThread) {
      const partnerId = activeThread.partner.id;
      const listingId = activeThread.listingId;
      threadMessages = allMessages
        .filter((m) => {
          const partners = [m.senderId, m.receiverId];
          const matchPartner = partners.includes(partnerId) && partners.includes(userId);
          const matchListing = listingId ? m.listingId === listingId : !m.listingId;
          return matchPartner && matchListing;
        })
        .reverse(); // chronological order

      // Mark received messages as read
      const unreadIds = threadMessages.filter((m) => !m.isRead && m.receiverId === userId).map((m) => m.id);
      if (unreadIds.length > 0) {
        await prisma.message.updateMany({ where: { id: { in: unreadIds } }, data: { isRead: true } });
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFBFE]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-accent font-medium transition-colors mb-3 inline-block">
            ← Tableau de bord
          </Link>
          <h1 className="text-3xl font-black text-primary">Messages</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
          {/* Conversation list */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-y-auto">
            {conversationList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-200 mb-3" />
                <p className="text-gray-400 font-light text-sm">Aucune conversation pour l&apos;instant.</p>
                <Link href="/search" className="mt-4 text-accent font-bold text-sm hover:underline">
                  Trouver un logement →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {conversationList.map((thread) => (
                  <Link
                    key={thread.key}
                    href={`/dashboard/messages?threadId=${encodeURIComponent(thread.key)}`}
                    className={`flex items-start gap-3 p-5 hover:bg-gray-50 transition-colors ${threadId === thread.key ? "bg-accent/5 border-l-2 border-accent" : ""}`}
                  >
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">
                      {thread.partner.name?.charAt(0)?.toUpperCase() ?? "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-sm text-primary truncate">{thread.partner.name ?? "Utilisateur"}</span>
                        {thread.unread > 0 && (
                          <span className="bg-accent text-white text-[10px] font-black px-2 py-0.5 rounded-full ml-2 shrink-0">
                            {thread.unread}
                          </span>
                        )}
                      </div>
                      {thread.listingTitle && (
                        <p className="text-[10px] text-accent font-bold uppercase tracking-wider truncate">{thread.listingTitle}</p>
                      )}
                      <p className="text-xs text-gray-400 truncate mt-0.5">{thread.lastMessage}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Thread panel */}
          <div className="md:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-sm flex flex-col overflow-hidden">
            {activeThread ? (
              <MessageThread
                messages={threadMessages.map((m) => ({
                  id: m.id,
                  content: m.content,
                  createdAt: m.createdAt,
                  isOwn: m.senderId === userId,
                  senderName: m.sender.name ?? "?",
                }))}
                currentUserId={userId}
                receiverId={activeThread.partner.id}
                listingId={activeThread.listingId ?? undefined}
                partnerName={activeThread.partner.name ?? "Utilisateur"}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <MessageSquare className="w-16 h-16 text-gray-100 mb-4" />
                <p className="text-gray-400 font-light">Sélectionnez une conversation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
