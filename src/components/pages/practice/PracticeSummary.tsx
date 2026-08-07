"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import { RotateCcw, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLanguage, langName } from "@/lib/languages";
import type { PracticeSession } from "@/hooks/usePracticeSession";

function verdict(accuracy: number, answered: number) {
  if (!answered) return { title: "Session ended", line: "No answers recorded this round." };
  if (accuracy === 100)
    return { title: "Flawless", line: "Every single word. Time for a bigger deck." };
  if (accuracy >= 80)
    return { title: "Sharp", line: "That is solid recall — keep the streak alive." };
  if (accuracy >= 50)
    return { title: "Getting there", line: "The misses below are worth one more pass." };
  return { title: "Rough round", line: "Run the missed words again while they are fresh." };
}

export default function PracticeSummary({
  stats,
  deck,
  backToSetup,
  retryMissed,
}: Pick<PracticeSession, "stats" | "deck" | "backToSetup" | "retryMissed">) {
  const { title, line } = verdict(stats.accuracy, stats.answered);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-xl space-y-4"
    >
      <div className="surface-card overflow-hidden p-6 text-center">
        <div className="relative mx-auto h-32 w-32">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="var(--surface-3)"
              strokeWidth="9"
            />
            <motion.circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="var(--color-brand-500)"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{
                strokeDashoffset: circumference * (1 - stats.accuracy / 100),
              }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-3xl font-bold tabular-nums">
              <CountUp end={stats.accuracy} duration={1.2} />%
            </span>
            <span className="text-[11px] text-muted-foreground">accuracy</span>
          </div>
        </div>

        <h2 className="mt-4 font-display text-2xl font-bold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{line}</p>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { label: "Correct", value: stats.correct, tone: "text-success" },
            { label: "Missed", value: stats.wrong, tone: "text-destructive" },
            { label: "Cards", value: deck.length, tone: "text-foreground" },
          ].map((cell) => (
            <div key={cell.label} className="rounded-xl bg-surface-2 py-3">
              <p className={`font-display text-xl font-bold tabular-nums ${cell.tone}`}>
                {cell.value}
              </p>
              <p className="text-[11px] text-muted-foreground">{cell.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          {stats.missed.length > 0 && (
            <Button onClick={retryMissed} className="flex-1 gap-2">
              <Target className="h-4 w-4" />
              Redo the {stats.missed.length} missed
            </Button>
          )}
          <Button onClick={backToSetup} variant="outline" className="flex-1 gap-2">
            <RotateCcw className="h-4 w-4" />
            New session
          </Button>
        </div>
      </div>

      {stats.missed.length > 0 && (
        <div className="surface-card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border px-5 py-3">
            <Sparkles className="h-4 w-4 text-brand-500" />
            <p className="text-sm font-semibold">Worth another look</p>
          </div>
          <ul className="divide-y divide-border">
            {stats.missed.map((word) => (
              <li key={word._id} className="px-5 py-3">
                <p className="font-medium">{word.sourceText}</p>
                <p className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                  {Object.entries(word.result.translations).map(([lang, value]) => (
                    <span key={lang}>
                      <span aria-hidden>{getLanguage(lang)?.flag ?? "🌐"}</span>{" "}
                      <span className="sr-only">{langName(lang)}: </span>
                      {value}
                    </span>
                  ))}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
