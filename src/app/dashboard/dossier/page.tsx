import { redirect } from "next/navigation";

// The "Mon dossier" feature has been removed. Redirect to profile settings.
export default function DossierPage() {
  redirect("/dashboard/settings");
}
