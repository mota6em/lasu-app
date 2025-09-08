"use client";

import { useState } from "react";
import { FaVolumeUp, FaSpinner } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaChartLine } from "react-icons/fa";

export default function CommunityTranslations() {
  const [selectedLangs, setSelectedLangs] = useState<Record<string, string>>(
    {}
  );
  const [audioLoading, setAudioLoading] = useState<Record<string, boolean>>({});

  const selectLanguage = (cardId: string, lang: string) => {
    setSelectedLangs((prev) => ({ ...prev, [cardId]: lang }));
  };

  //mock translations data for testing
  const translations = [
    {
      userId: "user1",
      sourceText: "Hello",
      translationType: "Direct",
      translationFilter: "word",
      result: {
        translations: {
          Hungarian: "Szia",
          Arabic: "مرحبا",
          French: "Bonjour",
        },
        example: {
          Hungarian: "Szia, hogy vagy?",
          Arabic: "مرحبا، كيف حالك؟",
          French: "Bonjour, comment allez-vous?",
        },
      },
      createdAt: new Date("2025-09-08T08:00:00"),
    },
    {
      userId: "user2",
      sourceText: "Adventure",
      translationType: "Direct",
      translationFilter: "word",
      result: {
        translations: {
          Hungarian: "Kaland",
          Arabic: "مغامرة",
          French: "Aventure",
        },
        example: {
          Hungarian: "Egy izgalmas kaland vár ránk.",
          Arabic: "هذه مغامرة مثيرة.",
          French: "Quelle aventure extraordinaire!",
        },
      },
      createdAt: new Date("2025-09-08T08:05:00"),
    },
    {
      userId: "user3",
      sourceText: "Wisdom",
      translationType: "Contextual",
      translationFilter: "word",
      result: {
        translations: {
          Hungarian: "Bölcsesség",
          Arabic: "حكمة",
          French: "Sagesse",
        },
        example: {
          Hungarian: "A bölcsesség az évekkel jön.",
          Arabic: "الحكمة تأتي مع التجربة.",
          French: "La sagesse vient avec l'âge.",
        },
      },
      createdAt: new Date("2025-09-08T08:10:00"),
    },
    {
      userId: "user4",
      sourceText: "Serendipity",
      translationType: "Contextual",
      translationFilter: "word",
      result: {
        translations: {
          Hungarian: "Szerencsés véletlen",
          Arabic: "صدفة سعيدة",
          French: "Sérendipité",
        },
        example: {
          Hungarian: "Ez egy szerencsés véletlen volt.",
          Arabic: "كانت صدفة سعيدة أن التقينا.",
          French: "C'était de la sérendipité pure.",
        },
      },
      createdAt: new Date("2025-09-08T08:15:00"),
    },
    {
      userId: "user5",
      sourceText: "Courage",
      translationType: "Direct",
      translationFilter: "word",
      result: {
        translations: {
          Hungarian: "Bátorság",
          Arabic: "شجاعة",
          French: "Courage",
        },
        example: {
          Hungarian: "Mutass bátorságot!",
          Arabic: "أظهر شجاعتك!",
          French: "Montre du courage!",
        },
      },
      createdAt: new Date("2025-09-08T08:20:00"),
    },
    {
      userId: "user6",
      sourceText: "Harmony",
      translationType: "Contextual",
      translationFilter: "word",
      result: {
        translations: {
          Hungarian: "Harmónia",
          Arabic: "انسجام",
          French: "Harmonie",
        },
        example: {
          Hungarian: "Az élet harmóniája boldogságot hoz.",
          Arabic: "انسجام الحياة يجلب السعادة.",
          French: "L'harmonie de la vie apporte le bonheur.",
        },
      },
      createdAt: new Date("2025-09-08T08:25:00"),
    },
    {
      userId: "user7",
      sourceText: "Creativity",
      translationType: "Direct",
      translationFilter: "word",
      result: {
        translations: {
          Hungarian: "Kreativitás",
          Arabic: "إبداع",
          French: "Créativité",
        },
        example: {
          Hungarian: "Mutasd meg a kreativitásod!",
          Arabic: "أظهر إبداعك!",
          French: "Montre ta créativité!",
        },
      },
      createdAt: new Date("2025-09-08T08:30:00"),
    },
  ];

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
      <h2 className="text-2xl font-bold flex items-center gap-2 dark:text-white">
        <FaChartLine /> Live Community Translations
        <Badge variant="secondary">{translations.length}</Badge>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              className="relative  p-4 border rounded-xl shadow hover:shadow-lg bg-purple-950/5 dark:bg-purple-700/10 transition"
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {t.sourceText}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {t.translationType} • {t.translationFilter}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  By: <span className=" font-semibold ">{t.userId}</span>
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
    </div>
  );
}
