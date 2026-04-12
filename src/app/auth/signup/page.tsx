import SignUpWizard from "@/components/auth/SignUpWizard";
import { Building } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col py-20 px-4">
      <div className="max-w-7xl mx-auto w-full mb-12 flex flex-col items-center">
        <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center shadow-2xl mb-6">
          <Building className="text-white w-10 h-10" />
        </div>
        <h1 className="text-4xl font-black text-primary tracking-tight">StudentHome.ma</h1>
        <p className="text-gray-400 font-light mt-2 italic text-sm">Safe & Modern Housing for Moroccan Students</p>
      </div>

      <SignUpWizard />

      <div className="mt-12 text-center text-gray-400 text-sm font-light">
        Already have an account? <a href="/auth/signin" className="text-accent font-bold hover:underline">Sign In</a>
      </div>
    </div>
  );
}
