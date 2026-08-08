"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, Keyboard, Layers, Play, Timer, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { PracticeConfig, PracticeSession } from "@/hooks/usePracticeSession";

const MODES = [
  { value: "recall" as const, icon: Zap },
  { value: "writing" as const, icon: Keyboard },
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
  const t = useTranslations("practice");
  const [draft, setDraft] = useState<PracticeConfig>(config);

  if (!pool.length) {
    return (
      <div className="surface-card mx-auto max-w-md p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2">
          <Layers className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="font-display text-xl font-semibold">{t("emptyTitle")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t("emptyBody")}
        </p>
        <Button asChild className="mt-5 gap-2">
          <Link href="/dashboard">
            {t("translateAWord")}{" "}
            <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
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
          {t("deckCount", { count: pool.length })}
        </p>
        <h2 className="mt-1 font-display text-2xl font-bold">{t("setupTitle")}</h2>
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
                {t(mode.value === "recall" ? "modeRecall" : "modeWriting")}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                {t(mode.value === "recall" ? "modeRecallHint" : "modeWritingHint")}
              </span>
            </button>
          );
        })}
      </div>

      <OptionRow label={t("deckSize")} icon={<Layers className="h-4 w-4" />}>
        {DECK_SIZES.map((size) => (
          <Pill
            key={String(size)}
            active={draft.deckSize === size}
            onClick={() => setDraft((d) => ({ ...d, deckSize: size }))}
          >
            {size === "all" ? t("all") : size}
          </Pill>
        ))}
      </OptionRow>

      {draft.mode === "recall" && (
        <OptionRow label={t("revealAfter")} icon={<Timer className="h-4 w-4" />}>
          {TIMERS.map((seconds) => (
            <Pill
              key={seconds}
              active={draft.timer === seconds}
              onClick={() => setDraft((d) => ({ ...d, timer: seconds }))}
            >
              {seconds === 0 ? t("off") : t("seconds", { count: seconds })}
            </Pill>
          ))}
        </OptionRow>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-border bg-surface-2/50 px-5 py-4">
        <span className="text-sm text-muted-foreground">
          {t("linedUp", { count: deckCount })}
        </span>
        <Button size="lg" className="gap-2" onClick={() => start(draft)}>
          <Play className="h-4 w-4" />
          {t("start")}
        </Button>
      </div>
    </div>
  );
}
