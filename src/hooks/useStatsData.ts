import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Translation from "@/types/translation";

type TopLangPair = [string, number];

export function useStatsData() {
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
  return { topLangs, dailySeries, localHistory, isLoading };
}
