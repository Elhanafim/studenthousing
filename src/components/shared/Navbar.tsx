import Link from "next/link";
import { Building, LayoutDashboard, PlusCircle, Search, HelpCircle, Home, MessageSquare } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SignOutButton from "./SignOutButton";

export default async function Navbar() {
  const session = await auth();
  const user = session?.user as any;

  const unreadCount = user?.id
    ? await prisma.message.count({ where: { receiverId: user.id, isRead: false } })
    : 0;

  return (
    <nav className="w-full border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center shadow">
            <Building className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-black tracking-tight text-primary">StudentHome.ma</span>
        </Link>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-1">
          <Link href="/search" className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-accent hover:bg-accent/5 px-3 py-2 rounded-xl transition-all">
            <Search className="w-4 h-4" /> Logements
          </Link>
          <Link href="/hosts" className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-accent hover:bg-accent/5 px-3 py-2 rounded-xl transition-all">
            <Home className="w-4 h-4" /> Propriétaires
          </Link>
          <Link href="/guarantees" className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-accent hover:bg-accent/5 px-3 py-2 rounded-xl transition-all">
            Garanties
          </Link>
          <Link href="/help" className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-accent hover:bg-accent/5 px-3 py-2 rounded-xl transition-all">
            <HelpCircle className="w-4 h-4" /> Aide
          </Link>
          {user?.role === "HOST" && (
            <Link href="/dashboard/listings/create" className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-accent hover:bg-accent/5 px-3 py-2 rounded-xl transition-all">
              <PlusCircle className="w-4 h-4" /> Publier
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Messages badge */}
              <Link href="/dashboard/messages" className="relative hidden md:flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-accent transition-colors">
                <MessageSquare className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-accent text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              <Link href="/dashboard" className="hidden md:flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-accent transition-colors">
                <LayoutDashboard className="w-4 h-4" />
                Tableau de bord
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">
                  {user.name?.charAt(0)?.toUpperCase() ?? "U"}
                </div>
                <SignOutButton />
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="text-sm font-medium text-gray-600 hover:text-accent transition-colors">
                Se connecter
              </Link>
              <Link href="/auth/signup" className="clay-gradient text-white px-5 py-2 rounded-full text-sm font-bold shadow hover:shadow-lg transition-all">
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
