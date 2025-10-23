import { useState } from "react";
import { useTopLearners } from "./useTopLearners";

interface StatItem {
  _id: string;
  count: number;
}

export interface Stats {
  daily: { words: StatItem[]; languages: StatItem[] };
  monthly: { words: StatItem[]; languages: StatItem[] };
  allTime: { words: StatItem[]; languages: StatItem[] };
}

export function useCommunityStats() {
  const [showTopLearnersTable, setShowTopLearnersTable] = useState(false);
  const [showTopWordsTable, setShowTopWordsTable] = useState(false);
  const [showTopLangsTable, setShowTopLangsTable] = useState(false);
  const { learners: topDay, loading: loadingDay } = useTopLearners(
    showTopLearnersTable ? "daily" : null
  );
  const { learners: topMonth, loading: loadingMonth } = useTopLearners(
    showTopLearnersTable ? "monthly" : null
  );
  const { learners: topAllTime, loading: loadingAll } = useTopLearners(
    showTopLearnersTable ? "allTime" : null
  );
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const fetchStats = async () => {
    if (loadingStats) return;
    try {
      setLoadingStats(true);
      const res = await fetch("/api/community/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleShowWords = () => {
    setShowTopWordsTable(!showTopWordsTable);
    setShowTopLearnersTable(false);
    setShowTopLangsTable(false);
    if (!stats) fetchStats();
  };

  const handleShowLangs = () => {
    setShowTopLangsTable(!showTopLangsTable);
    setShowTopLearnersTable(false);
    setShowTopWordsTable(false);
    if (!stats) fetchStats();
  };

  const handleShowLearners = () => {
    setShowTopLearnersTable(!showTopLearnersTable);
    setShowTopWordsTable(false);
    setShowTopLangsTable(false);
  };

  const prefetchStats = () => {
    if (!stats && !loadingStats) fetchStats();
  };

  const shouldShowSkeleton =
    (showTopWordsTable || showTopLangsTable) && loadingStats && !stats;

  return {
    showTopLearnersTable,
    setShowTopLearnersTable,
    showTopWordsTable,
    setShowTopWordsTable,
    showTopLangsTable,
    setShowTopLangsTable,
    topDay,
    loadingDay,
    topMonth,
    loadingMonth,
    topAllTime,
    loadingAll,
    stats,
    setStats,
    loadingStats,
    setLoadingStats,
    fetchStats,
    handleShowWords,
    handleShowLangs,
    handleShowLearners,
    prefetchStats,
    shouldShowSkeleton,
  };
}
