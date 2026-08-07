"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePracticeWords } from "@/hooks/usePracticeWords";
import { gradeAnswer, shuffle } from "@/lib/practice";
import type Translation from "@/types/translation";

export type PracticeMode = "recall" | "writing";
export type PracticePhase = "setup" | "active" | "summary";

export interface PracticeAnswer {
  word: Translation;
  correct: boolean;
}

export interface PracticeConfig {
  mode: PracticeMode;
  deckSize: number | "all";
  timer: number;
}

const DEFAULT_CONFIG: PracticeConfig = { mode: "recall", deckSize: 10, timer: 15 };

export function usePracticeSession() {
  const { data: words, isLoading, isError } = usePracticeWords();

  const [config, setConfig] = useState<PracticeConfig>(DEFAULT_CONFIG);
  const [phase, setPhase] = useState<PracticePhase>("setup");
  const [deck, setDeck] = useState<Translation[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [log, setLog] = useState<PracticeAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);

  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  const pool = useMemo(
    () => (words ?? []).filter((w) => Object.keys(w.result?.translations ?? {}).length > 0),
    [words]
  );

  const current = deck[index];
  const isLast = index >= deck.length - 1;

  const clearTimer = useCallback(() => {
    if (tick.current) clearInterval(tick.current);
    tick.current = null;
  }, []);

  const start = useCallback(
    (next: PracticeConfig, source?: Translation[]) => {
      const available = source ?? pool;
      if (!available.length) return;

      const size = next.deckSize === "all" ? available.length : next.deckSize;
      setConfig(next);
      setDeck(shuffle(available).slice(0, size));
      setIndex(0);
      setRevealed(false);
      setChecked(false);
      setAnswers({});
      setLog([]);
      setTimeLeft(next.mode === "recall" ? next.timer : 0);
      setPhase("active");
    },
    [pool]
  );

  const record = useCallback(
    (correct: boolean) => {
      if (!current) return;
      setLog((prev) =>
        prev.some((entry) => entry.word._id === current._id)
          ? prev
          : [...prev, { word: current, correct }]
      );
    },
    [current]
  );

  const next = useCallback(() => {
    clearTimer();
    if (isLast) {
      setPhase("summary");
      return;
    }
    setIndex((i) => i + 1);
    setRevealed(false);
    setChecked(false);
    setAnswers({});
    setTimeLeft(config.mode === "recall" ? config.timer : 0);
  }, [clearTimer, isLast, config.mode, config.timer]);

  const reveal = useCallback(() => {
    clearTimer();
    setRevealed(true);
  }, [clearTimer]);

  const answerRecall = useCallback(
    (remembered: boolean) => {
      record(remembered);
      setRevealed(true);
      clearTimer();
    },
    [record, clearTimer]
  );

  const checkWriting = useCallback(() => {
    if (!current || checked) return;
    const expected = Object.entries(current.result.translations);
    const allRight = expected.every(
      ([lang, value]) => gradeAnswer(answers[lang] ?? "", value) !== "wrong"
    );
    record(allRight);
    setChecked(true);
    setRevealed(true);
  }, [current, checked, answers, record]);

  const endSession = useCallback(() => {
    clearTimer();
    setPhase("summary");
  }, [clearTimer]);

  const backToSetup = useCallback(() => {
    clearTimer();
    setPhase("setup");
    setDeck([]);
    setLog([]);
  }, [clearTimer]);

  const retryMissed = useCallback(() => {
    const missed = log.filter((entry) => !entry.correct).map((entry) => entry.word);
    if (missed.length) start({ ...config, deckSize: "all" }, missed);
  }, [log, config, start]);

  // countdown only runs while a recall card is still hidden
  useEffect(() => {
    if (phase !== "active" || config.mode !== "recall" || revealed || !config.timer) {
      clearTimer();
      return;
    }

    tick.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearTimer();
          setRevealed(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return clearTimer;
  }, [phase, config.mode, config.timer, revealed, index, clearTimer]);

  useEffect(() => clearTimer, [clearTimer]);

  const stats = useMemo(() => {
    const correct = log.filter((entry) => entry.correct).length;
    return {
      correct,
      wrong: log.length - correct,
      answered: log.length,
      accuracy: log.length ? Math.round((correct / log.length) * 100) : 0,
      missed: log.filter((entry) => !entry.correct).map((entry) => entry.word),
    };
  }, [log]);

  return {
    // data
    pool,
    isLoading,
    isError,
    // session
    phase,
    config,
    setConfig,
    deck,
    index,
    current,
    isLast,
    revealed,
    checked,
    answers,
    setAnswers,
    timeLeft,
    stats,
    // actions
    start,
    reveal,
    next,
    answerRecall,
    checkWriting,
    endSession,
    backToSetup,
    retryMissed,
  };
}

export type PracticeSession = ReturnType<typeof usePracticeSession>;
