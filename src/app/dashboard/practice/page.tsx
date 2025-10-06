"use client";
import React, { useEffect } from "react";
import { Brain } from "lucide-react";
import PracticeCard from "@/components/pages/practice/PracticeCard";
import { ProgressStats } from "@/components/pages/practice/ProgressStats";

const PracticePage = () => {
  return (
    <div className="flex flex-col -mt-26 md:-mt-4 items-center justify-center min-h-screen md:p-6 ">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold flex items-center gap-2 text-indigo-400">
          <Brain className="w-8 h-8 text-indigo-300" />
          Practice Hub
          <Brain className="w-8 h-8 text-indigo-300" />
        </h1>
        <p className="text-gray-400">
          Sharpen your memory, one word at a time ✨
        </p>
      </div>
      <PracticeCard />
      <ProgressStats />
    </div>
  );
};

export default PracticePage;
