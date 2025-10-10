"use client";
import {
  FaClock,
  FaCalendarAlt,
  FaTrophy,
  FaStar,
  FaTimes,
} from "react-icons/fa";
import { useTopLearners } from "@/hooks/useTopLearners";
import RenderSection from "./RenderSection";
import UserRanks from "./UserRanks";
import React, { useEffect, useState } from "react";
import ExpandableList from "./ExpandableList";
import { FiTrendingUp } from "react-icons/fi";
import { Brain, MessageSquareText, Globe } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const CommTopStats = ({ userId }: { userId: string }) => {
  //from TopLearners component
  const { learners: topDay, loading: loadingDay } = useTopLearners("daily");
  const { learners: topMonth, loading: loadingMonth } =
    useTopLearners("monthly");
  const { learners: topAllTime, loading: loadingAll } =
    useTopLearners("allTime");
  const [showTopLearnersTable, setShowTopLearnersTable] = useState(false);
  const [showTopWordsTable, setShowTopWordsTable] = useState(false);
  const [showTopLangsTable, setShowTopLangsTable] = useState(false);

  interface StatItem {
    _id: string;
    count: number;
  }

  interface Stats {
    daily: { words: StatItem[]; languages: StatItem[] };
    monthly: { words: StatItem[]; languages: StatItem[] };
    allTime: { words: StatItem[]; languages: StatItem[] };
  }

  //from LangsWordsChart component
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = () => {
      fetch("/api/community/stats")
        .then((res) => res.json())
        .then((data) => setStats(data))
        .catch(console.error);
    };

    fetchStats(); // initial fetch

    const interval = setInterval(fetchStats, 60000); //refresh every 1 min
    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return (
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-gray-400">
          Your Ranks:
          <span className="text-yellow-700 dark:text-yellow-400">Today:</span>
          {" - "}/
          <span className="text-yellow-700 dark:text-yellow-400">
            This Month:
          </span>
          {" - "}/
          <span className="text-yellow-700 dark:text-yellow-400">
            All Time:
          </span>
          {" - "}
        </span>
        <div className="grid md:grid-cols-3 items-center justify-center gap-2">
          <Skeleton className="h-6 w-46" />
          <Skeleton className="h-6 w-46" />
          <Skeleton className="h-6 w-46" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/*from TopLearners Component */}
      <div className="flex flex-col items-center gap-2">
        <UserRanks userId={userId} />
        <div className="grid md:grid-cols-3 items-center gap-2">
          <button
            onClick={() => {
              setShowTopLearnersTable(!showTopLearnersTable);
              setShowTopWordsTable(false);
              setShowTopLangsTable(false);
            }}
            className="bg-gradient-to-r justify-center text-sm dark:from-purple-600/20 from-purple-950/90 dark:to-yellow-500/20 to-yellow-700/90 hover:from-purple-700/60 hover:to-yellow-600/60 text-white font-semibold py-1 px-3 rounded-lg cursor-pointer shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:rounded-xl"
          >
            {showTopLearnersTable ? (
              <>
                <FaTimes className="dark:text-yellow-300" /> Hide Leaderboard
              </>
            ) : (
              <>
                <FaStar className="text-yellow-300 animate-pulse" size={20} />{" "}
                Leaderboard
              </>
            )}
          </button>
          <button
            onClick={() => {
              setShowTopLearnersTable(false);
              setShowTopWordsTable(!showTopWordsTable);
              setShowTopLangsTable(false);
            }}
            className="bg-gradient-to-r justify-center text-sm dark:from-purple-600/20 from-purple-950/90 dark:to-yellow-500/20 to-yellow-700/90 hover:from-purple-700/60 hover:to-yellow-600/60 text-white font-semibold py-1 px-3 rounded-lg cursor-pointer shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:rounded-xl"
          >
            {showTopWordsTable ? (
              <>
                <FaTimes className="dark:text-yellow-300" /> Hide Top Translated
                Words
              </>
            ) : (
              <>
                <MessageSquareText
                  className="text-yellow-300 animate-pulse"
                  size={20}
                />{" "}
                Top Translated Words
              </>
            )}
          </button>
          <button
            onClick={() => {
              setShowTopLearnersTable(false);
              setShowTopWordsTable(false);
              setShowTopLangsTable(!showTopLangsTable);
            }}
            className="bg-gradient-to-r justify-center text-sm dark:from-purple-600/20 from-purple-950/90 dark:to-yellow-500/20 to-yellow-700/90 hover:from-purple-700/60 hover:to-yellow-600/60 text-white font-semibold py-1 px-3 rounded-lg cursor-pointer shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:rounded-xl"
          >
            {showTopLangsTable ? (
              <>
                <FaTimes className="dark:text-yellow-300" /> Hide Top Translated
                Languages
              </>
            ) : (
              <>
                <Globe className="text-yellow-300 animate-pulse" size={20} />{" "}
                Top Translated Langs
              </>
            )}
          </button>
        </div>
      </div>
      {/*from LangsWordsChart component */}

      <div className="flex flex-col items-center justify-center gap-y-8">
        {showTopWordsTable && (
          <div className="w-full my-5">
            <h2 className="text-2xl font-bold text-center mb-5 flex items-center justify-center gap-x-2 ">
              <FiTrendingUp className="w-6 h-6 text-yellow-500 mt-1" />
              Top used Words
              <FiTrendingUp className="w-6 h-6 text-yellow-500 mt-1 -ms-1" />
            </h2>
            <div className="flex flex-col md:flex-row flex-wrap gap-4 items-center md:items-start justify-center">
              <ExpandableList
                title="Today"
                items={stats.daily.words.map((w: any) => ({
                  word: w._id,
                  count: w.count,
                }))}
              />
              <ExpandableList
                title="This Month"
                items={stats.monthly.words.map((w: any) => ({
                  word: w._id,
                  count: w.count,
                }))}
              />
              <ExpandableList
                title="All Time"
                items={stats.allTime.words.map((w: any) => ({
                  word: w._id,
                  count: w.count,
                }))}
              />
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
              <ExpandableList
                title="Today"
                items={stats.daily.languages.map((l: any) => ({
                  word: l._id,
                  count: l.count,
                }))}
              />
              <ExpandableList
                title="This Month"
                items={stats.monthly.languages.map((l: any) => ({
                  word: l._id,
                  count: l.count,
                }))}
              />
              <ExpandableList
                title="All Time"
                items={stats.allTime.languages.map((l: any) => ({
                  word: l._id,
                  count: l.count,
                }))}
              />
            </div>
          </div>
        )}
      </div>
      {/*from TopLearners Component */}
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
