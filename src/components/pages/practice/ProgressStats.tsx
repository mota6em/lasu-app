"use client";
import { Progress } from "@/components/ui/progress";
import { Languages } from "lucide-react";

type ProgressStatsProps = {
  currentIndex: number;
  total: number;
};

export const ProgressStats = ({ currentIndex, total }: ProgressStatsProps) => {
  const value = total > 0 ? (currentIndex / total) * 100 : 0;

  return (
    <div className="mt-8 w-full max-w-md bg-violet-950 rounded-xl shadow p-4">
      <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-1">
        <Languages className="w-4 h-4 text-indigo-500" /> Today's Practice
      </h3>
      <Progress value={value} />
      <p className="mt-2 text-sm text-gray-400">
        {currentIndex + 1} / {total} words practiced
      </p>
    </div>
  );
};
