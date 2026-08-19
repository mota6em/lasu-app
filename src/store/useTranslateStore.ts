import Language from "@/types/language";
import { create } from "zustand";

export const TONES = [
  "formal",
  "casual",
  "slang",
  "academic",
  "funny",
] as const;
export type Tone = (typeof TONES)[number];

export const DEFAULT_TONE: Tone = "formal";

export function normalizeTone(value: unknown): Tone {
  return typeof value === "string" &&
    (TONES as readonly string[]).includes(value)
    ? (value as Tone)
    : DEFAULT_TONE;
}

type TranslateState = {
  selectedLanguages: Language[];
  translationType: Tone;
  setLanguages: (langs: Language[]) => void;
  setTranslationType: (type: string) => void;
};

export const useTranslateStore = create<TranslateState>((set) => ({
  selectedLanguages: [{ value: "english", label: "English 🇺🇸" }],
  translationType: DEFAULT_TONE,
  setLanguages: (langs: Language[]) => set({ selectedLanguages: langs }),
  setTranslationType: (type: string) =>
    set({ translationType: normalizeTone(type) }),
}));
