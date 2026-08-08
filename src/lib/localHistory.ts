import type Translation from "@/types/translation";

export const LOCAL_HISTORY_KEY = "lasu-history";

export const LOCAL_HISTORY_EVENT = "lasu:local-history";

export function readLocalHistory(): Translation[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCAL_HISTORY_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeLocalHistory(history: Translation[]) {
  localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(history));
  window.dispatchEvent(new Event(LOCAL_HISTORY_EVENT));
}
