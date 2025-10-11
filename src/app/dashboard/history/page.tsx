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
        <>
          <div className="grid md:grid-cols-2 gap-6 px-3 py-3 md:py-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <HistoryCardSkeleton key={i} />
            ))}
          </div>
        </>
      )}
      {displayHistory.length === 0 && status !== "loading" && (
        <div className="px-4 py-10 w-full justify-center items-center flex flex-col">
          <p className="text-muted-foreground text-sm my-5 ms-x">
            No translation history found, start a translation to see it here.
          </p>
          <button
            className="btn btn-primary mx-5"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
          >
            Start a translation
          </button>
        </div>
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
