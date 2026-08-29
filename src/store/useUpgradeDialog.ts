import { create } from "zustand";

type Reason = "quota" | "feature" | "manual";

interface UpgradeDialogState {
  isOpen: boolean;
  reason: Reason;
  open: (reason?: Reason) => void;
  close: () => void;
}

export const useUpgradeDialog = create<UpgradeDialogState>((set) => ({
  isOpen: false,
  reason: "manual",
  open: (reason = "manual") => set({ isOpen: true, reason }),
  close: () => set({ isOpen: false }),
}));
