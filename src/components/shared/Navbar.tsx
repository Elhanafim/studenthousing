"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Home,
  Search,
  PlusSquare,
  HelpCircle,
  Info,
  Menu,
  X,
  Building2,
  LayoutDashboard,
  MessageSquare,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const NAV_LINKS = [
  { href: "/",              label: "Accueil",             icon: Home },
  { href: "/search",        label: "Rechercher",          icon: Search },
  { href: "/publish",       label: "Publier",             icon: PlusSquare },
  { href: "/how-it-works",  label: "Comment ça marche",   icon: Info },
  { href: "/help",          label: "Aide",                icon: HelpCircle },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as any;

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full bg-white border-b border-gray-100 transition-all duration-150 ${
          scrolled ? "shadow-sm backdrop-blur-md bg-white/95 ring-1 ring-gray-100" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0 group"
              aria-label="StudentHome.ma — Accueil"
            >
              <div className="w-8 h-8 brand-gradient rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <Building2 className="text-white w-4 h-4" />
              </div>
              <span className="text-[15px] font-semibold tracking-tight text-gray-900">
                StudentHome<span className="text-brand-600">.ma</span>
              </span>
            </Link>

            {/* ── Desktop nav ── */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Navigation principale">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                    isActive(href)
                      ? "text-brand-600 bg-brand-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {label}
                  {isActive(href) && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand-600 rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* ── Right: auth ── */}
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  {/* Messages */}
                  <Link
                    href="/dashboard/messages"
                    className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                    aria-label="Messagerie"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </Link>

                  {/* User menu */}
                  <div className="relative hidden md:block">
                    <button
                      onClick={() => setUserMenuOpen((v) => !v)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                      aria-haspopup="true"
                      aria-expanded={userMenuOpen}
                    >
                      <div className="w-6 h-6 brand-gradient rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {user.name?.charAt(0)?.toUpperCase() ?? "U"}
                      </div>
                      <span className="max-w-[100px] truncate">{user.name?.split(" ")[0]}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-gray-100 shadow-xl py-1 z-50">
                        <div className="px-4 py-2.5 border-b border-gray-100">
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Link href="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <LayoutDashboard className="w-4 h-4 text-gray-400" /> Tableau de bord
                        </Link>
                        <Link href="/dashboard/messages" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <MessageSquare className="w-4 h-4 text-gray-400" /> Messagerie
                        </Link>
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-danger hover:bg-red-50"
                          >
                            <LogOut className="w-4 h-4" /> Se déconnecter
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="hidden md:inline-flex items-center px-4 py-2 text-sm font-semibold text-white brand-gradient rounded-lg shadow-sm hover:shadow-md transition-all"
                  >
                    Créer un compte
                  </Link>
                </>
              )}

              {/* Mobile hamburger */}
              <button
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile slide-down menu ── */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <nav className="px-4 py-4 space-y-1" aria-label="Menu mobile">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive(href)
                      ? "bg-brand-50 text-brand-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </Link>
              ))}
            </nav>

            <div className="px-4 pb-5 pt-2 border-t border-gray-100 space-y-2">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-8 h-8 brand-gradient rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name?.charAt(0)?.toUpperCase() ?? "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <LayoutDashboard className="w-4 h-4 text-gray-400" /> Tableau de bord
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" /> Se déconnecter
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" className="flex items-center justify-center w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Se connecter
                  </Link>
                  <Link href="/auth/signup" className="flex items-center justify-center w-full px-4 py-2.5 rounded-xl brand-gradient text-white text-sm font-semibold shadow-sm">
                    Créer un compte
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Overlay to close user menu */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
