"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
    >
      <LogOut className="w-4 h-4" />
      Déconnexion
    </button>
  );
}
