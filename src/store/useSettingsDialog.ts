import { create } from "zustand";

type SettingsDialogState = {
  isOpen: boolean;
  section: string | null;
  toggleSettingsDialog: () => void;
};

export const useSettingsDialog = create<SettingsDialogState>((set) => ({
  isOpen: false,
  section: null,
  toggleSettingsDialog: () =>
    set((state) => ({ isOpen: !state.isOpen, section: null })),
}));
