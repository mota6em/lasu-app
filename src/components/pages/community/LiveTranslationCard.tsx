import { FaVolumeUp, FaSpinner } from "react-icons/fa";
import { Button } from "@/components/ui/button";
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

interface TranslationCardProps {
  t: CommunityTranslation;
  idx: number;
  langs: string[];
  selectedLang: string;
  translation: string;
  example?: string;
  selectLanguage: (cardId: string, lang: string) => void;
  audioLoading: Record<string, boolean>;
  speakText: (text: string, lang: string, cardId: string) => void;
  newCards: Set<string>;
}

export default function LiveTranslationCard({
  t,
  idx,
  langs,
  selectedLang,
  translation,
  example,
  selectLanguage,
  audioLoading,
  speakText,
  newCards,
}: TranslationCardProps) {
  return (
    <div
      key={idx}
      className={`relative p-4 border rounded-xl shadow hover:shadow-lg transition ${
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
          <span className="font-semibold">{t.userName! || "Anonymous"}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {langs.map((lang: string) => (
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
            onClick={() => speakText(translation, selectedLang, idx.toString())}
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
}
