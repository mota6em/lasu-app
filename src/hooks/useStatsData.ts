import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Translation from "@/types/translation";
import { useTranslationStats } from "./useTranslationStats";

type TopLangPair = [string, number];

export function useStatsData() {
  const { data: session, status } = useSession();
  const { data: stats, isLoading: statsLoading } = useTranslationStats(
    session?.user?.id
  );
  const [localTopLangs, setLocalTopLangs] = useState<TopLangPair[] | null>(
    null
  );
  const [localDailySeries, setLocalDailySeries] = useState<
    { date: string; count: number }[] | null
  >(null);
  const [localHistory, setLocalHistory] = useState<Translation[]>([]);

  useEffect(() => {
    if (session?.user?.id) return;
    if (status === "loading") return;

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
    setLocalTopLangs(top);

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
    setLocalDailySeries(series);
  }, [session, status]);

  const isLoading =
    status === "loading" || (!!session?.user?.id && statsLoading);
  const topLangs = session?.user?.id ? stats?.topLangs ?? [] : localTopLangs ?? [];
  const dailySeries = session?.user?.id
    ? stats?.dailySeries ?? []
    : localDailySeries ?? [];

  return { topLangs, dailySeries, localHistory, isLoading };
}
