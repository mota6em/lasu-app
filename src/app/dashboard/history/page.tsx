"use client";
import { useEffect, useMemo, useState } from "react";
import HistoryFilter from "@/components/pages/history/HistoryFilter";
import AuthAlert from "@/components/pages/history/AuthAlert";
import ScrollToTop from "@/components/fixedComponents/ScrollToTop";
import useTranslationHistory from "@/hooks/useTranslationHistory";
import HistoryEmptyState from "@/components/pages/history/HistoryEmptyState";
import HistorySkeletonGrid from "@/components/pages/history/HistorySkeletonGrid";
import HistoryGrid from "@/components/pages/history/HistoryGrid";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
export default function HistoryPage() {
  const [filter, setFilter] = useState<"all" | "word" | "phrase">("all");
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const { displayHistory, isLoading, isError, handleDelete, status, session } =
    useTranslationHistory(filter);
  function useDebouncedValue<T>(value: T, delay = 150) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
      const timer = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
  }
  const handleSearch = () => {
    setAppliedSearch(search.trim());
  };


  const filteredHistory = useMemo(() => {
    if (!appliedSearch) return displayHistory;
    const lower = appliedSearch.toLowerCase();
    return displayHistory.filter(
      (item) =>
        item.sourceText?.toLowerCase().includes(lower) ||
        Object.values(item.result?.translations ?? {})
          .join(" ")
          .toLowerCase()
          .includes(lower)
    );
  }, [displayHistory, appliedSearch]);

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

      <div className="px-0 mb-1 mt-5 ms-8">
        <p className="text-sm text-muted-foreground">Filter translations:</p>
      </div>
      <div className="flex flex-col md:flex-row md:items-start justify-around px-3 md:px-0 mb-4 mt-5 gap-3">
        <HistoryFilter filter={filter} setFilter={setFilter} />
        <div className="relative w-full max-w-xl">
          <Search
            onClick={handleSearch}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer hover:text-yellow-400 transition"
          />

          <Input
            type="text"
            placeholder={`Search ${displayHistory.length} translations`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full bg-[#3b3b3b] border border-[#4a4a4a] text-gray-100 pl-10 pr-24 py-2 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
          />
        </div>
      </div>

      {(status === "loading" || (status === "authenticated" && isLoading)) && (
        <HistorySkeletonGrid />
      )}
      {filteredHistory.length === 0 && status !== "loading" && (
        <HistoryEmptyState />
      )}
      {!(status === "loading" || (status === "authenticated" && isLoading)) && (
        <HistoryGrid displayHistory={filteredHistory} onDelete={handleDelete} />
      )}
      <ScrollToTop />
    </>
  );
}
