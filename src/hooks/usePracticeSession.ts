import { useEffect, useState } from "react";
import { usePracticeWords } from "@/hooks/usePracticeWords";
import { usePracticeStore } from "@/store/usePracticeStore";
import { set } from "mongoose";

export function usePracticeSession(
  defaultMode: "recall" | "writing" = "recall"
) {
  const { currentIndex, setCurrentIndex, totalWords, setTotalWords } =
    usePracticeStore();
  const [selectedMode, setSelectedMode] = useState(defaultMode);
  const [timer, setTimer] = useState(15);
  const [timeLeft, setTimeLeft] = useState(timer);
  const [showResult, setShowResult] = useState(false);
  const [stats, setStats] = useState({ remembered: 0, forgotten: 0 });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [disableButtons, setDisableButtons] = useState(false);
  const { data: practiceWords, isLoading } = usePracticeWords();
  const currentWord = practiceWords?.[currentIndex];

  useEffect(() => {
    if (practiceWords) setTotalWords(practiceWords.length);
  }, [practiceWords]);

  const handleNext = () => {
    if (practiceWords && currentIndex < practiceWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    setShowResult(false);
    setAnswers({});
    setDisableButtons(false);
    setTimeLeft(timer);
  };

  const handleRecall = (remembered: boolean) => {
    if (!practiceWords || !currentWord) return;
    setStats((prev) => ({
      remembered: prev.remembered + (remembered ? 1 : 0),
      forgotten: prev.forgotten + (!remembered ? 1 : 0),
    }));
    setShowResult(true);
    setDisableButtons(true);
  };

  useEffect(() => {
    setTimeLeft(timer);
  }, [currentIndex, timer]);

  useEffect(() => {
    if (timeLeft === 0 && selectedMode === "recall") {
      setShowResult(true);
    }
  }, [timeLeft, selectedMode]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  return {
    // state
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
    totalWords,
    disableButtons,
    // handlers
    handleNext,
    handleRecall,
  };
}
