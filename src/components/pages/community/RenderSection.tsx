import { Learner } from "@/types/learner";
import RenderLearner from "./RenderLearner";

const RenderSection = (
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
      <div>{data.map((learner, idx) => RenderLearner(learner, idx + 1))}</div>
    )}
  </div>
);

export default RenderSection;
