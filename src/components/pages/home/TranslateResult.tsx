"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb, Quote, Sparkles } from "lucide-react";
import CopyButton from "@/components/ui/copy-button";
import SpeakButton from "@/components/ui/speak-button";
import { getLanguage, isRTL, langFlag, langName } from "@/lib/languages";
import { useTranslateStore } from "@/store/useTranslateStore";
import { cn } from "@/lib/utils";
import type { TranslateHook } from "@/types/translation";
import type { PartialTranslation } from "@/lib/partialTranslation";

type Props = Pick<
  TranslateHook,
  "result" | "resultLoading" | "submittedText" | "error" | "image" | "partial"
>;

const CEFR_TONE: Record<string, string> = {
  A1: "bg-success/12 text-success border-success/25",
  A2: "bg-success/12 text-success border-success/25",
  B1: "bg-brand-500/12 text-brand-700 dark:text-brand-300 border-brand-500/25",
  B2: "bg-brand-500/12 text-brand-700 dark:text-brand-300 border-brand-500/25",
  C1: "bg-iris-500/12 text-iris-600 dark:text-iris-300 border-iris-500/25",
  C2: "bg-iris-500/12 text-iris-600 dark:text-iris-300 border-iris-500/25",
};

function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground",
        className
      )}
    >
      {children}
    </span>
  );
}

function TranslatingPanel({
  image,
  partial,
}: {
  image: string | null;
  partial: PartialTranslation;
}) {
  const t = useTranslations("result");
  const selectedLanguages = useTranslateStore((s) => s.selectedLanguages);
  const streamed = Object.keys(partial.translations).length > 0;

  const steps = useMemo(() => {
    const lines = [image ? t("loadingReadingImage") : t("loadingThinking")];
    for (const lang of selectedLanguages.slice(0, 4)) {
      lines.push(t("loadingTranslating", { language: langName(lang.value) }));
    }
    lines.push(t("loadingPolishing"), t("loadingAlmost"));
    return lines;
  }, [image, selectedLanguages, t]);

  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(5);

  useEffect(() => {
    const advance = setInterval(
      () => setStep((s) => Math.min(s + 1, steps.length - 1)),
      1350
    );
    const grow = setInterval(
      () => setProgress((p) => p + (96 - p) * 0.035),
      90
    );
    return () => {
      clearInterval(advance);
      clearInterval(grow);
    };
  }, [steps.length]);

  const filled = Object.keys(partial.translations).length;
  const shown = streamed
    ? Math.min(
        97,
        Math.max(progress, 20 + (filled / Math.max(selectedLanguages.length, 1)) * 75)
      )
    : progress;

  return (
    <div className="space-y-3">
      <div className="surface-card overflow-hidden p-5">
        <div className="flex items-center gap-2.5">
          <Sparkles className="h-4 w-4 shrink-0 animate-pulse text-brand-500" />
          <span className="text-sm font-semibold">{t("loadingTitle")}</span>
          <span className="ml-auto text-[11px] tabular-nums text-muted-foreground">
            {Math.round(shown)}%
          </span>
        </div>

        <div
          className="mt-3 h-1 w-full overflow-hidden rounded-full bg-surface-2"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(shown)}
          aria-label={t("loadingTitle")}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-iris-500"
            animate={{ width: `${shown}%` }}
            transition={{ ease: "linear", duration: 0.12 }}
          />
        </div>

        <div className="mt-3 h-5 overflow-hidden" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p
              key={image && partial.sourceText ? "source" : step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="text-xs text-muted-foreground"
            >
              {image && partial.sourceText ? partial.sourceText : steps[step]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {selectedLanguages.slice(0, 4).map((lang, i) => {
        const streaming = partial.translations[lang.value];

        return (
          <div
            key={lang.value}
            className="surface-card animate-fade-up p-5"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <div className="flex items-center gap-2">
              <span aria-hidden>{langFlag(lang.value)}</span>
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {langName(lang.value)}
              </span>
              {!streaming && <Chip className="ml-auto">{t("loadingWaiting")}</Chip>}
            </div>

            {streaming ? (
              <p
                dir={isRTL(lang.value) ? "rtl" : "ltr"}
                className="mt-2 font-display text-2xl font-semibold leading-snug break-words"
              >
                {streaming}
                <span className="ms-0.5 inline-block h-5 w-[2px] translate-y-0.5 animate-pulse bg-brand-500 align-middle" />
              </p>
            ) : (
              <>
                <div className="shimmer mt-3 h-6 w-3/5 rounded-md" />
                <div className="shimmer mt-2.5 h-3 w-4/5 rounded-md" />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function EmptyPanel() {
  const t = useTranslations("result");
  const tips = [
    {
      icon: <Sparkles className="h-4 w-4 text-brand-500" />,
      title: t("tipWordsTitle"),
      body: t("tipWordsBody"),
    },
    {
      icon: <Quote className="h-4 w-4 text-iris-500" />,
      title: t("tipSentencesTitle"),
      body: t("tipSentencesBody"),
    },
    {
      icon: <Lightbulb className="h-4 w-4 text-brand-500" />,
      title: t("tipSavedTitle"),
      body: t("tipSavedBody"),
    },
  ];

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-border bg-surface-2/60 px-5 py-3">
        <p className="text-sm font-semibold">{t("landHere")}</p>
      </div>
      <ul className="divide-y divide-border">
        {tips.map((tip) => (
          <li key={tip.title} className="flex gap-3 px-5 py-4">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2">
              {tip.icon}
            </span>
            <div>
              <p className="text-sm font-medium">{tip.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {tip.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TranslateResult({
  result,
  resultLoading,
  submittedText,
  error,
  image,
  partial,
}: Props) {
  const t = useTranslations("result");

  if (resultLoading) return <TranslatingPanel image={image} partial={partial} />;

  if (error && !result) {
    return (
      <div className="surface-card border-destructive/30 bg-destructive/5 p-5">
        <p className="text-sm font-medium text-destructive">{error}</p>
        <p className="mt-1 text-xs text-muted-foreground">{t("errorHint")}</p>
      </div>
    );
  }

  if (!result) return <EmptyPanel />;

  const entries = Object.entries(result.translations ?? {});
  const source = result.sourceLanguage;
  const sourceMeta = source ? getLanguage(source) : undefined;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={submittedText}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-3"
      >
        <div className="surface-card relative overflow-hidden p-5">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-400/20 blur-3xl"
          />
          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p
                dir={source && isRTL(source) ? "rtl" : "ltr"}
                className="font-display text-2xl font-bold leading-tight break-words md:text-3xl"
              >
                {submittedText}
              </p>
              {result.meaning && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {result.meaning}
                </p>
              )}
            </div>
            {source && <SpeakButton text={submittedText} lang={source} size={17} />}
          </div>

          <div className="relative mt-3 flex flex-wrap items-center gap-1.5">
            {sourceMeta && (
              <Chip className="border-border-strong">
                <span aria-hidden>{sourceMeta.flag}</span>
                {sourceMeta.name}
              </Chip>
            )}
            {result.partOfSpeech && <Chip>{result.partOfSpeech}</Chip>}
            {result.difficulty && (
              <Chip className={CEFR_TONE[result.difficulty] ?? ""}>
                {result.difficulty}
              </Chip>
            )}
            {result.synonyms?.map((syn) => (
              <Chip key={syn} className="italic">
                {syn}
              </Chip>
            ))}
          </div>
        </div>

        {entries.map(([lang, translation], index) => {
          const meta = getLanguage(lang);
          const rtl = isRTL(lang);
          const romanized = result.romanization?.[lang];
          const example = result.example?.[lang];
          const exampleMeaning = result.exampleMeaning?.[lang];

          return (
            <motion.div
              key={lang}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.06 * (index + 1),
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="surface-card lift group p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <span className="text-base" aria-hidden>
                    {meta?.flag ?? "🌐"}
                  </span>
                  {langName(lang)}
                </span>
                <div className="flex items-center gap-0.5 opacity-60 transition-opacity group-hover:opacity-100">
                  <SpeakButton text={translation} lang={lang} />
                  <CopyButton value={translation} />
                </div>
              </div>

              <p
                dir={rtl ? "rtl" : "ltr"}
                className="mt-2 font-display text-2xl font-semibold leading-snug break-words"
              >
                {translation}
              </p>

              {romanized && (
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {romanized}
                </p>
              )}

              {example && (
                <div className="mt-4 rounded-lg border-s-2 border-brand-400 bg-surface-2/70 py-2.5 pe-3 ps-3">
                  <p
                    dir={rtl ? "rtl" : "ltr"}
                    className="text-sm leading-relaxed"
                  >
                    {example}
                  </p>
                  {exampleMeaning && (
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {exampleMeaning}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}

        {result.note && (
          <div className="flex gap-2.5 rounded-xl border border-iris-500/25 bg-iris-500/8 px-4 py-3">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-iris-500" />
            <p className="text-xs leading-relaxed text-foreground/80">{result.note}</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
