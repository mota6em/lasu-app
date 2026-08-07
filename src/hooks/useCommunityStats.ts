import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export type CommunityTab = "learners" | "words" | "languages";
export type CommunityPeriod = "daily" | "monthly" | "allTime";

async function fetchCommunityStats() {
  const res = await fetch("/api/community/stats");
  if (!res.ok) throw new Error("Failed to fetch community stats");
  const json = await res.json();
  return json.data;
}

export function useCommunityStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["community-stats"],
    queryFn: fetchCommunityStats,
  });

  const [tab, setTab] = useState<CommunityTab>("learners");
  const [period, setPeriod] = useState<CommunityPeriod>("daily");

  return {
    stats,
    tab,
    setTab,
    period,
    setPeriod,
    shouldShowSkeleton: isLoading && !stats,
  };
}
