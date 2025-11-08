"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LuTimer } from "react-icons/lu";
import { MdNavigateNext } from "react-icons/md";
import { IoMdCheckmark } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import PracticeCardContentSkeleton from "./PracticeCardContentSkeleton";
const PracticeCardContent = ({
  selectedMode,
  currentIndex,
  timer,
  timeLeft,
  setTimeLeft,
  showResult,
  setShowResult,
  stats,
  answers,
  setAnswers,
  currentWord,
  handleNext,
  handleRecall,
  disableButtons,
}: any) => {
  useEffect(() => {
    setTimeLeft(timer);
  }, [currentIndex, timer]);

  useEffect(() => {
    if (timeLeft === 0 && selectedMode === "recall") {
      setShowResult(true);
    }
    if (timeLeft <= 1) return;
    const timer = setInterval(() => {
      setTimeLeft((t: number) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const isLoading = !currentWord;
  if (isLoading) return <PracticeCardContentSkeleton />;

  return (
    <Card className="w-xs py-1 md:w-xl lg:w-3xl shadow-xl rounded-2xl border-0 bg-sky-900 dark:bg-indigo-900/50 backdrop-blur-sm">
      <CardHeader className="flex mt-5 flex-row items-center justify-center">
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
            <div className="flex-wrap grid md:grid-cols-2 gap-x-6 md:gap-x-12 gap-4 justify-center w-full">
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
                        String(translation)
                      ) : (
                        <div className="h-4 w-20 blur-xs bg-violet-300 dark:bg-violet-400 ml-2"></div>
                      )}
                    </Badge>
                  )
                )}
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
                              setAnswers((prev: Record<string, string>) => ({
                                ...prev,
                                [lang]: e.target.value,
                              }))
                            }
                            placeholder={`Type the meaning in ${lang}...`}
                            className="p-3 text-base rounded-lg border focus:ring-2 focus:ring-2 focus:ring-blue-500 transition"
                          />
                          {showResult && (
                            <p className="flex items-center gap-x-2 mt-1">
                              {(answers[lang] || "").trim().toLowerCase() ===
                              String(translation).trim().toLowerCase() ? (
                                <IoMdCheckmark className="w-6 h-6 text-green-500" />
                              ) : (
                                <IoClose className="w-6 h-6 text-red-500" />
                              )}
                              {String(translation)}
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
            <div className="flex flex-col gap-3 w-full">
              <Button
                onClick={() => handleRecall(true)}
                className={`bg-lime-500 dark:bg-lime-600 w-full dark:hover:bg-green-600 hover:bg-green-500 text-white transition ${
                  showResult ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                I remember
              </Button>
              <Button
                onClick={() => handleRecall(false)}
                className={`bg-red-500 w-full hover:bg-red-600 text-white transition ${
                  showResult ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                I don't
              </Button>
            </div>
          )}
        </div>

        <div className="w-full flex gap-x-3 md:gap-x-4 !-mt-5 justify-end -mr-10 md:-mr-5">
          <div className="flex gap-x-2 flex-row items-center justify-center">
            <div className="text-green-300 dark:text-green-600 mt-0.5 flex gap-x-2 text-xs md:text-sm w-full">
              <span>Remembered: </span>
              <span>{stats.remembered}</span>
            </div>
            <div className="text-red-300 dark:text-red-600 flex gap-x-2 w-full mt-0.5 text-xs md:text-sm">
              <span>Forgotten:</span>
              <span>{stats.forgotten}</span>
            </div>
          </div>
          <Badge
            onClick={handleNext}
            className={`bg-transparent text-sm md:text-md text-yellow-500 cursor-pointer flex items-center gap-0.5 md:gap-1
              ${disableButtons ? "animate-pulse border border-yellow-500" : ""}`}
          >
            Next Word
            <MdNavigateNext className="md:!w-10 !w-6 !h-6 md:!h-10" />
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default PracticeCardContent;
