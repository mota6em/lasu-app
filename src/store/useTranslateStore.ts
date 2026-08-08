import Language from "@/types/language";
import { create } from "zustand";

type TranslateState = {
  selectedLanguages: Language[];
  translationType: string;
  result: { [key: string]: string };
  setLanguages: (langs: Language[]) => void;
  setTranslationType: (type: string) => void;
  setResult: (res: { [key: string]: string }) => void;
};

export const useTranslateStore = create<TranslateState>((set) => ({
  selectedLanguages: [{ value: "english", label: "English 🇺🇸" }],
  translationType: "formal",
  result: {},
  setLanguages: (langs: Language[]) => set({ selectedLanguages: langs }),
  setTranslationType: (type: string) => set({ translationType: type }),
  setResult: (res: { [key: string]: string }) => set({ result: res }),
}));
