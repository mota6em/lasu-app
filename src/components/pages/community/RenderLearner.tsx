import { Learner } from "@/types/learner";
import { FaMedal } from "react-icons/fa";
import Image from "next/image";

const RenderLearner = (learner: Learner, rank: number) => (
  <div
    key={learner.id.slice(-5)}
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

export default RenderLearner;
