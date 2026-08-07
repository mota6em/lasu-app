export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="shimmer h-9 w-32 rounded-lg" />
        <div className="shimmer mt-2 h-4 w-56 rounded" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="shimmer h-28 rounded-xl" />
        ))}
      </div>

      <div className="shimmer h-80 rounded-2xl" />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="shimmer h-56 rounded-2xl" />
        <div className="shimmer h-56 rounded-2xl" />
      </div>
    </div>
  );
}
