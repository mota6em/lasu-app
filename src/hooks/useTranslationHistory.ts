import Translation from "@/types/translation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchHistory(filter: "all" | "word" | "phrase") {
  const res = await fetch(`/api/translation/history?filter=${filter}`);
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
}

async function deleteTranslation(itemId: string) {
  await fetch(`/api/translation/history/${itemId}`, { method: "DELETE" });
}

export default function useTranslationHistory(
  filter: "all" | "word" | "phrase"
) {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const [localHistory, setLocalHistory] = useState<Translation[]>([]);

  const {
    data: history,
    isLoading: isQueryLoading,
    isError,
  } = useQuery({
    queryKey: ["translation-history", filter],
    queryFn: () => fetchHistory(filter),
    enabled: status === "authenticated",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      const local = localStorage.getItem("lasu-history");
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) setLocalHistory(parsed);
      }
    }
  }, [status]);

  const filteredLocalHistory =
    filter === "all"
      ? localHistory
      : localHistory.filter((item) => item.translationType === filter);

  const displayHistory: Translation[] =
    status === "authenticated" ? (history ?? []) : filteredLocalHistory;

  const deleteMutation = useMutation({
    mutationFn: deleteTranslation,
    onMutate: async (itemId: string) => {
      // remove it from the visible list immediately, don't wait on the network
      await queryClient.cancelQueries({
        queryKey: ["translation-history", filter],
      });
      const previous = queryClient.getQueryData<Translation[]>([
        "translation-history",
        filter,
      ]);
      queryClient.setQueryData<Translation[]>(
        ["translation-history", filter],
        (old) => old?.filter((i) => i._id !== itemId) ?? []
      );
      return { previous };
    },
    onError: (_err, _itemId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["translation-history", filter],
          context.previous
        );
      }
    },
  });

  const handleDelete = async (itemId: string) => {
    if (status === "authenticated") {
      deleteMutation.mutate(itemId);
    } else {
      const updated = localHistory.filter((i) => i._id !== itemId);
      setLocalHistory(updated);
      localStorage.setItem("lasu-history", JSON.stringify(updated));
    }
  };

  const isLoading =
    status === "loading" || (status === "authenticated" && isQueryLoading);

  return {
    displayHistory,
    isLoading,
    isError,
    handleDelete,
    session,
    status,
  };
}
