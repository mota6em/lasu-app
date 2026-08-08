import { create } from "zustand";

type LanguageDialogState = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  open: () => void;
};

export const useLanguageDialog = create<LanguageDialogState>((set) => ({
  isOpen: false,
  setOpen: (isOpen) => set({ isOpen }),
  open: () => set({ isOpen: true }),
}));
