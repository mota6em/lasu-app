export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="space-y-3 text-center">
        <div className="shimmer mx-auto h-6 w-28 rounded-full" />
        <div className="shimmer mx-auto h-10 w-3/4 max-w-xl rounded-lg" />
        <div className="shimmer mx-auto h-4 w-2/3 max-w-lg rounded-md" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="shimmer h-80 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="shimmer h-32 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
