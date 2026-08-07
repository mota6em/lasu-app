"use client";

import { useState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";
import CopyButton from "@/components/ui/copy-button";
import SpeakButton from "@/components/ui/speak-button";
import { getLanguage, isRTL, langName } from "@/lib/languages";
import { shortTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import Translation from "@/types/translation";

interface HistoryCardProps {
  item: Translation;
  onDelete: (id: string) => void;
}

export default function HistoryCard({ item, onDelete }: HistoryCardProps) {
  const [expanded, setExpanded] = useState(false);

  const entries = Object.entries(item.result?.translations ?? {});
  const examples = item.result?.example ?? {};
  const hasExtras =
    Object.keys(examples).length > 0 || !!item.result?.note || !!item.result?.meaning;

  return (
    <article className="surface-card lift group flex flex-col overflow-hidden">
      <div className="flex items-start justify-between gap-2 px-4 pt-3.5">
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-semibold leading-tight">
            {item.sourceText}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span>{shortTime(item.createdAt)}</span>
            <span aria-hidden>·</span>
            <span className="capitalize">{item.translationType}</span>
            {item.result?.difficulty && (
              <>
                <span aria-hidden>·</span>
                <span>{item.result.difficulty}</span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={() => onDelete(item._id.toString())}
          aria-label="Delete translation"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 divide-y divide-border border-t border-border">
        {entries.map(([lang, text]) => (
          <div key={lang} className="flex items-center gap-3 px-4 py-2.5">
            <span className="w-6 shrink-0 text-center text-sm" aria-hidden>
              {getLanguage(lang)?.flag ?? "🌐"}
            </span>
            <div className="min-w-0 flex-1">
              <p
                dir={isRTL(lang) ? "rtl" : "ltr"}
                className="truncate text-sm font-medium"
              >
                {String(text)}
              </p>
              {item.result?.romanization?.[lang] && (
                <p className="truncate font-mono text-[10px] text-muted-foreground">
                  {item.result.romanization[lang]}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100">
              <SpeakButton text={String(text)} lang={lang} size={14} />
              <CopyButton value={String(text)} size={14} />
            </div>
          </div>
        ))}
      </div>

      {hasExtras && (
        <>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center justify-center gap-1 border-t border-border py-2 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            {expanded ? "Hide details" : "Examples & notes"}
            <ChevronDown
              className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")}
            />
          </button>

          {expanded && (
            <div className="space-y-3 border-t border-border bg-surface-2/50 px-4 py-3">
              {item.result?.meaning && (
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {item.result.meaning}
                </p>
              )}

              {Object.entries(examples).map(([lang, sentence]) => (
                <div key={lang} className="border-s-2 border-brand-400 ps-2.5">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {langName(lang)}
                  </p>
                  <p dir={isRTL(lang) ? "rtl" : "ltr"} className="text-xs leading-relaxed">
                    {sentence}
                  </p>
                  {item.result?.exampleMeaning?.[lang] && (
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      {item.result.exampleMeaning[lang]}
                    </p>
                  )}
                </div>
              ))}

              {item.result?.note && (
                <p className="rounded-lg bg-iris-500/10 px-2.5 py-2 text-[11px] leading-relaxed text-foreground/80">
                  {item.result.note}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </article>
  );
}
