import RenderLearner from "./RenderLearner";
import { Skeleton } from "@/components/ui/skeleton";

const RenderSection = (
  title: string,
  icon: React.ReactNode,
  data: any[],
  loading: boolean
) => (
  <div className="flex-1">
    <h3 className="flex items-center gap-2 font-bold mb-2 text-lg">
      {icon} {title}
    </h3>
    {loading ? (
      <div className="flex items-center flex-col gap-1 justify-center w-full bg-gray-200 dark:bg-purple-600/5 rounded-lg mb-1">
        {[1, 2, 3, 4, 5].map((e) => (
          <div
            key={e}
            className="flex items-center w-full m-0 gap-3 p-2  bg-gray-200 dark:bg-purple-600/5 rounded-lg mb-1 animate-pulse"
          >
            <div className="w-10 h-10 rounded-full bg-gray-400/50 dark:bg-gray-700/60" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-3 w-24 rounded" />
            </div>
            <Skeleton className="h-4 w-5 rounded" />
          </div>
        ))}
      </div>
    ) : (
      <div>{data.map((learner, idx) => RenderLearner(learner, idx + 1))}</div>
    )}
  </div>
);

export default RenderSection;
