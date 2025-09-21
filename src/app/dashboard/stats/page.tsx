"use client";
import { OverviewCards } from "@/components/pages/home/OverviewCards";
import { Skeleton } from "@/components/ui/skeleton";
import TopLangsSec from "@/components/pages/community/TopLangsSec";
import DailyTranslationsChart from "@/components/DailyTranslationsChart";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useStatsData } from "@/hooks/useStatsData";

export default function StatsPage() {
  const { topLangs, dailySeries, isLoading } = useStatsData();
  const chartData = dailySeries.slice(-7);
  const isMobile = useIsMobile();
  return (
    <div className="px-4 md:px-6 py-8 max-w-6xl mx-auto space-y-10">
      <h1 className="text-2xl md:text-4xl font-extrabold text-center tracking-tight">
        📊 Your Language Stats
      </h1>
      <div className="bg-white dark:bg-muted/20 px-2 py-4 md:p-6 rounded-xl shadow-sm border">
        <h2 className="text-lg md:text-xl font-medium mb-4">
          📈 Your daily translation activity over the last week
        </h2>
        {isLoading && <Skeleton className="h-72 w-full rounded-md" />}
        {!isLoading && (
          <DailyTranslationsChart chartData={chartData} isMobile={isMobile} />
        )}
      </div>
      <TopLangsSec isLoading={isLoading} topLangs={topLangs} />
      <OverviewCards />
    </div>
  );
}
