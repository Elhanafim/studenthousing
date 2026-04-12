import Link from "next/link";
import { Building } from "lucide-react";
import SignInForm from "@/components/auth/SignInForm";

export const metadata = {
  title: "Se connecter | StudentHome.ma",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col py-20 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto w-full mb-12 flex flex-col items-center">
        <Link href="/" className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center shadow-2xl">
            <Building className="text-white w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-primary tracking-tight">StudentHome.ma</h1>
        </Link>
        <p className="text-gray-400 font-light mt-2 italic text-sm">
          Safe &amp; Modern Housing for Moroccan Students
        </p>
      </div>

      {/* Card */}
      <div className="max-w-md mx-auto w-full glass rounded-[2.5rem] shadow-2xl p-8 md:p-10">
        <h2 className="text-2xl font-black text-primary mb-2">Bon retour !</h2>
        <p className="text-gray-500 font-light mb-8">
          Connectez-vous pour accéder à votre espace.
        </p>

        <SignInForm />
      </div>

      {/* Footer links */}
      <div className="mt-8 text-center text-gray-400 text-sm font-light space-y-2">
        <p>
          Pas encore de compte ?{" "}
          <Link href="/auth/signup" className="text-accent font-bold hover:underline">
            S&apos;inscrire
          </Link>
        </p>
        <p>
          <Link href="/" className="hover:text-accent transition-colors">
            ← Retour à l&apos;accueil
          </Link>
        </p>
      </div>
    </div>
  );
}
