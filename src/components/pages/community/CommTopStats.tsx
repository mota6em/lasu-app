"use client";
import UserRanks from "./UserRanks";
import React from "react";
import { useCommunityStats } from "@/hooks/useCommunityStats";
import StatsButtons from "./StatsButtons";
import StatsSection from "./StatsSection";
import LearnersLeaderboard from "./LearnersLeaderboard";

const CommTopStats = ({ userId }: { userId: string }) => {
  const {
    showTopLearnersTable,
    showTopWordsTable,
    showTopLangsTable,
    topDay,
    loadingDay,
    topMonth,
    loadingMonth,
    topAllTime,
    loadingAll,
    stats,
    handleShowWords,
    handleShowLangs,
    handleShowLearners,
    prefetchStats,
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
          prefetchStats={prefetchStats}
        />
      </div>

      <div className="flex flex-col items-center justify-center gap-y-8">
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
      </div>

      {showTopLearnersTable && (
        <LearnersLeaderboard
          topDay={topDay}
          loadingDay={loadingDay}
          topMonth={topMonth}
          loadingMonth={loadingMonth}
          topAllTime={topAllTime}
          loadingAll={loadingAll}
        />
      )}
    </>
  );
};

export default CommTopStats;
