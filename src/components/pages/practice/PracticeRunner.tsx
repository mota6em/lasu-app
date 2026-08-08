"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SpeakButton from "@/components/ui/speak-button";
import { getLanguage, isRTL, langName } from "@/lib/languages";
import { gradeAnswer } from "@/lib/practice";
import { cn } from "@/lib/utils";
import type { PracticeSession } from "@/hooks/usePracticeSession";

function TimerRing({ value, total }: { value: number; total: number }) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const progress = total ? value / total : 0;

  return (
    <div className="relative h-10 w-10 shrink-0">
      <svg viewBox="0 0 40 40" className="h-full w-full -rotate-90">
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth="3"
        />
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke={progress > 0.25 ? "var(--color-brand-500)" : "var(--destructive)"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-mono text-xs font-semibold tabular-nums">
        {value}
      </span>
    </div>
  );
}

export default function PracticeRunner({
  current,
  deck,
  index,
  config,
  revealed,
  checked,
  answers,
  setAnswers,
  timeLeft,
  stats,
  reveal,
  next,
  answerRecall,
  checkWriting,
  endSession,
  isLast,
}: PracticeSession) {
  const t = useTranslations("practice");
  const firstInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (config.mode === "writing") firstInput.current?.focus();
  }, [index, config.mode]);

  useEffect(() => {
    if (config.mode !== "recall") return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        revealed ? next() : reveal();
      } else if (revealed && (e.key === "1" || e.key === "ArrowRight")) {
        next();
      } else if (!revealed && e.key === "1") {
        answerRecall(true);
      } else if (!revealed && e.key === "2") {
        answerRecall(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [config.mode, revealed, reveal, next, answerRecall]);

  if (!current) return null;

  const entries = Object.entries(current.result.translations);
  const progress = ((index + (revealed ? 1 : 0)) / deck.length) * 100;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-3">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-iris-500"
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 180, damping: 26 }}
          />
        </div>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {index + 1}/{deck.length}
        </span>
        <button
          onClick={endSession}
          className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {t("end")}
        </button>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <span className="inline-flex items-center gap-1.5 text-success">
          <Check className="h-3.5 w-3.5" />
          <span className="tabular-nums">{stats.correct}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 text-destructive">
          <X className="h-3.5 w-3.5" />
          <span className="tabular-nums">{stats.wrong}</span>
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current._id}
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="surface-card overflow-hidden"
        >
          <div className="relative flex items-center justify-center gap-4 border-b border-border bg-gradient-to-br from-brand-500/10 to-iris-500/10 px-6 py-10">
            <h2 className="text-center font-display text-3xl font-bold tracking-tight break-words md:text-4xl">
              {current.sourceText}
            </h2>
            {current.result.sourceLanguage && (
              <SpeakButton
                text={current.sourceText}
                lang={current.result.sourceLanguage}
                size={18}
              />
            )}
            {config.mode === "recall" && config.timer > 0 && !revealed && (
              <div className="absolute end-4 top-4">
                <TimerRing value={timeLeft} total={config.timer} />
              </div>
            )}
          </div>

          {config.mode === "recall" ? (
            <div className="p-5">
              <div className="grid gap-2 sm:grid-cols-2">
                {entries.map(([lang, translation]) => (
                  <div
                    key={lang}
                    className="rounded-xl border border-border bg-surface-2/60 p-3"
                  >
                    <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      <span aria-hidden>{getLanguage(lang)?.flag ?? "🌐"}</span>
                      {langName(lang)}
                    </span>
                    {revealed ? (
                      <motion.p
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        dir={isRTL(lang) ? "rtl" : "ltr"}
                        className="mt-1 font-display text-lg font-semibold"
                      >
                        {translation}
                      </motion.p>
                    ) : (
                      <div className="mt-2 h-5 w-24 rounded bg-surface-3 blur-[3px]" />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-2">
                {!revealed ? (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => answerRecall(true)}
                        className="h-11 gap-2 bg-success text-success-foreground shadow-none hover:brightness-105"
                      >
                        <Check className="h-4 w-4" /> {t("knewIt")}
                      </Button>
                      <Button
                        onClick={() => answerRecall(false)}
                        variant="outline"
                        className="h-11 gap-2 border-destructive/40 text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-4 w-4" /> {t("missedIt")}
                      </Button>
                    </div>
                    <button
                      onClick={reveal}
                      className="inline-flex items-center justify-center gap-1.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Eye className="h-3.5 w-3.5" /> {t("justShowMe")}
                    </button>
                  </>
                ) : (
                  <Button onClick={next} size="lg" className="h-11 w-full">
                    {isLast ? t("seeResults") : t("nextWord")}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {entries.map(([lang, translation], i) => {
                  const verdict = checked
                    ? gradeAnswer(answers[lang] ?? "", translation)
                    : null;
                  return (
                    <div key={lang}>
                      <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        <span aria-hidden>{getLanguage(lang)?.flag ?? "🌐"}</span>
                        {langName(lang)}
                      </label>
                      <Input
                        ref={i === 0 ? firstInput : undefined}
                        value={answers[lang] ?? ""}
                        disabled={checked}
                        dir={isRTL(lang) ? "rtl" : "ltr"}
                        onChange={(e) =>
                          setAnswers((prev) => ({ ...prev, [lang]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            checked ? next() : checkWriting();
                          }
                        }}
                        placeholder={t("typeIn", { language: langName(lang) })}
                        className={cn(
                          verdict === "correct" && "border-success",
                          verdict === "close" && "border-warning",
                          verdict === "wrong" && "border-destructive"
                        )}
                      />
                      {checked && (
                        <p
                          className={cn(
                            "mt-1.5 flex items-center gap-1.5 text-xs",
                            verdict === "wrong" ? "text-destructive" : "text-success"
                          )}
                        >
                          {verdict === "wrong" ? (
                            <X className="h-3.5 w-3.5" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                          <span dir={isRTL(lang) ? "rtl" : "ltr"}>{translation}</span>
                          {verdict === "close" && (
                            <span className="text-warning">· {t("closeEnough")}</span>
                          )}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-5">
                {checked ? (
                  <Button onClick={next} size="lg" className="h-11 w-full">
                    {isLast ? t("seeResults") : t("nextWord")}
                  </Button>
                ) : (
                  <Button
                    onClick={checkWriting}
                    size="lg"
                    className="h-11 w-full"
                    disabled={entries.every(([lang]) => !answers[lang]?.trim())}
                  >
                    {t("checkAnswers")}
                  </Button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {config.mode === "recall" && (
        <p className="text-center text-[11px] text-muted-foreground">
          {t.rich("shortcuts", {
            kbd: (chunks) => <kbd className="kbd">{chunks}</kbd>,
          })}
        </p>
      )}
    </div>
  );
}
