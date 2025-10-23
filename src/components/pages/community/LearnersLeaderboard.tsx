import { FaClock, FaCalendarAlt, FaTrophy } from "react-icons/fa";
import RenderSection from "./RenderSection";

export default function LearnersLeaderboard({
  topDay,
  loadingDay,
  topMonth,
  loadingMonth,
  topAllTime,
  loadingAll,
}: any) {
  return (
    <div className="mt-6 mx-2 md:mx-0 p-6 bg-gray-100 dark:bg-purple-900/5 rounded-2xl shadow-lg text-black dark:text-white">
      <div className="flex flex-col lg:flex-row gap-6">
        {RenderSection("Top Today", <FaClock />, topDay, loadingDay)}
        {RenderSection(
          "Top This Month",
          <FaCalendarAlt />,
          topMonth,
          loadingMonth
        )}
        {RenderSection("Top All Time", <FaTrophy />, topAllTime, loadingAll)}
      </div>
    </div>
  );
}
