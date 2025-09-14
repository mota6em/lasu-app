"use client";

import { useState } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/community/live");
        const data = await res.json();
        setTranslations(data);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTranslations(); // initial fetch
    const interval = setInterval(fetchTranslations, 5000); // every 5s
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
      <h2 className="text-2xl font-bold flex items-center gap-2 dark:text-white animate-pulse">
        <FaChartLine /> Live Community Translations
        <Badge variant="secondary">{translations.length}</Badge>
      </h2>
      {(isLoading || translations.length === 0) && (
        <div className="flex justify-center items-center">
          <FaSpinner className="animate-spin" />
        </div>
      )}
      {!isLoading && translations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-[400px] overflow-y-scroll">
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
                className="relative  p-4 border rounded-xl shadow hover:shadow-lg bg-blue-950/5 dark:bg-blue-950/10 transition"
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
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
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
                    <div className="text-sm text-muted-foreground border-l-4 border-green-400 pl-2">
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
