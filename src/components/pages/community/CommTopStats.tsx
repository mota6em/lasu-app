"use client";
import { FaClock, FaCalendarAlt, FaTrophy } from "react-icons/fa";
import RenderSection from "./RenderSection";
import UserRanks from "./UserRanks";
import React from "react";
import { useCommunityStats } from "@/hooks/useCommunityStats";
import StatsButtons from "./StatsButtons";
import StatsSection from "./StatsSection";

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
        <div className="mt-6 mx-2 md:mx-0 p-6 bg-gray-100 dark:bg-purple-900/5 rounded-2xl shadow-lg text-black dark:text-white">
          <div className="flex flex-col lg:flex-row gap-6">
            {RenderSection("Top Today", <FaClock />, topDay, loadingDay)}
            {RenderSection(
              "Top This Month",
              <FaCalendarAlt />,
              topMonth,
              loadingMonth
            )}
            {RenderSection(
              "Top All Time",
              <FaTrophy />,
              topAllTime,
              loadingAll
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CommTopStats;
