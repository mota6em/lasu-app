"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePracticeSession } from "@/hooks/usePracticeSession";
const PracticeCardSettings = () => {
  const {
    selectedMode,
    setSelectedMode,
    timer,
    setTimer,
  } = usePracticeSession("recall");

  return (
    <div className="flex w-full items-center mb-2 md:px-4 justify-between">
      <div className="flex items-center gap-2">
        <span className="text-yellow-800 dark:text-yellow-500">Mode:</span>
        <Select
          value={selectedMode}
          onValueChange={(value) =>
            setSelectedMode(value as "recall" | "writing")
          }
        >
          <SelectTrigger className="w-[92px] md:w-[142px] cursor-pointer">
            <SelectValue placeholder="Choose a mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="recall" className="cursor-pointer">
                Recall
              </SelectItem>
              <SelectItem value="writing" className="cursor-pointer">
                Writing Practice
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div
        className={`${
          selectedMode === "writing" && "hidden"
        } flex items-center gap-2`}
      >
        <span className="text-yellow-800 dark:text-yellow-500">Timer:</span>
        <Select
          value={timer.toString()}
          onValueChange={(val) => setTimer(parseInt(val))}
        >
          <SelectTrigger className="w-[80px] cursor-pointer">
            <SelectValue placeholder="Timer" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="5" className="cursor-pointer">
                5s
              </SelectItem>
              <SelectItem value="10" className="cursor-pointer">
                10s
              </SelectItem>
              <SelectItem value="15" className="cursor-pointer">
                15s
              </SelectItem>
              <SelectItem value="30" className="cursor-pointer">
                30s
              </SelectItem>
              <SelectItem value="45" className="cursor-pointer">
                45s
              </SelectItem>
              <SelectItem value="60" className="cursor-pointer">
                60s
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PracticeCardSettings;
