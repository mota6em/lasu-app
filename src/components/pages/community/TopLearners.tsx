"use client";
import {
  FaClock,
  FaCalendarAlt,
  FaTrophy,
  FaStar,
  FaTimes,
} from "react-icons/fa";
import { useState } from "react";
import { useTopLearners } from "@/hooks/useTopLearners";
import RenderSection from "./RenderSection";
import UserRanks from "./UserRanks";

const TopLearnersSection = ({ userId }: { userId: string }) => {
  const { learners: topDay, loading: loadingDay } = useTopLearners("daily");
  const { learners: topMonth, loading: loadingMonth } =
    useTopLearners("monthly");
  const { learners: topAllTime, loading: loadingAll } =
    useTopLearners("allTime");
  const [showTable, setShowTable] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <UserRanks userId={userId} />
        <button
          onClick={() => setShowTable(!showTable)}
          className="bg-gradient-to-r text-sm dark:from-purple-600/20 from-purple-950/90 dark:to-yellow-500/20 to-yellow-700/90 hover:from-purple-700/60 hover:to-yellow-600/60 text-white font-semibold py-1 px-3 rounded-lg cursor-pointer shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:rounded-xl"
        >
          {showTable ? (
            <>
              <FaTimes className="dark:text-yellow-300" /> Hide Leaderboard
            </>
          ) : (
            <>
              <FaStar className="text-yellow-300 animate-pulse" size={20} />{" "}
              Show Leaderboard
            </>
          )}
        </button>
      </div>

      {showTable && (
        <div className="mt-6 mx-2 md:mx-0 p-6 bg-purple-700/5 rounded-2xl shadow-lg text-white">
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

export default TopLearnersSection;
