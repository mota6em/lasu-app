"use client";

import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import useTranslationHistory from "@/hooks/useTranslationHistory";
import { getLanguage } from "@/lib/languages";

export default function RecentWords() {
  const { displayHistory, isLoading } = useTranslationHistory("all");
  const recent = displayHistory.slice(0, 8);

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-hidden">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="shimmer h-9 w-28 shrink-0 rounded-full" />
        ))}
      </div>
    );
  }

  if (!recent.length) return null;

  return (
    <section>
      <div className="mb-2.5 flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          Picked up recently
        </h2>
        <Link
          href="/dashboard/history"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          All history
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {recent.map((item) => {
          const langs = Object.keys(item.result?.translations ?? {});
          return (
            <Link
              key={item._id}
              href={`/dashboard?text=${encodeURIComponent(item.sourceText)}`}
              className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 text-sm transition-all hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-[var(--shadow-soft)]"
            >
              <span className="max-w-40 truncate font-medium">{item.sourceText}</span>
              <span className="flex items-center -space-x-1" aria-hidden>
                {langs.slice(0, 3).map((lang) => (
                  <span key={lang} className="text-xs">
                    {getLanguage(lang)?.flag ?? "🌐"}
                  </span>
                ))}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
