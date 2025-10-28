import { useEffect, useState } from "react";

export function useCommunityStats() {
  const [loadingStats, setLoadingStats] = useState(true);
  const [stats, setStats] = useState<any | null>(null);

  // ui toggles
  const [showTopLearnersTable, setShowTopLearnersTable] = useState(false);
  const [showTopWordsTable, setShowTopWordsTable] = useState(false);
  const [showTopLangsTable, setShowTopLangsTable] = useState(false);
  const showTables = {
    showTopLearnersTable,
    showTopWordsTable,
    showTopLangsTable,
  };

  async function fetchStats() {
    try {
      setLoadingStats(true);
      const res = await fetch("/api/community/stats");
      const json = await res.json();
      const data = json.data;
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  }
  //auto first fetch
  useEffect(() => {
    fetchStats();
  }, []);
  const handleShowWords = () => {
    setShowTopWordsTable((v) => {
      const nv = !v;
      if (nv) {
        setShowTopLearnersTable(false);
        setShowTopLangsTable(false);
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
      }
      return nv;
    });
  };

  const shouldShowSkeleton = loadingStats && !stats;

  return {
    stats,
    handleShowWords,
    handleShowLangs,
    handleShowLearners,
    showTables,
    shouldShowSkeleton,
  };
}
