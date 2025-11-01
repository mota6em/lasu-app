"use client";

import HistoryCard from "@/components/pages/history/HistoryCard";

type HistoryGridProps = {
  displayHistory: any[];
  onDelete: (itemId: string) => void;
};

export default function HistoryGrid({
  displayHistory,

  onDelete,
}: HistoryGridProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6 px-3 py-3 md:py-5">
      {displayHistory.map((item) => (
        <HistoryCard key={item._id} item={item} onDelete={onDelete} />
      ))}
    </div>
  );
}
