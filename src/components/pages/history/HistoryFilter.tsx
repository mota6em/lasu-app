"use client";

import { cn } from "@/lib/utils";

interface HistoryFilterProps {
  filter: "all" | "word" | "phrase";
  setFilter: (filter: "all" | "word" | "phrase") => void;
}

const HistoryFilter = ({ filter, setFilter }: HistoryFilterProps) => {
  return (
    <div className="flex gap-2 px-0 ms-8">
      {["all", "word", "phrase"].map((f: string) => (
        <button
          key={f}
          onClick={() => setFilter(f as "all" | "word" | "phrase")}
          className={cn(
            "px-3 py-1 rounded-md border font-medium transition cursor-pointer",
            filter === f
              ? "bg-slate-900 text-white dark:bg-gray-600 dark:text-white hover:brightness-90"
              : "bg-gray-100 text-gray-700 border-gray-300 dark:bg-zinc-800 dark:text-gray-300 dark:border-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-700 hover:text-gray-900 dark:hover:text-white"
          )}
        >
          {f === "all" ? "All" : f === "word" ? "Words" : "Phrases"}
        </button>
      ))}
    </div>
  );
};

export default HistoryFilter;
