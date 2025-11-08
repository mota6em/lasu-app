"use client";
import { Brain } from "lucide-react";
import PracticeCard from "@/components/pages/practice/PracticeCard";
 
const PracticePage = () => {
  return (
    <div className="flex flex-col pt-6 md:pt-4 items-center justify-center min-h-screen md:p-6 ">
      <div className="mb-8 flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold flex items-center gap-2  text-indigo-800 dark:text-indigo-400">
          <Brain className="w-8 h-8 text-indigo-800 dark:text-indigo-300" />
          Practice Hub
          <Brain className="w-8 h-8 text-indigo-800 dark:text-indigo-300" />
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          ✨ Sharpen your memory, one word at a time ✨
        </p>
      </div>
      <PracticeCard />
     </div>
  );
};

export default PracticePage;

