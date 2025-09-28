 import { useEffect, useState } from "react";
import { usePracticeWords } from "@/hooks/usePracticeWords";

export function usePracticeSession(
  defaultMode: "recall" | "writing" = "recall"
) {
  const [selectedMode, setSelectedMode] = useState(defaultMode);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(15);
  const [timeLeft, setTimeLeft] = useState(timer);
  const [showResult, setShowResult] = useState(false);
  const [stats, setStats] = useState({ remembered: 0, forgotten: 0 });
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const { data: practiceWords, isLoading } = usePracticeWords();
  const currentWord = practiceWords?.[currentIndex];

  const handleNext = () => {
    if (practiceWords && currentIndex < practiceWords.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
    setShowResult(false);
    setAnswers({});
  };

  const handleRecall = (remembered: boolean) => {
    if (!practiceWords || !currentWord) return;
    setStats((prev) => ({
      remembered: prev.remembered + (remembered ? 1 : 0),
      forgotten: prev.forgotten + (!remembered ? 1 : 0),
    }));
    handleNext();
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
    // handlers
    handleNext,
    handleRecall,
  };
}
