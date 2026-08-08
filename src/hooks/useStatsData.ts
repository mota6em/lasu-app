import { useOverviewCards } from "./useOverviewCards";

export function useStatsData() {
  const { data, isLoading } = useOverviewCards();

  return {
    topLangs: data.topLangs,
    dailySeries: data.dailySeries,
    total: data.total,
    thisWeek: data.thisWeek,
    lastWeek: data.lastWeek,
    isLoading,
  };
}
