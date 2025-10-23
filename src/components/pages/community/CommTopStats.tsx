"use client";
import {
  FaClock,
  FaCalendarAlt,
  FaTrophy,
} from "react-icons/fa";
import RenderSection from "./RenderSection";
import UserRanks from "./UserRanks";
import React from "react";
import ExpandableList from "./ExpandableList";
import { FiTrendingUp } from "react-icons/fi";
import { useCommunityStats } from "@/hooks/useCommunityStats";
import StatsButtons from "./StatsButtons";

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
          <div className="w-full my-5">
            <h2 className="text-2xl font-bold text-center mb-5 flex items-center justify-center gap-x-2 ">
              <FiTrendingUp className="w-6 h-6 text-yellow-500 mt-1" />
              Top used Words
              <FiTrendingUp className="w-6 h-6 text-yellow-500 mt-1 -ms-1" />
            </h2>
            <div className="flex flex-col md:flex-row flex-wrap gap-4 items-center md:items-start justify-center">
              {stats ? (
                <>
                  <ExpandableList
                    title="Today"
                    items={stats.daily.words.map((w: any) => ({
                      word: w._id,
                      count: w.count,
                    }))}
                    loading={shouldShowSkeleton}
                  />
                  <ExpandableList
                    title="This Month"
                    items={stats.monthly.words.map((w: any) => ({
                      word: w._id,
                      count: w.count,
                    }))}
                    loading={shouldShowSkeleton}
                  />
                  <ExpandableList
                    title="All Time"
                    items={stats.allTime.words.map((w: any) => ({
                      word: w._id,
                      count: w.count,
                    }))}
                    loading={shouldShowSkeleton}
                  />
                </>
              ) : (
                <>
                  {[0, 1, 2].map((i) => (
                    <ExpandableList
                      key={i}
                      title="Loading..."
                      items={[]}
                      loading
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {showTopLangsTable && (
          <div className="w-full my-5">
            <h2 className="text-2xl font-bold text-center mb-5 flex items-center justify-center gap-x-2 ">
              <FiTrendingUp className="w-6 h-6 text-yellow-500 mt-1" />
              Top used Languages
              <FiTrendingUp className="w-6 h-6 text-yellow-500 mt-1 -ms-1" />
            </h2>
            <div className="flex flex-col w-full md:flex-row flex-wrap gap-4 items-center md:items-start justify-center">
              {stats ? (
                <>
                  <ExpandableList
                    title="Today"
                    items={stats.daily.languages.map((l: any) => ({
                      word: l._id,
                      count: l.count,
                    }))}
                    loading={shouldShowSkeleton}
                  />
                  <ExpandableList
                    title="This Month"
                    items={stats.monthly.languages.map((l: any) => ({
                      word: l._id,
                      count: l.count,
                    }))}
                    loading={shouldShowSkeleton}
                  />
                  <ExpandableList
                    title="All Time"
                    items={stats.allTime.languages.map((l: any) => ({
                      word: l._id,
                      count: l.count,
                    }))}
                    loading={shouldShowSkeleton}
                  />
                </>
              ) : (
                <>
                  {[0, 1, 2].map((i) => (
                    <ExpandableList
                      key={i}
                      title="Loading..."
                      items={[]}
                      loading
                    />
                  ))}
                </>
              )}
            </div>
          </div>
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
