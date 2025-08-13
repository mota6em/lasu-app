"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { availableLanguages } from "@/lib/languages";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";
import Translation from "@/types/translation";
import { OverviewCards } from "@/components/OverviewCards";
import { Skeleton } from "@/components/ui/skeleton";

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

  const chartData = dailySeries;

  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  function useIsMobile() {
    const [m, setM] = useState(false);
    useEffect(() => {
      const q = matchMedia("(max-width: 640px)");
      const h = () => setM(q.matches);
      h();
      q.addEventListener("change", h);
      return () => q.removeEventListener("change", h);
    }, []);
    return m;
  }
  const isMobile = useIsMobile();
  return (
    <div className="px-4 md:px-6 py-8 max-w-6xl mx-auto space-y-10">
      <h1 className="text-2xl md:text-4xl font-extrabold text-center tracking-tight">
        📊 Your Language Stats
      </h1>
      <div className="bg-white dark:bg-muted/20 px-2 py-4 md:p-6 rounded-xl shadow-sm border">
        <h2 className="text-lg md:text-xl font-medium mb-4">
          📈 Daily Translation Activity
        </h2>
        {isLoading && <Skeleton className="h-72 w-full rounded-md" />}
        {!isLoading && (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={
                isMobile
                  ? { top: 2, right: 2, left: 0, bottom: 0 }
                  : { top: 10, right: 30, left: 0, bottom: 0 }
              }
            >
              <Line
                type="monotone"
                dataKey="count"
                stroke={isDark ? "#93C5FD" : "#4F46E5"}
                strokeWidth={2}
              />
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#444" : "#ccc"}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: isMobile ? 10 : 12 }}
                interval={isMobile ? "preserveStartEnd" : 0}
                stroke={isDark ? "#aaa" : "#333"}
              />
              <YAxis
                tick={{ fontSize: isMobile ? 10 : 12 }}
                stroke={isDark ? "#aaa" : "#333"}
                hide={isMobile}
              />{" "}
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#1f2937" : "#fff", // bg-zinc-800
                  border: "none",
                  borderRadius: 8,
                  fontSize: 12,
                  color: isDark ? "#fff" : "#000",
                }}
                labelStyle={{ color: isDark ? "#ccc" : "#333" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4 -ml-2.5">🌟 Top Languages</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Card
                  key={i}
                  className="bg-gradient-to-tr from-blue-100 via-white to-purple-100 dark:from-muted dark:via-muted/20 dark:to-muted/10"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Skeleton className="h-5 w-32" /> {/* Language name */}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-12 mb-2" /> {/* Count */}
                    <Skeleton className="h-4 w-20" /> {/* "translations" */}
                  </CardContent>
                </Card>
              ))
            : topLangs.slice(0, 3).map(([lang, count]) => (
                <Card
                  key={lang}
                  className="bg-gradient-to-tr from-blue-100 via-white to-purple-100 dark:from-muted dark:via-muted/20 dark:to-muted/10"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {availableLanguages.find((l) => l.value === lang)
                        ?.label || lang}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-primary">{count}</p>
                    <p className="text-muted-foreground text-sm">
                      translations
                    </p>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
      <OverviewCards />
    </div>
  );
}
