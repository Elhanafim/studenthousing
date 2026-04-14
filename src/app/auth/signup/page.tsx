import SignUpWizard from "@/components/auth/SignUpWizard";

export const metadata = {
  title: "Créer un compte | Bayt-Talib",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col py-20 px-4">
      <div className="max-w-7xl mx-auto w-full mb-12 flex flex-col items-center">
        <h1 className="font-display text-4xl font-bold text-primary tracking-tight">Bayt-Talib</h1>
        <p className="text-gray-400 font-light mt-2 italic text-sm">Logement étudiant au Maroc</p>
      </div>

      <SignUpWizard />

      <div className="mt-12 text-center text-gray-400 text-sm font-light">
        Déjà un compte ?{" "}
        <a href="/auth/signin" className="text-accent font-bold hover:underline">Se connecter</a>
      </div>
    </div>
  );
}
