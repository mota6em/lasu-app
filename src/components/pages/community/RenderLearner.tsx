import { Learner } from "@/types/learner";
import { FaMedal, FaCrown } from "react-icons/fa";
import Image from "next/image";

const RenderLearner = (learner: Learner, rank: number) => {
  const getMedalColor = () => {
    if (rank === 1) return "dark:text-yellow-200 text-yellow-600";
    if (rank === 2) return "dark:text-yellow-400 text-yellow-700";
    if (rank === 3) return "dark:text-yellow-600 text-yellow-900";
    return "dark:text-white text-gray-900";
  };

  return (
    <div
      key={learner.id.slice(-5)}
      className={`flex items-center gap-3 p-2 bg-gray-200 dark:bg-purple-600/5 rounded-lg mb-2 hover:bg-gray-300/20 hover:dark:bg-purple-700/20 transition`}
    >
      {learner.showPicture ? (
        <Image
          src={learner.Image || "/imgs/userIcon.jpg"}
          alt="User Avatar"
          width={40}
          height={40}
          className={`rounded-full ${
            rank <= 3 ? "ring-2 ring-yellow-900 dark:ring-yellow-400" : ""
          }`}
        />
      ) : (
        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
          <FaMedal className={`${getMedalColor()} text-lg`} />
        </div>
      )}

      <div className="flex-1">
        <h4 className="font-bold text-sm flex items-center gap-1">
          {learner.showName ? learner.name : "Anonymous champion"}
          {rank === 1 && <FaCrown className="text-yellow-400 animate-pulse" />}
        </h4>
        <p className="text-xs text-gray-900 dark:text-gray-300">
          {learner.totalTranslations ?? 0} translations, {learner.xp} XP
        </p>
      </div>

      <span className={`font-bold ${getMedalColor()}`}>{rank}</span>
    </div>
  );
};

export default RenderLearner;
