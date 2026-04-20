import { auth } from "@/lib/auth";

type GuardResult =
  | { ok: true; userId: string }
  | { ok: false; error: string };

/**
 * Server-side guard for sensitive actions.
 * Requires an authenticated session.
 * Apply at the top of any server action that touches listings,
 * messages, bookings, or the rental dossier.
 */
export async function requireVerifiedUser(): Promise<GuardResult> {
  const session = await auth();

  if (!session?.user) {
    console.warn("[auth-guard] Unauthenticated access attempt");
    return { ok: false, error: "Non autorisé. Veuillez vous connecter." };
  }

  const userId = (session.user as { id?: string }).id;
  if (!userId) {
    console.warn("[auth-guard] Session missing user id");
    return { ok: false, error: "Session invalide. Veuillez vous reconnecter." };
  }

  return { ok: true, userId };
}
