import { Skeleton } from "@/components/ui/skeleton";
import CountUp from "react-countup";

const StatCard = ({
  title,
  value,
  loading,
  suffix = "",
}: {
  title: string;
  value: number;
  loading: boolean;
  suffix?: string;
}) => {
  return (
    <div className="p-3 rounded-xl flex-1 shadow-md">
      <h3 className="text-yellow-700 dark:text-yellow-400 text-md font-bold">
        {title}
      </h3>
      <div className="text-yellow-950 dark:text-white flex items-center justify-center gap-x-2 text-xl font-extrabold">
        {loading ? (
          <Skeleton className="h-6 w-6 rounded-md mt-1" />
        ) : (
          <CountUp start={0} end={value} duration={1} />
        )}
        {suffix}
      </div>
    </div>
  );
};

export default StatCard;
