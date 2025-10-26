import { useEffect, useState } from "react";

export function useCommunityStats() {
  const [loadingStats, setLoadingStats] = useState(true);
  const [stats, setStats] = useState<any | null>(null);

  // ui toggles
  const [showTopLearnersTable, setShowTopLearnersTable] = useState(false);
  const [showTopWordsTable, setShowTopWordsTable] = useState(false);
  const [showTopLangsTable, setShowTopLangsTable] = useState(false);

  // derived leaderboards
  const [topDay, setTopDay] = useState<any[]>([]);
  const [topMonth, setTopMonth] = useState<any[]>([]);
  const [topAllTime, setTopAllTime] = useState<any[]>([]);

  async function fetchStats() {
    try {
      setLoadingStats(true);
      const res = await fetch("/api/community/stats");
      const json = await res.json();
      const data = json.data;
      setStats(data);

      // learners tables
      setTopDay(data.daily.learners || []);
      setTopMonth(data.monthly.learners || []);
      setTopAllTime(data.allTime.learners || []);

      // words tables
      setTopDay(data.daily.words || []);
      setTopMonth(data.monthly.words || []);
      setTopAllTime(data.allTime.words || []);

      // languages tables
      setTopDay(data.daily.languages || []);
      setTopMonth(data.monthly.languages || []);
      setTopAllTime(data.allTime.languages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  }

  // lazy-load stats only on first open of ANY stats section
  const ensureStatsLoaded = () => {
    if (!stats && !loadingStats) {
      fetchStats();
    }
  };

  const handleShowWords = () => {
    setShowTopWordsTable((v) => {
      const nv = !v;
      if (nv) {
        setShowTopLearnersTable(false);
        setShowTopLangsTable(false);
        ensureStatsLoaded();
      }
      return nv;
    });
  };

  const handleShowLangs = () => {
    setShowTopLangsTable((v) => {
      const nv = !v;
      if (nv) {
        setShowTopLearnersTable(false);
        setShowTopWordsTable(false);
        ensureStatsLoaded();
      }
      return nv;
    });
  };

  const handleShowLearners = () => {
    setShowTopLearnersTable((v) => {
      const nv = !v;
      if (nv) {
        setShowTopWordsTable(false);
        setShowTopLangsTable(false);
        ensureStatsLoaded();
      }
      return nv;
    });
  };

  const shouldShowSkeleton =
    (showTopWordsTable || showTopLangsTable || showTopLearnersTable) &&
    loadingStats &&
    !stats;

  return {
    showTopLearnersTable,
    showTopWordsTable,
    showTopLangsTable,
    topDay,
    topMonth,
    topAllTime,
    stats,
    loadingStats,
    handleShowWords,
    handleShowLangs,
    handleShowLearners,
    shouldShowSkeleton,
  };
}
