import CreateListingWizard from "@/components/listings/CreateListingWizard";
import { ArrowLeft } from "lucide-react";

export default function CreateListingPage() {
  return (
    <div className="min-h-screen bg-[#FAFBFE] py-12 px-4 md:py-20">
      <div className="max-w-7xl mx-auto mb-12 flex items-center justify-between">
        <div>
          <a href="/dashboard" className="text-gray-400 flex items-center gap-2 font-bold text-sm hover:text-accent mb-4 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </a>
          <h1 className="text-4xl font-black text-primary tracking-tight">Create New Listing</h1>
          <p className="text-gray-500 font-light mt-2">Follow the steps to post your housing offer on Bayt-Talib</p>
        </div>
      </div>

      <CreateListingWizard />
    </div>
  );
}
