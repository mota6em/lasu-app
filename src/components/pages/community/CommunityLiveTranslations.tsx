"use client";

import { useRef, useState } from "react";
import { FaVolumeUp, FaSpinner } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaChartLine } from "react-icons/fa";
import { useEffect } from "react";
import Image from "next/image";

interface TranslationResult {
  translations: Record<string, string>;
  example: Record<string, string>;
}

interface CommunityTranslation {
  userId: string;
  userName: string;
  userImage: string;
  sourceText: string;
  translationType: string;
  translationFilter: string;
  result: TranslationResult;
  createdAt: string | Date;
}

export default function CommunityTranslations() {
  const [selectedLangs, setSelectedLangs] = useState<Record<string, string>>(
    {}
  );
  const [audioLoading, setAudioLoading] = useState<Record<string, boolean>>({});

  const selectLanguage = (cardId: string, lang: string) => {
    setSelectedLangs((prev) => ({ ...prev, [cardId]: lang }));
  };

  const [translations, setTranslations] = useState<CommunityTranslation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

    fetchTranslations(); // initial fetch
    const interval = setInterval(fetchTranslations, 10000); // every 10s
    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="mt-6 space-y-6 px-2 lg:px-4">
      <h2 className="text-xl md:text-2xl font-bold flex items-center justify-center gap-2 dark:text-white animate-pulse">
        <FaChartLine /> Live Community Translations
        <Badge variant="secondary">{translations.length}</Badge>
      </h2>
      {(isLoading || translations.length === 0) && (
        <div className="px-3 justify-center items-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="relative p-4 border rounded-xl shadow animate-pulse bg-gray-200 dark:bg-neutral-800/20">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="h-4 bg-gray-300 dark:bg-neutral-700 rounded w-16 mb-1"></div>
                  <div className="h-3 bg-gray-300 dark:bg-neutral-700 rounded w-10"></div>
                </div>
                <div className="flex flex-row gap-x-1 items-center">
                  <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-neutral-700"></div>
                  <div className="h-3 bg-gray-300 dark:bg-neutral-700 rounded w-16"></div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-6 w-12 rounded bg-gray-300 dark:bg-neutral-700"
                  ></div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="h-3 bg-gray-300 dark:bg-neutral-700 rounded w-16"></div>
                <div className="h-6 bg-gray-300 dark:bg-neutral-700 rounded w-full mt-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-neutral-700 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      )}
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
              <div
                key={idx}
                className={`relative p-4 border rounded-xl shadow hover:shadow-lg transition
                    ${
                      newCards.has(t.userId.toString() + t.sourceText)
                        ? "border-yellow-700 dark:border-yellow-400 shadow-lg animate-pulse"
                        : "bg-blue-950/5 dark:bg-blue-950/10"
                    }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {t.sourceText[0].toUpperCase() + t.sourceText.slice(1)}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {t.translationType} • {t.translationFilter}
                    </p>
                  </div>
                  <div className="flex flex-row gap-x-1 items-center justify-center text-xs text-muted-foreground">
                    <Image
                      src={t.userImage ?? "/imgs/userIcon.jpg"}
                      alt="User Avatar"
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <span className=" font-semibold ">
                      {t.userName! || "Anonymous"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {langs.map((lang) => (
                    <Button
                      key={lang}
                      className="text-xs px-2 py-0.5"
                      variant={selectedLang === lang ? "default" : "outline"}
                      onClick={() => selectLanguage(idx.toString(), lang)}
                    >
                      {lang}
                    </Button>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-yellow-700 dark:text-yellow-500/80">
                      {selectedLang}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        speakText(translation, selectedLang, idx.toString())
                      }
                      disabled={audioLoading[idx]}
                    >
                      {audioLoading[idx] ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaVolumeUp />
                      )}
                    </Button>
                  </div>

                  <div className="text-lg font-bold">{translation}</div>
                  {example && (
                    <div className="text-sm text-muted-foreground border-l-4  dark:border-yellow-400 border-yellow-600 pl-2">
                      "{example}"
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
