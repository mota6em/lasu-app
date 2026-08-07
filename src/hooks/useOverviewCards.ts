"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Translation from "@/types/translation";
import { LOCAL_HISTORY_EVENT, readLocalHistory } from "@/lib/localHistory";
import { useTranslationStats } from "./useTranslationStats";

export interface OverviewData {
  total: number;
  thisWeek: number;
  lastWeek: number;
  mostUsedLang: string | null;
  dailySeries: { date: string; count: number }[];
  topLangs: [string, number][];
}

const EMPTY: OverviewData = {
  total: 0,
  thisWeek: 0,
  lastWeek: 0,
  mostUsedLang: null,
  dailySeries: [],
  topLangs: [],
};

const DAY = 86_400_000;

function dayKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function buildFromLocal(history: Translation[]): OverviewData {
  const now = Date.now();
  const langCount: Record<string, number> = {};
  const dayCount: Record<string, number> = {};
  let thisWeek = 0;
  let lastWeek = 0;

  for (const item of history) {
    const time = new Date(item.createdAt).getTime();
    if (time > now - 7 * DAY) thisWeek += 1;
    else if (time > now - 14 * DAY) lastWeek += 1;

    for (const lang of Object.keys(item.result?.translations ?? {})) {
      langCount[lang] = (langCount[lang] || 0) + 1;
    }

    const key = dayKey(new Date(item.createdAt));
    dayCount[key] = (dayCount[key] || 0) + 1;
  }

  const topLangs = (Object.entries(langCount) as [string, number][]).sort(
    (a, b) => b[1] - a[1]
  );

  return {
    total: history.length,
    thisWeek,
    lastWeek,
    mostUsedLang: topLangs[0]?.[0] ?? null,
    topLangs,
    dailySeries: Object.entries(dayCount)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date)),
  };
}

export function useOverviewCards() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const { data: stats, isLoading: statsLoading } = useTranslationStats(userId);
  const [localHistory, setLocalHistory] = useState<Translation[] | null>(null);

  useEffect(() => {
    if (userId || status === "loading") return;

    const sync = () => setLocalHistory(readLocalHistory());
    sync();

    window.addEventListener(LOCAL_HISTORY_EVENT, sync);
    return () => window.removeEventListener(LOCAL_HISTORY_EVENT, sync);
  }, [userId, status]);

  const data = useMemo<OverviewData>(() => {
    if (userId) {
      if (!stats) return EMPTY;

      const series = stats.dailySeries ?? [];
      const now = Date.now();
      const inRange = (from: number, to: number) =>
        series
          .filter((d) => {
            const time = new Date(d.date).getTime();
            return time > now - from * DAY && time <= now - to * DAY;
          })
          .reduce((sum, d) => sum + d.count, 0);

      return {
        total: stats.totalTranslations ?? 0,
        thisWeek: stats.thisWeekCount ?? 0,
        lastWeek: inRange(14, 7),
        mostUsedLang: stats.mostUsedLang?.lang ?? stats.mostUsedLang?._id ?? null,
        topLangs: stats.topLangs ?? [],
        dailySeries: series,
      };
    }

    return localHistory ? buildFromLocal(localHistory) : EMPTY;
  }, [userId, stats, localHistory]);

  const isLoading =
    status === "loading" ||
    (!!userId && statsLoading) ||
    (!userId && localHistory === null);

  return { data, isLoading };
}
