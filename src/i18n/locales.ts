export interface LocaleMeta {
  code: string;
  name: string;
  native: string;
  flag: string;
  rtl?: boolean;
}

/**
 * Every locale listed here must have a matching messages/<code>.json.
 * Adding a language is: drop the catalogue in, add the row, done — the
 * switcher, routing, sitemap and hreflang tags all read from this list.
 */
export const localeCatalogue: LocaleMeta[] = [
  { code: "en", name: "English", native: "English", flag: "🇬🇧" },
  { code: "zh", name: "Chinese", native: "中文", flag: "🇨🇳" },
  { code: "es", name: "Spanish", native: "Español", flag: "🇪🇸" },
  { code: "ar", name: "Arabic", native: "العربية", flag: "🇸🇦", rtl: true },
  { code: "fr", name: "French", native: "Français", flag: "🇫🇷" },
  { code: "pt", name: "Portuguese", native: "Português", flag: "🇧🇷" },
  { code: "ru", name: "Russian", native: "Русский", flag: "🇷🇺" },
  { code: "de", name: "German", native: "Deutsch", flag: "🇩🇪" },
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
