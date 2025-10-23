import { useState } from "react";
import { useInView } from "react-intersection-observer";

export interface TranslationResult {
  translations: Record<string, string>;
  example: Record<string, string>;
}

export interface CommunityTranslation {
  userId: string;
  userName: string;
  userImage: string;
  sourceText: string;
  translationType: string;
  translationFilter: string;
  result: TranslationResult;
  createdAt: string | Date;
}
export function useCommunityLive() {
  const [selectedLangs, setSelectedLangs] = useState<Record<string, string>>(
    {}
  );
  const [audioLoading, setAudioLoading] = useState<Record<string, boolean>>({});

  const selectLanguage = (cardId: string, lang: string) => {
    setSelectedLangs((prev) => ({ ...prev, [cardId]: lang }));
  };
  const [translations, setTranslations] = useState<CommunityTranslation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.5 });

  const fetchTranslations = async (pageNum = 1) => {
    try {
      if (pageNum === 1) setIsLoading(true);
      else setLoadingMore(true);

      const res = await fetch(`/api/community/live?page=${pageNum}&limit=12`);
      const data = await res.json();

      if (pageNum === 1) {
        setTranslations(data.data);
      } else {
        const prevIds = new Set(
          translations.map((t) => t.userId + t.sourceText)
        );
        const newOnes = data.data.filter(
          (t: CommunityTranslation) => !prevIds.has(t.userId + t.sourceText)
        );

        if (newOnes.length > 0) {
          setNewCards((prev) => {
            const updated = new Set(prev);
            newOnes.forEach((t: CommunityTranslation) =>
              updated.add(t.userId + t.sourceText)
            );
            return updated;
          });

          setTimeout(() => {
            setNewCards((prev) => {
              const copy = new Set(prev);
              newOnes.forEach((t: CommunityTranslation) =>
                copy.delete(t.userId + t.sourceText)
              );
              return copy;
            });
          }, 3000);
        }

        setTranslations((prev) => [...prev, ...data.data]);
      }

      if (pageNum >= data.totalPages) setHasMore(false);

      setIsLoading(false);
      setLoadingMore(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setLoadingMore(false);
    }
  };

  const [newCards, setNewCards] = useState<Set<string>>(new Set());
  const speakText = (text: string, lang: string, cardId: string) => {
    if ("speechSynthesis" in window) {
      setAudioLoading((prev) => ({ ...prev, [cardId]: true }));
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = speechSynthesis
        .getVoices()
        .find((v) =>
          v.lang.toLowerCase().includes(lang.toLowerCase().substring(0, 2))
        );
      if (voice) utterance.voice = voice;
      utterance.onend = utterance.onerror = () =>
        setAudioLoading((prev) => ({ ...prev, [cardId]: false }));
      speechSynthesis.speak(utterance);
    }
  };

  return {
    selectLanguage,
    selectedLangs,
    audioLoading,
    setAudioLoading,
    translations,
    setTranslations,
    isLoading,
    setIsLoading,
    page,
    setPage,
    hasMore,
    setHasMore,
    loadingMore,
    setLoadingMore,
    ref,
    inView,
    fetchTranslations,
    newCards,
    setNewCards,
    speakText,
  };
}
