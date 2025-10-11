"use client";

import { HistoryCardSkeleton } from "@/components/pages/history/HistoryCardSkeleton";

export default function HistorySkeletonGrid() {
  return (
    <div className="grid md:grid-cols-2 gap-6 px-3 py-3 md:py-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <HistoryCardSkeleton key={i} />
      ))}
    </div>
  );
}
