export interface TranslationResult {
  translations: Record<string, string>;
  example?: Record<string, string>;
  exampleMeaning?: Record<string, string>;
  romanization?: Record<string, string>;
  sourceLanguage?: string;
  kind?: "word" | "phrase";
  meaning?: string;
  partOfSpeech?: string;
  difficulty?: string;
  note?: string;
  synonyms?: string[];
}

interface Translation {
  _id: string;
  sourceText: string;
  translationType: string;
  translationFilter?: "word" | "phrase";
  createdAt: string;
  result: TranslationResult;
}

export default Translation;

export interface TranslateHook {
  text: string;
  setText: (val: string) => void;
  image: string | null;
  setImage: (input: File | Blob | string | null) => Promise<void>;
  clearImage: () => void;
  resultLoading: boolean;
  error: string | null;
  result: TranslationResult | null;
  submittedText: string;
  handleTranslate: () => void;
  handlePasteInline: () => void;
  reset: () => void;
  toggleSettingsDialog: () => void;
}
