"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LuTimer } from "react-icons/lu";
import { MdNavigateNext } from "react-icons/md";
import { IoMdCheckmark } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { usePracticeSession } from "@/hooks/usePracticeSession";

const PracticeCard = () => {
  const {
    selectedMode,
    setSelectedMode,
    currentIndex,
    setCurrentIndex,
    timer,
    setTimer,
    timeLeft,
    setTimeLeft,
    showResult,
    setShowResult,
    stats,
    setStats,
    answers,
    setAnswers,
    practiceWords,
    isLoading,
    currentWord,
    handleNext,
    handleRecall,
  } = usePracticeSession("recall");

  useEffect(() => {
    setTimeLeft(timer);
  }, [currentIndex, timer]);

  useEffect(() => {
    if (timeLeft === 0 && selectedMode === "recall") {
      setShowResult(true);
    }
    if (timeLeft <= 1) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div className="flex flex-col">
      <div className="flex w-full items-center mb-2 md:px-4 justify-between">
        <div className="flex items-center gap-2">
          <span className="text-yellow-500">Mode:</span>
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
          <span className="text-yellow-500">Timer:</span>
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
      <Card className=" w-xs md:w-xl lg:w-3xl shadow-xl rounded-2xl border-0 bg-violet-900/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-center">
          <CardTitle className="text-xl md:text-4xl font-bold text-violet-50">
            {currentWord ? (
              currentWord.sourceText.toUpperCase()
            ) : (
              <span className="animate-pulse">Loading...</span>
            )}
          </CardTitle>

          {selectedMode === "recall" && (
            <Badge className="bg-violet-900/0 text-xl md:text-4xl flex items-center text-amber-400">
              <LuTimer className="!w-6 !h-6" /> {timeLeft}s
            </Badge>
          )}
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-6 relative">
          <div className="flex flex-col items-center gap-4">
            {selectedMode === "recall" && (
              <div className="flex flex-row items-center justify-center gap-x-5">
                <h3>Result: </h3>

                <div className="flex-wrap grid md:grid-cols-2 gap-x-6 md:gap-x-12 gap-4 justify-center border-l-2 pl-4 w-full">
                  {currentWord &&
                    Object.entries(currentWord.result.translations).map(
                      ([lang, translation]) => (
                        <Badge
                          key={lang}
                          className="bg-violet-900/0 text-md text-amber-400 flex items-start"
                        >
                          <span className="font-semibold text-white text-start">
                            {lang.charAt(0).toUpperCase() + lang.slice(1)}
                          </span>{" "}
                          :{" "}
                          {showResult ? (
                            translation
                          ) : (
                            <div className="h-4 w-20 blur-sm bg-violet-400 ml-2"></div>
                          )}
                        </Badge>
                      )
                    )}
                </div>
              </div>
            )}
            {selectedMode === "writing" && (
              <div className="flex flex-col gap-3 items-center justify-center my-6">
                <div className="flex flex-wrap gap-4 justify-center w-12/12">
                  {currentWord &&
                    Object.entries(currentWord.result.translations).map(
                      ([lang, translation]) => (
                        <div
                          key={lang}
                          className="bg-violet-900/0 text-md text-amber-400 flex items-start w-[45%] gap-x-2"
                        >
                          <span className="font-semibold text-white text-start">
                            {lang.charAt(0).toUpperCase() + lang.slice(1)}:
                          </span>
                          <div>
                            <Input
                              value={answers[lang] || ""}
                              onChange={(e) =>
                                setAnswers((prev) => ({
                                  ...prev,
                                  [lang]: e.target.value,
                                }))
                              }
                              placeholder={`Type the meaning in ${lang}...`}
                              className="p-3 text-base rounded-lg border focus:ring-2 focus:ring-blue-500 transition"
                            />
                            {showResult && (
                              <p className="flex items-center gap-x-2 mt-1">
                                {answers[lang]?.trim().toLowerCase() ===
                                translation.trim().toLowerCase() ? (
                                  <IoMdCheckmark className="w-6 h-6 text-green-500" />
                                ) : (
                                  <IoClose className="w-6 h-6 text-red-500" />
                                )}
                                {translation}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    )}
                </div>
                <Button
                  className=" bg-lime-600 hover:bg-green-600 text-white mt-3"
                  onClick={() => setShowResult(true)}
                >
                  Check my answers
                </Button>
              </div>
            )}

            {selectedMode === "recall" && (
              <div className="flex flex-col gap-x-3">
                <div className="flex items-center justify-center gap-2  lg:gap-x-8">
                  <div>
                    <Button
                      onClick={() => handleRecall(true)}
                      className="bg-lime-600 hover:bg-green-600 text-white"
                    >
                      I remember this word
                    </Button>
                    <div className="text-green-600 mt-0.5 text-sm">
                      Remembered: {stats.remembered}
                    </div>
                  </div>
                  <div>
                    <Button
                      onClick={() => handleRecall(false)}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      I don't remember
                    </Button>
                    <div className="text-red-600 mt-0.5 text-sm">
                      Forgotten: {stats.forgotten}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-full flex justify-end -mr-10 md:-mr-0">
            <Badge
              onClick={handleNext}
              className="bg-transparent text-sm md:text-md text-yellow-500 cursor-pointer flex items-center gap-0.5 md:gap-1"
            >
              Next Word
              <MdNavigateNext className="md:!w-10 !w-6 !h-6 md:!h-10" />
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PracticeCard;
