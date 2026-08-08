import { defaultLocale, locales } from "./locales";

const SITE = "https://lasu.online";

// open graph wants a territory, and guessing one per language beats emitting
// a bare language tag that some crawlers ignore
const OG_TERRITORY: Record<string, string> = {
  en: "en_US",
  zh: "zh_CN",
  es: "es_ES",
  ar: "ar_AR",
  fr: "fr_FR",
  pt: "pt_BR",
  ru: "ru_RU",
  de: "de_DE",
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

// every page advertises the full set of translations plus an x-default, which
// is what search engines need to serve the right one per visitor
export function buildAlternates(locale: string, path: string) {
  return {
    canonical: localeHref(locale, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, localeHref(l, path)])),
      "x-default": localeHref(defaultLocale, path),
    },
  };
}
