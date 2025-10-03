"use client";
import { Progress } from "@/components/ui/progress";
import { usePracticeSession } from "@/hooks/usePracticeSession";
import { Languages } from "lucide-react";

export const ProgressStats = () => {
  const { currentIndex, totalWords } = usePracticeSession("recall");

  return (
    <div className="mt-8 w-full max-w-md bg-violet-950 rounded-xl shadow p-4">
      <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-1">
        <Languages className="w-4 h-4 text-indigo-500" /> Today's Practice
      </h3>
      <Progress value={((currentIndex + 1) * 100) / totalWords} />
      <p className="mt-2 text-sm text-gray-400">
        {currentIndex + 1} / {totalWords} words practiced
      </p>
    </div>
  );
};
