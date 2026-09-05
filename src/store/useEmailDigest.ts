import { create } from "zustand";
import { FREE_HOUR, type DigestPrefs } from "@/lib/summarySchedule";

type EmailDigestState = DigestPrefs & {
  isPro: boolean;
  hydrate: (prefs: Partial<EmailDigestState>) => void;
  patch: (prefs: Partial<DigestPrefs>) => void;
};

export const useEmailDigest = create<EmailDigestState>((set) => ({
  enabled: true,
  hour: FREE_HOUR,
  days: [],
  includeSentences: false,
  timeZone: "UTC",
  isPro: false,
  hydrate: (prefs) => set(prefs),
  patch: (prefs) => set(prefs),
}));
