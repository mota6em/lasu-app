"use client";

import { Radio } from "lucide-react";
import LiveTranslationCard from "./LiveTranslationCard";
import LiveTranslationsSkeleton from "./LiveTranslationsSkeleton";
import { useCommunityLive } from "@/hooks/useCommunityLive";

export default function CommunityLiveTranslations() {
  const { translations, isLoading, newCards, selectedLangs, selectLanguage } =
    useCommunityLive();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
          </span>
          Live translations
        </h2>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Radio className="h-3.5 w-3.5" />
          Updating every 10s
        </span>
      </div>

      {isLoading && translations.length === 0 ? (
        <LiveTranslationsSkeleton />
      ) : translations.length === 0 ? (
        <div className="surface-card p-10 text-center">
          <p className="text-sm font-medium">The feed is quiet right now</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Translate a word and yours will be the first one here.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {translations.map((translation, index) => {
            const cardId = `${translation.userId}-${translation.sourceText}`;
            return (
              <LiveTranslationCard
                key={cardId}
                cardId={cardId}
                translation={translation}
                isNew={newCards.has(translation.userId.toString() + translation.sourceText)}
                selectedLang={selectedLangs[index.toString()] ?? ""}
                onSelectLang={(lang) => selectLanguage(index.toString(), lang)}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
