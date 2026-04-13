import { ShieldCheck, Phone, FileCheck } from "lucide-react";

interface VerificationBadgeProps {
  emailVerified: boolean;
  phoneVerified?: boolean;
  identityVerified?: boolean;
  size?: "sm" | "md";
}

export default function VerificationBadge({
  emailVerified,
  phoneVerified = false,
  identityVerified = false,
  size = "sm",
}: VerificationBadgeProps) {
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const textSize = size === "sm" ? "text-[10px]" : "text-xs";

  if (!emailVerified && !phoneVerified && !identityVerified) return null;

  const level = identityVerified ? "full" : phoneVerified ? "partial" : "email";

  const configs = {
    full: {
      label: "Identité vérifiée",
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      Icon: ShieldCheck,
    },
    partial: {
      label: "Téléphone vérifié",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      Icon: Phone,
    },
    email: {
      label: "Email vérifié",
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      Icon: FileCheck,
    },
  };

  const { label, bg, text, border, Icon } = configs[level];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-bold ${bg} ${text} ${border} ${textSize}`}
    >
      <Icon className={iconSize} />
      {label}
    </span>
  );
}
