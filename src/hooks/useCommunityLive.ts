"use client";
import { useEffect, useRef, useState } from "react";

interface TranslationResult {
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
  const [translations, setTranslations] = useState<CommunityTranslation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newCards, setNewCards] = useState<Set<string>>(new Set());
  const seenCardIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    let firstLoad = true;

    const fetchTranslations = async () => {
      try {
        if (firstLoad) setIsLoading(true);

        const res = await fetch("/api/community/live");
        const data: CommunityTranslation[] = await res.json();

        const currentIds = new Set(
          data.map((t) => t.userId.toString() + t.sourceText)
        );
        const newIds = Array.from(currentIds).filter(
          (id) => !seenCardIds.current.has(id)
        );

        if (newIds.length > 0) {
          setNewCards((prev) => {
            const updated = new Set([...prev, ...newIds]);
            return updated;
          });

          setTimeout(() => {
            setNewCards((prev) => {
              const copy = new Set(prev);
              newIds.forEach((id) => copy.delete(id));
              return copy;
            });
          }, 3500);
        }

        seenCardIds.current = new Set([...seenCardIds.current, ...currentIds]);
        setTranslations(data);

        if (firstLoad) setIsLoading(false);
        firstLoad = false;
      } catch (err) {
        console.error(err);
        if (firstLoad) setIsLoading(false);
        firstLoad = false;
      }
    };

    fetchTranslations();
    const interval = setInterval(fetchTranslations, 10000);
    return () => clearInterval(interval);
  }, []);

  const [selectedLangs, setSelectedLangs] = useState<Record<string, string>>(
    {}
  );
  const [audioLoading, setAudioLoading] = useState<Record<string, boolean>>({});

  const selectLanguage = (cardId: string, lang: string) => {
    setSelectedLangs((prev) => ({ ...prev, [cardId]: lang }));
  };

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
    translations,
    isLoading,
    newCards,
    selectedLangs,
    audioLoading,
    selectLanguage,
    speakText,
  };
}
