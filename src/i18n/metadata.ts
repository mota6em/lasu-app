import { defaultLocale, locales } from "./locales";

const SITE = "https://lasu.online";

const OG_TERRITORY: Record<string, string> = {
  en: "en_US",
  zh: "zh_CN",
  es: "es_ES",
  ar: "ar_AR",
  fr: "fr_FR",
  pt: "pt_BR",
  ru: "ru_RU",
  de: "de_DE",
  hi: "hi_IN",
  ja: "ja_JP",
  it: "it_IT",
  tr: "tr_TR",
};

export function openGraphLocale(locale: string) {
  return OG_TERRITORY[locale] ?? "en_US";
}

function localeHref(locale: string, path: string) {
  const clean = path === "/" ? "" : path;
  return locale === defaultLocale
    ? `${SITE}${clean || "/"}`
    : `${SITE}/${locale}${clean}`;
}

export function buildAlternates(locale: string, path: string) {
  return {
    canonical: localeHref(locale, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, localeHref(l, path)])),
      "x-default": localeHref(defaultLocale, path),
    },
  };
}
