import { useOverviewCards } from "./useOverviewCards";

// stats and the overview cards read the same aggregate, so they share one source
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
