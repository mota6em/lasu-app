import { useQuery } from "@tanstack/react-query";

export interface TranslationStatsResponse {
  totalTranslations: number;
  thisWeekCount: number;
  langCount: Record<string, number>;
  mostUsedLang: { _id?: string; lang?: string; count: number } | null;
  topLangs: [string, number][];
  dailySeries: { date: string; count: number }[];
}

async function fetchTranslationStats(): Promise<TranslationStatsResponse> {
  const res = await fetch("/api/translation/history?wantStats=1");
  if (!res.ok) throw new Error("Failed to fetch translation stats");
  return res.json();
}

// shared across useOverviewCards/useStatsData so both dedupe into one request+cache entry
export function useTranslationStats(userId?: string) {
  return useQuery({
    queryKey: ["translation-stats", userId],
    queryFn: fetchTranslationStats,
    enabled: !!userId,
  });
}
