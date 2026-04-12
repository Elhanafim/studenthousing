import Link from "next/link";
import { Building, LayoutDashboard, PlusCircle, Search } from "lucide-react";
import { auth } from "@/lib/auth";
import SignOutButton from "./SignOutButton";

export default async function Navbar() {
  const session = await auth();
  const user = session?.user as any;

  return (
    <nav className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center shadow">
            <Building className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-black tracking-tight text-primary">StudentHome.ma</span>
        </Link>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/search"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-accent transition-colors"
          >
            <Search className="w-4 h-4" /> Browse housing
          </Link>
          {user?.role === "HOST" && (
            <Link
              href="/dashboard/listings/create"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-accent transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> Post an offer
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden md:flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-accent transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
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
              <Link
                href="/auth/signin"
                className="text-sm font-medium text-gray-600 hover:text-accent transition-colors"
              >
                Se connecter
              </Link>
              <Link
                href="/auth/signup"
                className="clay-gradient text-white px-5 py-2 rounded-full text-sm font-bold shadow hover:shadow-lg transition-all"
              >
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
