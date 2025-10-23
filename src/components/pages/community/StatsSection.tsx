import { FiTrendingUp } from "react-icons/fi";
import ExpandableList from "./ExpandableList";

export default function StatsSection({
  title,
  data,
  type,
  loading,
}: {
  title: string;
  data: any;
  type: "words" | "languages";
  loading: boolean;
}) {
  if (!data) return null;

  return (
    <div className="w-full my-5">
      <h2 className="text-2xl font-bold text-center mb-5 flex items-center justify-center gap-x-2">
        <FiTrendingUp className="w-6 h-6 text-yellow-500 mt-1" />
        {title}
        <FiTrendingUp className="w-6 h-6 text-yellow-500 mt-1 -ms-1" />
      </h2>
      <div className="flex flex-col md:flex-row flex-wrap gap-4 items-center md:items-start justify-center">
        {["daily", "monthly", "allTime"].map((period) => (
          <ExpandableList
            key={period}
            title={
              period === "daily"
                ? "Today"
                : period === "monthly"
                ? "This Month"
                : "All Time"
            }
            items={data[period][type].map((item: any) => ({
              word: item._id,
              count: item.count,
            }))}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
}
