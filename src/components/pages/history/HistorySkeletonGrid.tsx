export default function HistorySkeletonGrid() {
  return (
    <div className="space-y-8">
      {[0, 1].map((group) => (
        <section key={group}>
          <div className="mb-3 flex items-center gap-3">
            <div className="shimmer h-3 w-20 rounded" />
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="surface-card animate-fade-up p-4"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="shimmer h-5 w-2/5 rounded" />
                <div className="shimmer mt-2 h-3 w-24 rounded" />
                <div className="mt-4 space-y-2.5">
                  <div className="shimmer h-3.5 w-4/5 rounded" />
                  <div className="shimmer h-3.5 w-3/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
