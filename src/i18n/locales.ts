export interface LocaleMeta {
  code: string;
  name: string;
  native: string;
  flag: string;
  rtl?: boolean;
  /** Value from lib/languages the translator explains results in. */
  explain: string;
}

export const localeCatalogue: LocaleMeta[] = [
  { code: "en", name: "English", native: "English", flag: "🇬🇧", explain: "english" },
  { code: "zh", name: "Chinese", native: "中文", flag: "🇨🇳", explain: "chinese" },
  { code: "es", name: "Spanish", native: "Español", flag: "🇪🇸", explain: "spanish" },
  { code: "ar", name: "Arabic", native: "العربية", flag: "🇸🇦", rtl: true, explain: "arabic" },
  { code: "fr", name: "French", native: "Français", flag: "🇫🇷", explain: "french" },
  { code: "pt", name: "Portuguese", native: "Português", flag: "🇧🇷", explain: "portuguese" },
  { code: "ru", name: "Russian", native: "Русский", flag: "🇷🇺", explain: "russian" },
  { code: "de", name: "German", native: "Deutsch", flag: "🇩🇪", explain: "german" },
  { code: "hi", name: "Hindi", native: "हिन्दी", flag: "🇮🇳", explain: "hindi" },
  { code: "ja", name: "Japanese", native: "日本語", flag: "🇯🇵", explain: "japanese" },
  { code: "it", name: "Italian", native: "Italiano", flag: "🇮🇹", explain: "italian" },
  { code: "tr", name: "Turkish", native: "Türkçe", flag: "🇹🇷", explain: "turkish" },
];

export const locales = localeCatalogue.map((l) => l.code);
export const defaultLocale = "en";

export type Locale = (typeof locales)[number];

const byCode = new Map(localeCatalogue.map((l) => [l.code, l]));

export function getLocaleMeta(code: string) {
  return byCode.get(code);
}

export function isRtlLocale(code: string) {
  return byCode.get(code)?.rtl ?? false;
}

export function localeDirection(code: string): "rtl" | "ltr" {
  return isRtlLocale(code) ? "rtl" : "ltr";
}

export function explainLanguage(code: string) {
  return byCode.get(code)?.explain ?? "english";
}
