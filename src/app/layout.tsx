import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "StudentHome.ma | Safe & Modern Housing for Moroccan Students",
  description:
    "The premium platform dedicated to connecting students with verified housing across major Moroccan university hubs — Casablanca, Rabat, Marrakech, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${outfit.variable} font-sans antialiased bg-background text-foreground`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
