"use client";

import { useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { FaChartLine } from "react-icons/fa";
import { useCommunityLive } from "@/hooks/useCommunityLive";
import LiveTranslationsSkeleton from "./LiveTranslationsSkeleton";
import LiveTranslationCard from "./LiveTranslationCard";

export default function CommunityTranslations() {
  const {
    selectLanguage,
    selectedLangs,
    audioLoading,
    translations,
    isLoading,
    page,
    setPage,
    hasMore,
    loadingMore,
    ref,
    inView,
    fetchTranslations,
    newCards,
    speakText,
  } = useCommunityLive();

  useEffect(() => {
    fetchTranslations(1);
  }, []);

  useEffect(() => {
    if (inView && hasMore && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchTranslations(nextPage);
    }
  }, [inView]);

  return (
    <div className="mt-6 space-y-6 px-2 lg:px-4">
      <h2 className="text-xl md:text-2xl font-bold flex items-center justify-center gap-2 dark:text-white animate-pulse">
        <FaChartLine /> Live Community Translations
        <Badge variant="secondary">{translations.length}</Badge>
      </h2>
      {(isLoading || translations.length === 0) && <LiveTranslationsSkeleton />}

      {!isLoading && translations.length > 0 && (
        <div className="grid grid-cols-1 px-3 md:px-0 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {translations.map((t, idx) => {
            const langs = Object.keys(
              t.result.translations
            ) as (keyof typeof t.result.translations)[];
            const selectedLang =
              (selectedLangs[idx] as keyof typeof t.result.translations) ||
              langs[0];
            const translation = t.result.translations[selectedLang];
            const example = t.result.example[selectedLang];
            return (
              <LiveTranslationCard
                key={idx}
                t={t}
                idx={idx}
                langs={langs}
                selectedLang={selectedLang}
                translation={translation}
                example={example}
                selectLanguage={selectLanguage}
                audioLoading={audioLoading}
                speakText={speakText}
                newCards={newCards}
              />
            );
          })}
        </div>
      )}
      {hasMore && (
        <div ref={ref} className="h-12 flex justify-center items-center mt-4">
          {loadingMore && <FaSpinner className="animate-spin text-gray-500" />}
        </div>
      )}
    </div>
  );
}
