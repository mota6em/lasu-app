"use client";

import { FaMedal, FaClock, FaCalendarAlt, FaTrophy } from "react-icons/fa";
import Image from "next/image";

interface Learner {
  id: string;
  name: string;
  avatarUrl: string;
  xp: number;
  wordsLearned: number;
  showName: boolean;
  showPicture: boolean;
}

const TopLearnersSection = () => {
  // Mock data
  const topDay: Learner[] = [
    {
      id: "1",
      name: "Alice",
      avatarUrl: "/",
      xp: 50,
      wordsLearned: 10,
      showName: true,
      showPicture: false,
    },
    {
      id: "2",
      name: "Bob",
      avatarUrl: "/",
      xp: 45,
      wordsLearned: 9,
      showName: true,
      showPicture: false,
    },
    {
      id: "3",
      name: "Charlie",
      avatarUrl: "/",
      xp: 40,
      wordsLearned: 8,
      showName: false,
      showPicture: false,
    },
    {
      id: "4",
      name: "Diana",
      avatarUrl: "/",
      xp: 38,
      wordsLearned: 7,
      showName: true,
      showPicture: false,
    },
    {
      id: "5",
      name: "Eve",
      avatarUrl: "/",
      xp: 35,
      wordsLearned: 6,
      showName: true,
      showPicture: false,
    },
  ];

  const topMonth: Learner[] = topDay; // for simplicity
  const topAllTime: Learner[] = topDay; // for simplicity

  // Mock user rank
  const userRank = {
    day: 7,
    month: 12,
    allTime: 30,
  };

  const renderLearner = (learner: Learner, rank: number) => (
    <div
      key={learner.id}
      className="flex items-center gap-3 p-2 bg-purple-800/10 rounded-lg mb-2"
    >
      {learner.showPicture ? (
        <Image
          src={learner.avatarUrl}
          alt={learner.name}
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
        <p className="font-semibold text-sm">
          {learner.showName ? learner.name : "Anonymous"}
        </p>
        <p className="text-xs text-gray-300">
          {learner.wordsLearned} words, {learner.xp} XP
        </p>
      </div>
      <span className="font-bold text-yellow-400">{rank}</span>
    </div>
  );

  const renderSection = (title: string, icon: JSX.Element, data: Learner[]) => (
    <div className="flex-1">
      <h3 className="flex items-center gap-2 font-bold mb-2 text-lg">
        {icon} {title}
      </h3>
      <div>{data.map((learner, idx) => renderLearner(learner, idx + 1))}</div>
    </div>
  );

  return (
    <div className="mt-8 mx-2 md:mx-0 p-6 bg-purple-700/5 rounded-2xl shadow-lg text-white">
      <div className="flex flex-col lg:flex-row lg:flex-nowrap flex-wrap gap-6">
        {renderSection("Top Today", <FaClock />, topDay)}
        {renderSection("Top This Month", <FaCalendarAlt />, topMonth)}
        {renderSection("Top All Time", <FaTrophy />, topAllTime)}
      </div>

      <div className="mt-6 p-4 bg-purple-700/15 rounded-lg text-center">
        <p className="font-semibold mb-2">Your Rank</p>
        <div className="flex justify-center gap-6 text-sm text-gray-300">
          <span>
            Day: <span className="text-yellow-400">{userRank.day}</span>
          </span>
          <span>
            Month: <span className="text-yellow-400">{userRank.month}</span>
          </span>
          <span>
            All Time:{" "}
            <span className="text-yellow-400">{userRank.allTime}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopLearnersSection;
