"use client";

import {
  FaMedal,
  FaClock,
  FaCalendarAlt,
  FaTrophy,
  FaStar,
  FaTimes,
} from "react-icons/fa";
import Image from "next/image";
import { useState } from "react";
import { useTopLearners } from "@/hooks/useTopLearners";

interface Learner {
  _id: string;
  name: string;
  Image?: string;
  xp: number;
  showName?: boolean;
  showPicture?: boolean;
}

const TopLearnersSection = () => {
  const { learners: topDay, loading: loadingDay } = useTopLearners("daily");
  console.log("topDay", topDay);
  const { learners: topMonth, loading: loadingMonth } =
    useTopLearners("monthly");
  console.log("topMonth", topMonth);
  const { learners: topAllTime, loading: loadingAll } =
    useTopLearners("allTime");
  console.log("topAllTime", topAllTime);
  const userRank = { day: 7, month: 12, allTime: 60 };

  const [showTable, setShowTable] = useState(false);

  const renderLearner = (learner: Learner, rank: number) => (
    <div
      key={learner._id.slice(-5)}
      className="flex items-center gap-3 p-2 bg-purple-800/10 rounded-lg mb-2 hover:bg-purple-700/20 transition"
    >
      {learner.showPicture ? (
        <Image
          src={learner.Image || "/imgs/userIcon.jpg"}
          alt="User Avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
      ) : (
        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
          <FaMedal className="text-white" />
        </div>
      )}
      <div className="flex-1">
        <h4 className="font-bold text-sm">
          {learner.showName ? learner.name : "Anonymous champion"}
        </h4>
        <p className="text-xs text-gray-300">
          {learner.totalTranslations ?? 0} translations, {learner.xp} XP
        </p>
      </div>
      <span className="font-bold text-yellow-400">{rank}</span>
    </div>
  );

  const renderSection = (
    title: string,
    icon: React.ReactNode,
    data: Learner[],
    loading: boolean
  ) => (
    <div className="flex-1">
      <h3 className="flex items-center gap-2 font-bold mb-2 text-lg">
        {icon} {title}
      </h3>
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div>{data.map((learner, idx) => renderLearner(learner, idx + 1))}</div>
      )}
    </div>
  );

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-gray-400">
          Your Ranks: <span className="text-yellow-400">Today:</span>{" "}
          {userRank.day} / <span className="text-yellow-400">This Month:</span>{" "}
          {userRank.month} / <span className="text-yellow-400">All Time:</span>{" "}
          {userRank.allTime}
        </span>
        <button
          onClick={() => setShowTable(!showTable)}
          className="bg-gradient-to-r text-sm from-purple-600/20 to-yellow-500/20 hover:from-purple-700/60 hover:to-yellow-600/60 text-white font-semibold py-1 px-3 rounded-lg cursor-pointer shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:rounded-xl"
        >
          {showTable ? (
            <>
              <FaTimes className="text-yellow-300" /> Hide Leaderboard
            </>
          ) : (
            <>
              <FaStar className="text-yellow-300 animate-pulse" /> Show
              Leaderboard
            </>
          )}
        </button>
      </div>

      {showTable && (
        <div className="mt-6 mx-2 md:mx-0 p-6 bg-purple-700/5 rounded-2xl shadow-lg text-white">
          <div className="flex flex-col lg:flex-row gap-6">
            {renderSection("Top Today", <FaClock />, topDay, loadingDay)}
            {renderSection(
              "Top This Month",
              <FaCalendarAlt />,
              topMonth,
              loadingMonth
            )}
            {renderSection(
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
