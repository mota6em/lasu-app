"use client";

import { motion } from "framer-motion";
import { getLanguage } from "@/lib/languages";

interface TopLangsSecProps {
  topLangs: [string, number][];
  isLoading: boolean;
  limit?: number;
}

export default function TopLangsSec({
  topLangs,
  isLoading,
  limit = 6,
}: TopLangsSecProps) {
  if (isLoading) {
    return (
      <div className="space-y-2.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="shimmer h-10 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!topLangs.length) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Translate into a few languages and they will rank up here.
      </p>
    );
  }

  const rows = topLangs.slice(0, limit);
  const max = rows[0][1] || 1;

  return (
    <div className="space-y-2.5">
      {rows.map(([lang, count], index) => {
        const meta = getLanguage(lang);
        return (
          <div key={lang} className="flex items-center gap-3">
            <span className="w-6 shrink-0 text-center text-base" aria-hidden>
              {meta?.flag ?? "🌐"}
            </span>
            <span className="w-24 shrink-0 truncate text-sm font-medium sm:w-32">
              {meta?.name ?? lang}
            </span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(count / max) * 100}%` }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400"
              />
            </div>
            <span className="w-8 shrink-0 text-end font-mono text-xs tabular-nums text-muted-foreground">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
