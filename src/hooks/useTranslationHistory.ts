"use client";
import { useEffect, useState } from "react";
import Translation from "@/types/translation";
import { useSession } from "next-auth/react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

const ITEMS_PER_PAGE = 10;

export default function useTranslationHistory(
  filter: "all" | "word" | "phrase"
) {
  const [localHistory, setLocalHistory] = useState<Translation[]>([]);
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const { ref: loadMoreRef, inView } = useInView({
    rootMargin: "200px 0px",
    triggerOnce: false,
  });

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ["translation-history", filter] });
  }, [filter, queryClient]);

  // load local history when unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      const local = localStorage.getItem("lasu-history");
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) setLocalHistory(parsed);
      }
    }
  }, [status]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["translation-history", filter],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(
        `/api/translation/history?page=${pageParam}&limit=${ITEMS_PER_PAGE}&filter=${filter}`
      );
      if (!res.ok) throw new Error("Failed to fetch history");
      return res.json();
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === ITEMS_PER_PAGE ? allPages.length : undefined;
    },
    enabled: status === "authenticated",
    initialPageParam: 0,
  });

  useEffect(() => {
    if (
      status === "authenticated" &&
      inView &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, status]);

  const history = data?.pages.flatMap((p) => p) || [];
  const filteredLocalHistory =
    filter === "all"
      ? localHistory
      : localHistory.filter((item) => item.translationType === filter);
  const displayHistory =
    status === "authenticated" ? history : filteredLocalHistory;

  const handleDelete = async (itemId: string) => {
    if (status === "authenticated") {
      await fetch(`/api/translation/history/${itemId}`, {
        method: "DELETE",
      });
      queryClient.invalidateQueries({
        queryKey: ["translation-history", filter],
      });
    } else {
      const updatedHistory = localHistory.filter((i) => i._id !== itemId);
      setLocalHistory(updatedHistory);
      localStorage.setItem("lasu-history", JSON.stringify(updatedHistory));
    }
  };

  return {
    displayHistory,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    loadMoreRef,
    handleDelete,
    session,
    status,
  };
}
