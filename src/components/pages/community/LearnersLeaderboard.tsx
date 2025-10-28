import { FaClock, FaCalendarAlt, FaTrophy } from "react-icons/fa";
import RenderSection from "./RenderSection";

export default function LearnersLeaderboard({ stats, loading }: any) {
  return (
    <div className="mt-6 mx-2 md:mx-0 p-6 bg-gray-100 dark:bg-purple-900/5 rounded-2xl shadow-lg text-black dark:text-white">
      <div className="flex flex-col lg:flex-row gap-6">
        {RenderSection("Top Today", <FaClock />, stats.daily.learners, loading)}
        {RenderSection(
          "Top This Month",
          <FaCalendarAlt />,
          stats.monthly.learners,
          loading
        )}
        {RenderSection(
          "Top All Time",
          <FaTrophy />,
          stats.allTime.learners,
          loading
        )}
      </div>
    </div>
  );
}
