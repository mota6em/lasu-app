import HistorySkeletonGrid from "@/components/pages/history/HistorySkeletonGrid";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="shimmer h-9 w-40 rounded-lg" />
        <div className="shimmer mt-2 h-4 w-64 rounded" />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="shimmer h-10 flex-1 rounded-lg" />
        <div className="shimmer h-10 w-56 rounded-lg" />
      </div>
      <HistorySkeletonGrid />
    </div>
  );
}
