import Link from "next/link";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: { label: string; href: string };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5 text-gray-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-400 font-light max-w-sm mb-6">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="clay-gradient text-white px-8 py-3 rounded-2xl font-bold shadow hover:shadow-lg transition-all text-sm"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
