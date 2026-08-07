import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

async function fetchCommunityStats() {
  const res = await fetch("/api/community/stats");
  if (!res.ok) throw new Error("Failed to fetch community stats");
  const json = await res.json();
  return json.data;
}

export function useCommunityStats() {
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["community-stats"],
    queryFn: fetchCommunityStats,
  });

  // ui toggles
  const [showTopLearnersTable, setShowTopLearnersTable] = useState(false);
  const [showTopWordsTable, setShowTopWordsTable] = useState(false);
  const [showTopLangsTable, setShowTopLangsTable] = useState(false);
  const showTables = {
    showTopLearnersTable,
    showTopWordsTable,
    showTopLangsTable,
  };

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
