export function CardSkeleton() {
  return (
    <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-52 bg-gray-200" />
      <div className="p-6 space-y-3">
        <div className="h-4 bg-gray-200 rounded-full w-3/4" />
        <div className="h-3 bg-gray-100 rounded-full w-1/2" />
        <div className="flex gap-2 pt-2">
          <div className="h-5 bg-gray-100 rounded-full w-16" />
          <div className="h-5 bg-gray-100 rounded-full w-20" />
        </div>
        <div className="h-5 bg-gray-200 rounded-full w-1/3 pt-1" />
      </div>
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-5 animate-pulse">
      <div className="w-16 h-16 bg-gray-200 rounded-2xl shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded-full w-1/2" />
        <div className="h-3 bg-gray-100 rounded-full w-1/3" />
      </div>
      <div className="h-6 bg-gray-200 rounded-full w-20" />
    </div>
  );
}

export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 bg-gray-200 rounded-full"
          style={{ width: `${80 - i * 10}%` }}
        />
      ))}
    </div>
  );
}
