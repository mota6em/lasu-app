export default function LiveTranslationsSkeleton() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="surface-card animate-fade-up p-4"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-2">
              <div className="shimmer h-5 w-2/5 rounded" />
              <div className="shimmer h-3 w-16 rounded" />
            </div>
            <div className="shimmer h-6 w-20 rounded-full" />
          </div>
          <div className="mt-3 flex gap-1.5">
            {[0, 1, 2].map((j) => (
              <div key={j} className="shimmer h-6 w-16 rounded-full" />
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-border pt-3">
            <div className="shimmer h-6 w-3/5 rounded" />
            <div className="shimmer h-3 w-4/5 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
