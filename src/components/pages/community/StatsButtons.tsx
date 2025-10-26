import { FaStar, FaTimes } from "react-icons/fa";
import { MessageSquareText, Globe } from "lucide-react";

interface Props {
  showTopLearnersTable: boolean;
  showTopWordsTable: boolean;
  showTopLangsTable: boolean;
  handleShowLearners: () => void;
  handleShowWords: () => void;
  handleShowLangs: () => void;
}

export default function StatsButtons({
  showTopLearnersTable,
  showTopWordsTable,
  showTopLangsTable,
  handleShowLearners,
  handleShowWords,
  handleShowLangs,
}: Props) {
  const btnClass =
    "bg-gradient-to-r justify-center text-sm dark:from-purple-600/20 from-purple-950/90 dark:to-yellow-500/20 to-yellow-700/90 hover:from-purple-700/60 hover:to-yellow-600/60 text-white font-semibold py-1 px-3 rounded-lg cursor-pointer shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:rounded-xl";

  return (
    <div className="grid md:grid-cols-3 gap-2">
      <button onClick={handleShowLearners} className={btnClass}>
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

      <button onClick={handleShowWords} className={btnClass}>
        {showTopWordsTable ? (
          <>
            <FaTimes className="dark:text-yellow-300" /> Hide Top Words
          </>
        ) : (
          <>
            <MessageSquareText
              className="text-yellow-300 animate-pulse"
              size={20}
            />{" "}
            Top Words
          </>
        )}
      </button>

      <button onClick={handleShowLangs} className={btnClass}>
        {showTopLangsTable ? (
          <>
            <FaTimes className="dark:text-yellow-300" /> Hide Top Langs
          </>
        ) : (
          <>
            <Globe className="text-yellow-300 animate-pulse" size={20} /> Top
            Langs
          </>
        )}
      </button>
    </div>
  );
}
