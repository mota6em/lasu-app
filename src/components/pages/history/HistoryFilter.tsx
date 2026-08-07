"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "all", label: "All" },
  { value: "word", label: "Words" },
  { value: "phrase", label: "Phrases" },
] as const;

interface HistoryFilterProps {
  filter: "all" | "word" | "phrase";
  setFilter: (filter: "all" | "word" | "phrase") => void;
}

export default function HistoryFilter({ filter, setFilter }: HistoryFilterProps) {
  return (
    <div className="inline-flex shrink-0 items-center gap-0.5 rounded-lg border border-border bg-surface-2 p-0.5">
      {OPTIONS.map((option) => {
        const active = filter === option.value;
        return (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={cn(
              "relative rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {active && (
              <motion.span
                layoutId="history-filter"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                className="absolute inset-0 rounded-md bg-surface shadow-[var(--shadow-soft)]"
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
