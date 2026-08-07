"use client";

import { motion } from "framer-motion";
import { getLanguage } from "@/lib/languages";

interface StatsSectionProps {
  items: { _id: string; count: number }[];
  loading: boolean;
  emptyLabel: string;
}

export default function StatsSection({
  items,
  loading,
  emptyLabel,
}: StatsSectionProps) {
  if (loading) {
    return (
      <div className="grid gap-2 sm:grid-cols-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="shimmer h-11 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">{emptyLabel}</p>
    );
  }

  const max = items[0]?.count || 1;

  return (
    <ol className="grid gap-2 sm:grid-cols-2">
      {items.slice(0, 20).map((item, index) => {
        const meta = getLanguage(item._id);
        const label = meta
          ? meta.name
          : item._id.charAt(0).toUpperCase() + item._id.slice(1);

        return (
          <motion.li
            key={item._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02, duration: 0.3 }}
            className="relative flex items-center gap-3 overflow-hidden rounded-lg border border-border bg-surface px-3 py-2.5"
          >
            <span
              aria-hidden
              className="absolute inset-y-0 start-0 bg-brand-500/8"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
            <span className="relative w-6 shrink-0 text-center font-mono text-[11px] tabular-nums text-muted-foreground">
              {index + 1}
            </span>
            <span className="relative flex-1 truncate text-sm font-medium">
              {meta && <span aria-hidden className="me-1.5">{meta.flag}</span>}
              {label}
            </span>
            <span className="relative shrink-0 font-mono text-xs tabular-nums text-brand-700 dark:text-brand-400">
              ×{item.count}
            </span>
          </motion.li>
        );
      })}
    </ol>
  );
}
