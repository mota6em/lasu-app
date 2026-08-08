"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import HistoryFilter from "@/components/pages/history/HistoryFilter";
import AuthAlert from "@/components/pages/history/AuthAlert";
import HistoryEmptyState from "@/components/pages/history/HistoryEmptyState";
import HistorySkeletonGrid from "@/components/pages/history/HistorySkeletonGrid";
import HistoryGrid from "@/components/pages/history/HistoryGrid";
import useTranslationHistory from "@/hooks/useTranslationHistory";

export default function HistoryPage() {
  const [filter, setFilter] = useState<"all" | "word" | "phrase">("all");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const { displayHistory, isLoading, isError, handleDelete, session, status } =
    useTranslationHistory(filter);

  const filteredHistory = useMemo(() => {
    const term = deferredSearch.trim().toLowerCase();
    if (!term) return displayHistory;

    return displayHistory.filter((item) => {
      if (item.sourceText?.toLowerCase().includes(term)) return true;
      const values = Object.values(item.result?.translations ?? {}).join(" ");
      return values.toLowerCase().includes(term);
    });
  }, [displayHistory, deferredSearch]);

  return (
    <div className="space-y-6">
      {!session && status === "unauthenticated" && <AuthAlert />}

      <header className="animate-fade-up">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          History
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {isLoading
            ? "Loading your saved translations…"
            : `${displayHistory.length} translation${
                displayHistory.length === 1 ? "" : "s"
              } saved and searchable.`}
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search words, phrases or translations…"
            className="h-10 w-full rounded-lg border border-border bg-surface ps-9 pe-9 text-sm outline-none transition-colors focus:border-brand-400"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute end-2 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <HistoryFilter filter={filter} setFilter={setFilter} />
      </div>

      {isError ? (
        <div className="surface-card border-destructive/30 bg-destructive/5 p-5">
          <p className="text-sm font-medium text-destructive">
            Could not load your history.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Check your connection and refresh the page.
          </p>
        </div>
      ) : isLoading ? (
        <HistorySkeletonGrid />
      ) : filteredHistory.length === 0 ? (
        <HistoryEmptyState query={deferredSearch.trim()} />
      ) : (
        <HistoryGrid displayHistory={filteredHistory} onDelete={handleDelete} />
      )}
    </div>
  );
}
