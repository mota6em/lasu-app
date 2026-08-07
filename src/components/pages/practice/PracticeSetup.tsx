"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Keyboard, Layers, Play, Timer, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PracticeConfig, PracticeSession } from "@/hooks/usePracticeSession";

const MODES = [
  {
    value: "recall" as const,
    label: "Recall",
    hint: "See the word, remember the meaning, flip the card.",
    icon: Zap,
  },
  {
    value: "writing" as const,
    label: "Writing",
    hint: "Type each translation yourself. Typos are forgiven.",
    icon: Keyboard,
  },
];

const DECK_SIZES: (number | "all")[] = [10, 20, 50, "all"];
const TIMERS = [0, 10, 15, 30];

function OptionRow({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3.5">
      <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {icon}
        {label}
      </span>
      <div className="flex gap-1.5">{children}</div>
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-w-11 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all",
        active
          ? "border-brand-500 bg-brand-500/12 text-foreground"
          : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

export default function PracticeSetup({
  pool,
  config,
  start,
}: Pick<PracticeSession, "pool" | "config" | "start">) {
  const [draft, setDraft] = useState<PracticeConfig>(config);

  if (!pool.length) {
    return (
      <div className="surface-card mx-auto max-w-md p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2">
          <Layers className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="font-display text-xl font-semibold">
          No words to practise yet
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Single words you translate land here automatically. Translate a few and
          this turns into your personal deck.
        </p>
        <Button asChild className="mt-5 gap-2">
          <Link href="/dashboard">
            Translate a word <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  const deckCount =
    draft.deckSize === "all" ? pool.length : Math.min(draft.deckSize, pool.length);

  return (
    <div className="surface-card mx-auto w-full max-w-xl overflow-hidden">
      <div className="px-5 py-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {pool.length} words in your deck
        </p>
        <h2 className="mt-1 font-display text-2xl font-bold">Set up your session</h2>
      </div>

      <div className="grid gap-2 border-t border-border px-5 py-4 sm:grid-cols-2">
        {MODES.map((mode) => {
          const active = draft.mode === mode.value;
          const Icon = mode.icon;
          return (
            <button
              key={mode.value}
              type="button"
              onClick={() => setDraft((d) => ({ ...d, mode: mode.value }))}
              className={cn(
                "rounded-xl border p-3.5 text-left transition-all",
                active
                  ? "border-brand-500 bg-brand-500/10 shadow-[var(--shadow-brand)]"
                  : "border-border bg-surface hover:border-border-strong hover:bg-surface-2"
              )}
            >
              <span className="flex items-center gap-2 text-sm font-semibold">
                <Icon className="h-4 w-4 text-brand-500" />
                {mode.label}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                {mode.hint}
              </span>
            </button>
          );
        })}
      </div>

      <OptionRow label="Words this round" icon={<Layers className="h-4 w-4" />}>
        {DECK_SIZES.map((size) => (
          <Pill
            key={String(size)}
            active={draft.deckSize === size}
            onClick={() => setDraft((d) => ({ ...d, deckSize: size }))}
          >
            {size === "all" ? "All" : size}
          </Pill>
        ))}
      </OptionRow>

      {draft.mode === "recall" && (
        <OptionRow label="Reveal after" icon={<Timer className="h-4 w-4" />}>
          {TIMERS.map((seconds) => (
            <Pill
              key={seconds}
              active={draft.timer === seconds}
              onClick={() => setDraft((d) => ({ ...d, timer: seconds }))}
            >
              {seconds === 0 ? "Off" : `${seconds}s`}
            </Pill>
          ))}
        </OptionRow>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-border bg-surface-2/50 px-5 py-4">
        <span className="text-sm text-muted-foreground">
          {deckCount} {deckCount === 1 ? "word" : "words"} lined up
        </span>
        <Button size="lg" className="gap-2" onClick={() => start(draft)}>
          <Play className="h-4 w-4" />
          Start practising
        </Button>
      </div>
    </div>
  );
}
