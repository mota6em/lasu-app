export default function Loading() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 py-10">
      <div className="shimmer h-14 w-40 rounded-lg" />
      <div className="shimmer h-10 w-full max-w-lg rounded-lg" />
      <div className="shimmer h-4 w-72 rounded" />
      <div className="shimmer mt-4 h-11 w-64 rounded-lg" />
      <div className="mt-6 grid w-full gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="shimmer h-32 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
