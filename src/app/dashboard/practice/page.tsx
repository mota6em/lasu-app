"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Languages } from "lucide-react";
import { LuTimer } from "react-icons/lu";
import { MdNavigateNext } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { usePracticeWords } from "@/hooks/usePracticeWords";
const PracticePage = () => {
  const [selectedMode, setSelectedMode] = useState("recall");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(5);
  const [timeLeft, setTimeLeft] = useState(timer);
  const [showResult, setShowResult] = useState(true);

  const { data: practiceWords, isLoading } = usePracticeWords();
  const currentWord = practiceWords?.[currentIndex];
  console.log("currentWord", practiceWords);
  const handleNext = () => {
    if (practiceWords && currentIndex < practiceWords.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
    setShowResult(false);
  };

  useEffect(() => {
    if (timeLeft === 0) {
      setShowResult(true);
    }
  }, [timeLeft]);

  useEffect(() => {
    setTimeLeft(timer);
  }, [currentIndex]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 ">
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

      <Card className="w-full max-w-3xl shadow-xl rounded-2xl border-0 bg-violet-900/50 backdrop-blur-sm">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-4xl font-bold text-violet-50">
            {currentWord ? (
              currentWord.sourceText
            ) : (
              <span className="animate-pulse">Loading...</span>
            )}
          </CardTitle>

          <Badge className="mt-2 bg-violet-900/0 text-4xl flex items-center text-amber-400">
            <LuTimer className="!w-6 !h-6" /> {timeLeft}s
          </Badge>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-6 relative">
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-4 justify-center">
              <Badge className="bg-violet-900/5 text-yellow-400 hover:text-yellow-500 cursor-pointer">
                Next Lang
                <MdNavigateNext className="!w-6 !h-6" />
              </Badge>
              <span className="text-lg font-medium text-violet-300">EN</span>
              <span className="text-lg font-medium text-violet-300/40 blur-[1px]">
                AR
              </span>
              <span className="text-lg font-medium text-violet-300/40 blur-[2px]">
                HU
              </span>
            </div>

            <div className="flex flex-row items-center justify-center gap-x-5">
              <h3>Result: </h3>
              {!showResult && (
                <div className="h-8 w-40 blur-sm bg-violet-400 my-2"></div>
              )}
              {showResult && (
                <div className="h-8 w-35 -ml-3 flex items-center justify-center bg-violet-700 rounded-xl font-bold my-2">
                  I'm the result
                </div>
              )}
            </div>
            {selectedMode === "writing" && (
              <div className="flex flex-col gap-3">
                <Input
                  placeholder={`Type the correct translation...`}
                  className="p-3 text-base rounded-lg border focus:ring-2 focus:ring-blue-500 transition"
                />
                <p className="text-sm text-gray-500 italic">
                  Press <kbd>Enter</kbd> when you're done ✍️
                </p>
              </div>
            )}

            {selectedMode === "recall" && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-center gap-2">
                  <Button className=" bg-lime-600 hover:bg-green-600 text-white">
                    I remember this word
                  </Button>
                  <Button className=" bg-red-500 hover:bg-red-600 text-white">
                    I don't remember
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="absolute -top-30 right-4 flex justify-end">
            <div className="flex items-center gap-2 text-yellow-500">
              <Select value={selectedMode} onValueChange={setSelectedMode}>
                <SelectTrigger className="w-[142px] cursor-pointer">
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
          </div>
          <div className="w-full flex justify-end">
            <Badge
              onClick={handleNext}
              className="bg-transparent text-md text-yellow-500 cursor-pointer flex items-center gap-1"
            >
              Next Word
              <MdNavigateNext className="!w-10 !h-10" />
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 w-full max-w-md bg-violet-950 rounded-xl shadow p-4">
        <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-1">
          <Languages className="w-4 h-4 text-indigo-500" /> Today's Practice
        </h3>
        <Progress
          value={
            practiceWords && practiceWords.length > 0
              ? (currentIndex / practiceWords.length) * 100
              : 0
          }
        />
        <p className="mt-2 text-sm text-gray-400">
          {currentIndex + 1} / {practiceWords?.length || 0} words practiced
        </p>
      </div>
    </div>
  );
};

export default PracticePage;
