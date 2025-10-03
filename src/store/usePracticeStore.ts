import { create } from "zustand";

interface PracticeStore {
  currentIndex: number;
  totalWords: number;
  setCurrentIndex: (i: number) => void;
  setTotalWords: (n: number) => void;
}

export const usePracticeStore = create<PracticeStore>((set) => ({
  currentIndex: 0,
  totalWords: 0,
  setCurrentIndex: (i) => set({ currentIndex: i }),
  setTotalWords: (n) => set({ totalWords: n }),
}));
