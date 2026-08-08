"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Flame, Trophy } from "lucide-react";
import { OverviewCards } from "@/components/pages/home/OverviewCards";
import TopLangsSec from "@/components/pages/community/TopLangsSec";
import ActivityHeatmap from "@/components/pages/stats/ActivityHeatmap";
import DailyTranslationsChart from "@/components/pages/stats/DailyTranslationsChart";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useStatsData } from "@/hooks/useStatsData";
import { busiestDay, currentStreak, fillDays } from "@/lib/series";
import { cn } from "@/lib/utils";

const RANGES = [
  { days: 7, key: "range7" },
  { days: 30, key: "range30" },
  { days: 90, key: "range90" },
] as const;

function Panel({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="surface-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3.5">
        <div>
          <h2 className="font-display text-base font-semibold">{title}</h2>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export default function StatsPage() {
  const t = useTranslations("stats");
  const { topLangs, dailySeries, isLoading } = useStatsData();
  const [range, setRange] = useState(30);
  const isMobile = useIsMobile();

  const chartData = useMemo(() => fillDays(dailySeries, range), [dailySeries, range]);
  const heatmapSeries = useMemo(() => fillDays(dailySeries, 126), [dailySeries]);
  const streak = useMemo(() => currentStreak(dailySeries), [dailySeries]);
  const best = useMemo(() => busiestDay(fillDays(dailySeries, 365)), [dailySeries]);

  return (
    <div className="space-y-6">
      <header className="animate-fade-up">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{t("subtitle")}</p>
      </header>

      <OverviewCards />

      <Panel
        title={t("dailyTitle")}
        subtitle={t("dailySubtitle")}
        action={
          <div className="inline-flex items-center gap-0.5 rounded-lg border border-border bg-surface-2 p-0.5">
            {RANGES.map((option) => (
              <button
                key={option.days}
                onClick={() => setRange(option.days)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  range === option.days
                    ? "bg-surface text-foreground shadow-[var(--shadow-soft)]"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t(option.key)}
              </button>
            ))}
          </div>
        }
      >
        {isLoading ? (
          <div className="shimmer h-64 w-full rounded-lg" />
        ) : (
          <DailyTranslationsChart chartData={chartData} isMobile={isMobile} />
        )}
      </Panel>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <Panel title={t("consistencyTitle")} subtitle={t("consistencySubtitle")}>
          {isLoading ? (
            <div className="shimmer h-32 w-full rounded-lg" />
          ) : (
            <>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/25 bg-brand-500/10 px-2.5 py-1 text-xs font-medium">
                  <Flame className="h-3.5 w-3.5 text-brand-500" />
                  {t("streakInARow", { count: streak })}
                </span>
                {best && best.count > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    <Trophy className="h-3.5 w-3.5" />
                    {t("bestDay", { count: best.count })}
                  </span>
                )}
              </div>
              <ActivityHeatmap series={heatmapSeries} />
            </>
          )}
        </Panel>

        <Panel title={t("topLanguagesTitle")} subtitle={t("topLanguagesSubtitle")}>
          <TopLangsSec topLangs={topLangs} isLoading={isLoading} />
        </Panel>
      </div>
    </div>
  );
}
