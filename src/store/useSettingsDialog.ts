import { create } from "zustand";

type SettingsDialogState = {
  isOpen: boolean;
  toggleSettingsDialog: () => void;
};

export const useSettingsDialog = create<SettingsDialogState>((set) => ({
  isOpen: false,
  toggleSettingsDialog: () => set((state) => ({ isOpen: !state.isOpen })),
}));
