"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { showUndoToast } from "@/components/fixedComponents/UndoToast";
import {
  LOCAL_HISTORY_EVENT,
  readLocalHistory,
  writeLocalHistory,
} from "@/lib/localHistory";
import Translation from "@/types/translation";

const UNDO_WINDOW = 5000;

type Filter = "all" | "word" | "phrase";

async function fetchHistory(filter: Filter): Promise<Translation[]> {
  const res = await fetch(`/api/translation/history?filter=${filter}`);
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
}

export default function useTranslationHistory(filter: Filter) {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const [localHistory, setLocalHistory] = useState<Translation[]>([]);
  const pendingDeletes = useRef(new Map<string, ReturnType<typeof setTimeout>>());

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
    if (status !== "unauthenticated") return;

    const sync = () => setLocalHistory(readLocalHistory());
    sync();

    window.addEventListener(LOCAL_HISTORY_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(LOCAL_HISTORY_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [status]);

  useEffect(() => {
    const timers = pendingDeletes.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  const displayHistory: Translation[] =
    status === "authenticated"
      ? history ?? []
      : filter === "all"
      ? localHistory
      : localHistory.filter((item) => item.translationFilter === filter);

  const handleDelete = useCallback(
    (itemId: string) => {
      if (status !== "authenticated") {
        const previous = readLocalHistory();
        writeLocalHistory(previous.filter((item) => item._id !== itemId));
        showUndoToast("Translation deleted", () => writeLocalHistory(previous));
        return;
      }

      const keys: Filter[] = ["all", "word", "phrase"];
      const snapshots = keys.map(
        (key) =>
          [key, queryClient.getQueryData<Translation[]>(["translation-history", key])] as const
      );

      keys.forEach((key) =>
        queryClient.setQueryData<Translation[]>(["translation-history", key], (old) =>
          old?.filter((item) => item._id !== itemId)
        )
      );

      const commit = setTimeout(async () => {
        pendingDeletes.current.delete(itemId);
        await fetch(`/api/translation/history/${itemId}`, { method: "DELETE" });
        queryClient.invalidateQueries({ queryKey: ["translation-stats"] });
        queryClient.invalidateQueries({ queryKey: ["practice-words"] });
      }, UNDO_WINDOW);

      pendingDeletes.current.set(itemId, commit);

      showUndoToast(
        "Translation deleted",
        () => {
          clearTimeout(commit);
          pendingDeletes.current.delete(itemId);
          snapshots.forEach(([key, snapshot]) =>
            queryClient.setQueryData(["translation-history", key], snapshot)
          );
        },
        UNDO_WINDOW - 400
      );
    },
    [status, queryClient]
  );

  const isLoading =
    status === "loading" || (status === "authenticated" && isQueryLoading);

  return { displayHistory, isLoading, isError, handleDelete, session, status };
}
