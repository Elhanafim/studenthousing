import { completionLabel, completionColor } from "@/lib/utils/listing";

export default function ListingCompletionBar({ score }: { score: number }) {
  const color = completionColor(score);
  const label = completionLabel(score);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          Complétude
        </span>
        <span
          className={`text-[10px] font-black ${
            score >= 70 ? "text-green-600" : score >= 40 ? "text-amber-600" : "text-red-500"
          }`}
        >
          {score}% — {label}
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
