"use client";
import { useEffect, useState } from "react";
import Translation from "@/types/translation";
import { useSession } from "next-auth/react";
import { HistoryCardSkeleton } from "@/components/pages/history/HistoryCardSkeleton";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import HistoryFilter from "@/components/pages/history/HistoryFilter";
import HistoryCard from "@/components/pages/history/HistoryCard";
import AuthAlert from "@/components/pages/history/AuthAlert";
import ScrollToTop from "@/components/fixedComponents/ScrollToTop";
import useTranslationHistory from "@/hooks/useTranslationHistory";
import HistoryEmptyState from "@/components/pages/history/HistoryEmptyState";
import HistorySkeletonGrid from "@/components/pages/history/HistorySkeletonGrid";

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
        <div className="grid md:grid-cols-2 gap-6 px-3 py-3 md:py-5">
          {displayHistory.map((item) => (
            <HistoryCard key={item._id} item={item} onDelete={handleDelete} />
          ))}
          {isFetchingNextPage && (
            <div className="flex items-center md:items-end w-full justify-center">
              <span className="loading loading-dots loading-xl"></span>
            </div>
          )}
          {isFetchingNextPage && (
            <div className="hidden md:flex items-center md:items-end w-full justify-center">
              <span className="loading loading-dots loading-xl"></span>
            </div>
          )}
          <div ref={loadMoreRef} className="h-6" />
        </div>
      )}
      <ScrollToTop />
    </>
  );
}
