"use client";

import HistoryCard from "@/components/pages/history/HistoryCard";

type HistoryGridProps = {
  displayHistory: any[];
  isFetchingNextPage: boolean;
  loadMoreRef: (node?: Element | null) => void;
  onDelete: (itemId: string) => void;
};

export default function HistoryGrid({
  displayHistory,
  isFetchingNextPage,
  loadMoreRef,
  onDelete,
}: HistoryGridProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6 px-3 py-3 md:py-5">
      {displayHistory.map((item) => (
        <HistoryCard key={item._id} item={item} onDelete={onDelete} />
      ))}

      {isFetchingNextPage && (
        <>
          <div className="flex items-center md:items-end w-full justify-center">
            <span className="loading loading-dots loading-xl"></span>
          </div>
          <div className="hidden md:flex items-center md:items-end w-full justify-center">
            <span className="loading loading-dots loading-xl"></span>
          </div>
        </>
      )}

      <div ref={loadMoreRef} className="h-6" />
    </div>
  );
}
