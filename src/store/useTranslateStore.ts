import Language from "@/types/language";
import { create } from "zustand";

export const useTranslateStore = create((set) => ({
  selectedLanguages: [{ value: "english", label: "English 🇺🇸" }],
  translationType: "formal",
  result: {},
  setLanguages: (langs: Language[]) => set({ selectedLanguages: langs }),
  setTranslationType: (type: string) => set({ translationType: type }),
  setResult: (res: { [key: string]: string }) => set({ result: res }),
}));
