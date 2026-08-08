export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-3">
        <div className="shimmer h-6 w-32 rounded-full" />
        <div className="shimmer h-10 w-72 rounded-lg" />
        <div className="shimmer h-4 w-80 rounded" />
      </div>
      <div className="mx-auto w-full max-w-xl space-y-3">
        <div className="shimmer h-24 rounded-2xl" />
        <div className="shimmer h-40 rounded-2xl" />
        <div className="shimmer h-14 rounded-2xl" />
      </div>
    </div>
  );
}
