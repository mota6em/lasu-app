export default function LiveTranslationsSkeleton({
  count = 6,
}: {
  count?: number;
}) {
  return (
    <div className="px-3 justify-center items-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="relative p-4 border rounded-xl shadow animate-pulse bg-gray-200 dark:bg-neutral-800/20"
        >
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="h-4 bg-gray-300 dark:bg-neutral-700 rounded w-16 mb-1"></div>
              <div className="h-3 bg-gray-300 dark:bg-neutral-700 rounded w-10"></div>
            </div>
            <div className="flex flex-row gap-x-1 items-center">
              <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-neutral-700"></div>
              <div className="h-3 bg-gray-300 dark:bg-neutral-700 rounded w-16"></div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {Array.from({ length: 3 }).map((_, j) => (
              <div
                key={j}
                className="h-6 w-12 rounded bg-gray-300 dark:bg-neutral-700"
              ></div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="h-3 bg-gray-300 dark:bg-neutral-700 rounded w-16"></div>
            <div className="h-6 bg-gray-300 dark:bg-neutral-700 rounded w-full mt-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-neutral-700 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
