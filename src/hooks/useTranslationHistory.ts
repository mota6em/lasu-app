import Translation from "@/types/translation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function useTranslationHistory(
  filter: "all" | "word" | "phrase"
) {
  const [history, setHistory] = useState<Translation[]>([]);
  const [localHistory, setLocalHistory] = useState<Translation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchAll = async () => {
      if (status !== "authenticated") return;
      try {
        setIsLoading(true);
        const res = await fetch(`/api/translation/history?filter=${filter}`);
        if (!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        setHistory(data);
        console.log("data in useTranslationHistory", data.length);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, [filter, status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      const local = localStorage.getItem("lasu-history");
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) setLocalHistory(parsed);
      }
      setIsLoading(false);
    }
  }, [status]);

  const filteredLocalHistory =
    filter === "all"
      ? localHistory
      : localHistory.filter((item) => item.translationType === filter);

  const displayHistory =
    status === "authenticated" ? history : filteredLocalHistory;

  const handleDelete = async (itemId: string) => {
    if (status === "authenticated") {
      await fetch(`/api/translation/history/${itemId}`, { method: "DELETE" });
      setHistory((prev) => prev.filter((i) => i._id !== itemId));
    } else {
      const updated = localHistory.filter((i) => i._id !== itemId);
      setLocalHistory(updated);
      localStorage.setItem("lasu-history", JSON.stringify(updated));
    }
  };

  return {
    displayHistory,
    isLoading,
    isError,
    handleDelete,
    session,
    status,
  };
}
