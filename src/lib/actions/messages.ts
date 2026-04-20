"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requireVerifiedUser } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const messageSchema = z.object({
  content: z.string().min(1, "Le message ne peut pas être vide").max(2000),
  receiverId: z.string(),
  listingId: z.string().optional(),
  bookingRequestId: z.string().optional(),
});

export async function sendMessage(data: z.infer<typeof messageSchema>) {
  const guard = await requireVerifiedUser();
  if (!guard.ok) return { error: guard.error };
  const senderId = guard.userId;

  console.log(`[message] sendMessage called by user ${senderId}`);

  try {
    const validated = messageSchema.parse(data);
    const message = await prisma.message.create({
      data: {
        content: validated.content,
        senderId,
        receiverId: validated.receiverId,
        listingId: validated.listingId,
        bookingRequestId: validated.bookingRequestId,
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
      },
    });
    revalidatePath("/dashboard/messages");
    return { success: true, message };
  } catch (error) {
    if (error instanceof z.ZodError) return { error: error.issues[0].message };
    return { error: "Impossible d'envoyer le message." };
  }
}

export async function getConversations(userId: string) {
  const messages = await prisma.message.findMany({
    where: { OR: [{ senderId: userId }, { receiverId: userId }] },
    include: {
      sender: { select: { id: true, name: true, image: true } },
      receiver: { select: { id: true, name: true, image: true } },
      listing: { select: { id: true, title: true, city: true, images: { take: 1 } } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Group by (listing + partner) to form conversation threads
  const threads = new Map<string, typeof messages>();
  for (const msg of messages) {
    const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
    const key = `${msg.listingId ?? "direct"}-${partnerId}`;
    if (!threads.has(key)) threads.set(key, []);
    threads.get(key)!.push(msg);
  }

  return Array.from(threads.entries()).map(([key, msgs]) => {
    const latest = msgs[0];
    const partnerId = latest.senderId === userId ? latest.receiverId : latest.senderId;
    const partner = latest.senderId === userId ? latest.receiver : latest.sender;
    const unreadCount = msgs.filter((m) => m.receiverId === userId && !m.isRead).length;
    return { key, partner, listing: latest.listing, latestMessage: latest, unreadCount, messages: msgs };
  });
}

export async function getThread(listingId: string | null, partnerId: string, userId: string) {
  return prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: partnerId },
        { senderId: partnerId, receiverId: userId },
      ],
      ...(listingId ? { listingId } : {}),
    },
    include: {
      sender: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function markAsRead(messageId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Non autorisé." };
  const userId = (session.user as any).id as string;

  await prisma.message.updateMany({
    where: { id: messageId, receiverId: userId },
    data: { isRead: true },
  });
  revalidatePath("/dashboard/messages");
  return { success: true };
}

export async function getUnreadCount(userId: string): Promise<number> {
  return prisma.message.count({ where: { receiverId: userId, isRead: false } });
}
