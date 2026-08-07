"use client";

import { useMemo } from "react";
import { dayKey, type DayPoint } from "@/lib/series";
import { cn } from "@/lib/utils";

const WEEKS = 18;
const LEVEL_CLASS = [
  "bg-surface-3",
  "bg-brand-500/25",
  "bg-brand-500/45",
  "bg-brand-500/70",
  "bg-brand-500",
];

export default function ActivityHeatmap({ series }: { series: DayPoint[] }) {
  const { weeks, monthLabels, max } = useMemo(() => {
    const counts = new Map(series.map((point) => [point.date, point.count]));
    const max = Math.max(...series.map((p) => p.count), 1);

    const end = new Date();
    end.setHours(0, 0, 0, 0);
    // walk back to the most recent Sunday so every column is a full week
    end.setDate(end.getDate() + (6 - end.getDay()));

    const weeks: { date: Date; count: number }[][] = [];
    const monthLabels: { index: number; label: string }[] = [];
    let lastMonth = -1;

    for (let w = WEEKS - 1; w >= 0; w--) {
      const column: { date: Date; count: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const day = new Date(end);
        day.setDate(end.getDate() - (w * 7 + (6 - d)));
        column.push({ date: day, count: counts.get(dayKey(day)) ?? 0 });
      }

      const columnIndex = WEEKS - 1 - w;
      const month = column[0].date.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({
          index: columnIndex,
          label: column[0].date.toLocaleDateString(undefined, { month: "short" }),
        });
        lastMonth = month;
      }

      weeks.push(column);
    }

    return { weeks, monthLabels, max };
  }, [series]);

  const level = (count: number) => {
    if (!count) return 0;
    return Math.min(4, Math.ceil((count / max) * 4));
  };

  return (
    <div className="overflow-x-auto pb-1">
      <div className="min-w-max">
        <div className="mb-1.5 flex gap-1">
          {weeks.map((_, index) => {
            const label = monthLabels.find((m) => m.index === index);
            return (
              <span
                key={index}
                className="w-3.5 text-[9px] leading-none text-muted-foreground"
              >
                {label?.label ?? ""}
              </span>
            );
          })}
        </div>

        <div className="flex gap-1">
          {weeks.map((column, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {column.map(({ date, count }) => {
                const future = date.getTime() > Date.now();
                return (
                  <span
                    key={date.toISOString()}
                    title={
                      future
                        ? ""
                        : `${count} on ${date.toLocaleDateString(undefined, {
                            day: "numeric",
                            month: "short",
                          })}`
                    }
                    className={cn(
                      "h-3.5 w-3.5 rounded-[3px] transition-colors",
                      future ? "bg-transparent" : LEVEL_CLASS[level(count)]
                    )}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
          <span>Less</span>
          {LEVEL_CLASS.map((tone) => (
            <span key={tone} className={cn("h-3 w-3 rounded-[3px]", tone)} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
