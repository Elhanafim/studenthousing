import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CookieBanner from "@/components/shared/CookieBanner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | StudentHome.ma",
    default: "StudentHome.ma — Logement étudiant au Maroc",
  },
  description:
    "La première plateforme gratuite de logement étudiant au Maroc. Annonces vérifiées dans les grandes villes universitaires : Casablanca, Rabat, Fès, Marrakech.",
  keywords: ["logement étudiant", "maroc", "colocation", "studio", "casablanca", "rabat"],
  metadataBase: new URL("https://student-housing-morocco.vercel.app"),
  openGraph: {
    siteName: "StudentHome.ma",
    type: "website",
    locale: "fr_MA",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col">
        <SessionProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <CookieBanner />
        </SessionProvider>
      </body>
    </html>
  );
}
