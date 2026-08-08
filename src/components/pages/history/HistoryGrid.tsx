"use client";

import { useLocale, useTranslations } from "next-intl";
import HistoryCard from "./HistoryCard";
import { groupByDay } from "@/lib/format";
import Translation from "@/types/translation";

type HistoryGridProps = {
  displayHistory: Translation[];
  onDelete: (itemId: string) => void;
};

export default function HistoryGrid({ displayHistory, onDelete }: HistoryGridProps) {
  const t = useTranslations("history");
  const locale = useLocale();
  const groups = groupByDay(displayHistory, (item) => item.createdAt, locale);

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.label}>
          <div className="mb-3 flex items-center gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {group.key ? t(group.key) : group.label}
            </h2>
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs tabular-nums text-muted-foreground">
              {group.entries.length}
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {group.entries.map((item) => (
              <HistoryCard key={item._id} item={item} onDelete={onDelete} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
