"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Translation from "@/types/translation";
import { OverviewCards } from "@/components/OverviewCards";
import { Skeleton } from "@/components/ui/skeleton";
import TopLangsSec from "@/components/TopLangsSec";
import DailyTranslationsChart from "@/components/DailyTranslationsChart";
import { useIsMobile } from "@/hooks/useIsMobile";

type TopLangPair = [string, number];

export default function StatsPage() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const [topLangs, setTopLangs] = useState<TopLangPair[]>([]);
  const [dailySeries, setDailySeries] = useState<
    { date: string; count: number }[]
  >([]);
  const [localHistory, setLocalHistory] = useState<Translation[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.id) {
        const res = await fetch("/api/translation/history?wantStats=1");
        const data = await res.json();
        setTopLangs(data.topLangs || []);
        setDailySeries(data.dailySeries || []);
      } else {
        const raw = localStorage.getItem("lasu-history");
        const parsed: Translation[] = raw ? JSON.parse(raw) : [];
        setLocalHistory(parsed);

        // ---- build Top Languages from local ----
        const langCount: Record<string, number> = {};
        for (const t of parsed) {
          for (const [lang] of Object.entries(t.result?.translations ?? {})) {
            langCount[lang] = (langCount[lang] || 0) + 1;
          }
        }
        const top = (Object.entries(langCount) as [string, number][]).sort(
          (a, b) => b[1] - a[1]
        );
        setTopLangs(top);

        // ---- build Daily Series from local ----
        const dayCount: Record<string, number> = {};
        for (const t of parsed) {
          const d = new Date(t.createdAt);
          const key =
            `${d.getFullYear()}-` +
            `${String(d.getMonth() + 1).padStart(2, "0")}-` +
            `${String(d.getDate()).padStart(2, "0")}`;
          dayCount[key] = (dayCount[key] || 0) + 1;
        }
        const series = Object.entries(dayCount)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date));
        setDailySeries(series);
      }
    };
    fetchData();
  }, [session, status]);

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
