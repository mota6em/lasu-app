"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ClipboardPaste, CornerDownLeft, Loader2, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslateStore } from "@/store/useTranslateStore";
import { getLanguage } from "@/lib/languages";
import { cn } from "@/lib/utils";
import type { TranslateHook } from "@/types/translation";

const MAX_CHARS = 1000;

const TONES = [
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "slang", label: "Slang" },
  { value: "academic", label: "Academic" },
  { value: "funny", label: "Funny" },
];

const STARTERS = [
  "serendipity",
  "how do I get to the station?",
  "ubuntu",
  "nice to meet you",
];

type Props = Pick<
  TranslateHook,
  | "text"
  | "setText"
  | "handleTranslate"
  | "handlePasteInline"
  | "toggleSettingsDialog"
  | "resultLoading"
>;

export default function TranslateComposer({
  text,
  setText,
  handleTranslate,
  handlePasteInline,
  toggleSettingsDialog,
  resultLoading,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const appliedFromUrl = useRef<string | null>(null);
  const searchParams = useSearchParams();
  const urlText = searchParams?.get("text") ?? null;
  const selectedLanguages = useTranslateStore((s) => s.selectedLanguages);
  const translationType = useTranslateStore((s) => s.translationType);
  const setTranslationType = useTranslateStore((s) => s.setTranslationType);

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 320)}px`;
  }, [text]);

  // ?text= is how the extension, the palette and the recent chips hand work over
  useEffect(() => {
    if (!urlText || urlText === appliedFromUrl.current) return;
    appliedFromUrl.current = urlText;
    setText(urlText);
    textareaRef.current?.focus();
  }, [urlText, setText]);

  useEffect(() => {
    const focusOnSlash = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typingElsewhere =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (e.key === "/" && !typingElsewhere) {
        e.preventDefault();
        textareaRef.current?.focus();
      }
    };
    window.addEventListener("keydown", focusOnSlash);
    return () => window.removeEventListener("keydown", focusOnSlash);
  }, []);

  const remaining = MAX_CHARS - text.length;
  const overBudget = remaining < 0;
  const canSubmit = text.trim().length > 0 && !overBudget && !resultLoading;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) handleTranslate();
      }}
      className="relative"
    >
      <div
        className={cn(
          "surface-card overflow-hidden transition-shadow duration-300",
          "focus-within:shadow-[var(--shadow-lift)] focus-within:border-brand-400/60"
        )}
      >
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
          <span className="text-xs font-medium text-muted-foreground">Into</span>

          <div className="flex flex-wrap items-center gap-1.5">
            {selectedLanguages.map((lang) => {
              const meta = getLanguage(lang.value);
              return (
                <button
                  key={lang.value}
                  type="button"
                  onClick={toggleSettingsDialog}
                  title="Change target languages"
                  className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs font-medium transition-colors hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40"
                >
                  <span aria-hidden>{meta?.flag ?? "🌐"}</span>
                  <span>{meta?.name ?? lang.value}</span>
                </button>
              );
            })}
            {selectedLanguages.length < 4 && (
              <button
                type="button"
                onClick={toggleSettingsDialog}
                className="inline-flex h-[26px] items-center gap-1 rounded-full border border-dashed border-border-strong px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:border-brand-400 hover:text-brand-600"
              >
                + Add
              </button>
            )}
          </div>

          <div className="ms-auto flex items-center gap-1 rounded-full bg-surface-2 p-0.5">
            {TONES.map((tone) => {
              const active = translationType === tone.value;
              return (
                <button
                  key={tone.value}
                  type="button"
                  onClick={() => setTranslationType(tone.value)}
                  className={cn(
                    "relative rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                    active
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="tone-pill"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      className="absolute inset-0 rounded-full bg-primary"
                    />
                  )}
                  <span className="relative">{tone.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            const submitCombo =
              e.key === "Enter" && (e.metaKey || e.ctrlKey || !e.shiftKey);
            if (submitCombo) {
              e.preventDefault();
              if (canSubmit) handleTranslate();
            }
          }}
          rows={3}
          placeholder="Type a word or paste a sentence…"
          aria-label="Text to translate"
          className="w-full resize-none bg-transparent px-4 py-4 text-lg leading-relaxed outline-none placeholder:text-muted-foreground/70 md:text-xl"
        />

        <div className="flex items-center gap-2 border-t border-border px-3 py-2.5">
          <button
            type="button"
            onClick={handlePasteInline}
            title="Paste from clipboard"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <ClipboardPaste className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setText("");
              textareaRef.current?.focus();
            }}
            disabled={!text}
            title="Clear"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>

          <span
            className={cn(
              "font-mono text-[11px] tabular-nums",
              overBudget
                ? "text-destructive"
                : remaining < 120
                ? "text-warning"
                : "text-muted-foreground/70"
            )}
          >
            {text.length}/{MAX_CHARS}
          </span>

          <div className="ms-auto flex items-center gap-3">
            <span className="hidden items-center gap-1 text-[11px] text-muted-foreground sm:flex">
              <kbd className="kbd">↵</kbd> to translate
            </span>
            <Button type="submit" disabled={!canSubmit} className="gap-2 px-5">
              {resultLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Translating
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Translate
                  <CornerDownLeft className="h-3.5 w-3.5 opacity-60" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {!text && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Try</span>
          {STARTERS.map((starter) => (
            <button
              key={starter}
              type="button"
              onClick={() => {
                setText(starter);
                textareaRef.current?.focus();
              }}
              className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-brand-400 hover:text-foreground"
            >
              {starter}
            </button>
          ))}
        </div>
      )}
    </form>
  );
}
