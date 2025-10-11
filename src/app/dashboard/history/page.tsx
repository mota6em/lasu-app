"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import HistoryFilter from "@/components/pages/history/HistoryFilter";
import AuthAlert from "@/components/pages/history/AuthAlert";
import ScrollToTop from "@/components/fixedComponents/ScrollToTop";
import useTranslationHistory from "@/hooks/useTranslationHistory";
import HistoryEmptyState from "@/components/pages/history/HistoryEmptyState";
import HistorySkeletonGrid from "@/components/pages/history/HistorySkeletonGrid";
import HistoryGrid from "@/components/pages/history/HistoryGrid";

export default function HistoryPage() {
  const [filter, setFilter] = useState<"all" | "word" | "phrase">("all");
  const {
    displayHistory,
    isLoading,
    isError,
    isFetchingNextPage,
    loadMoreRef,
    handleDelete,
  } = useTranslationHistory(filter);
  const { data: session, status } = useSession();

  if (isError) {
    return (
      <>
        <h1 className="text-2xl lg:text-3xl px-4 lg:ps-0 font-bold mb-1">
          📚 Translation History
        </h1>
        <p className="text-red-500 text-sm my-5 ms-5">
          Error loading translation history. Please try again.
        </p>
      </>
    );
  }

  return (
    <>
      {!session && status === "unauthenticated" && <AuthAlert />}
      <h1 className="text-2xl lg:text-3xl px-4 lg:ps-0 font-bold mb-1">
        📚 Translation History
      </h1>

      <div className="px-0 mb-2 mt-5 ms-8">
        <p className="text-sm text-muted-foreground">Filter translations:</p>
      </div>
      <HistoryFilter filter={filter} setFilter={setFilter} />

      {(status === "loading" || (status === "authenticated" && isLoading)) && (
        <HistorySkeletonGrid />
      )}
      {displayHistory.length === 0 && status !== "loading" && (
        <HistoryEmptyState />
      )}
      {!(status === "loading" || (status === "authenticated" && isLoading)) && (
        <HistoryGrid
          displayHistory={displayHistory}
          isFetchingNextPage={isFetchingNextPage}
          loadMoreRef={loadMoreRef}
          onDelete={handleDelete}
        />
      )}
      <ScrollToTop />
    </>
  );
}
