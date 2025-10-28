"use client";
import React from "react";
import UserRanks from "./UserRanks";
import { useCommunityStats } from "@/hooks/useCommunityStats";
import StatsButtons from "./StatsButtons";
import StatsSection from "./StatsSection";
import LearnersLeaderboard from "./LearnersLeaderboard";

const CommTopStats = ({ userId }: { userId: string }) => {
  const {
    showTables: { showTopLearnersTable, showTopWordsTable, showTopLangsTable },
    stats,
    handleShowWords,
    handleShowLangs,
    handleShowLearners,
    shouldShowSkeleton,
  } = useCommunityStats();

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <UserRanks userId={userId} />
        <StatsButtons
          showTopLearnersTable={showTopLearnersTable}
          showTopWordsTable={showTopWordsTable}
          showTopLangsTable={showTopLangsTable}
          handleShowLearners={handleShowLearners}
          handleShowWords={handleShowWords}
          handleShowLangs={handleShowLangs}
        />
      </div>

      {showTopLearnersTable && (
        <LearnersLeaderboard stats={stats} loading={shouldShowSkeleton} />
      )}

      {showTopWordsTable && (
        <StatsSection
          title="Top used Words"
          data={stats}
          type="words"
          loading={shouldShowSkeleton}
        />
      )}

      {showTopLangsTable && (
        <StatsSection
          title="Top used Languages"
          data={stats}
          type="languages"
          loading={shouldShowSkeleton}
        />
      )}
    </>
  );
};

export default CommTopStats;
