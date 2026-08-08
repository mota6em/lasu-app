import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { defaultLocale } from "./locales";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : defaultLocale;

  const [messages, fallback] = await Promise.all([
    import(`../../messages/${locale}.json`).then((m) => m.default),
    locale === defaultLocale
      ? Promise.resolve(null)
      : import(`../../messages/${defaultLocale}.json`).then((m) => m.default),
  ]);

  return {
    locale,
    messages: fallback ? deepMerge(fallback, messages) : messages,
    now: new Date(),
  };
});

type Messages = Record<string, unknown>;

function deepMerge(base: Messages, override: Messages): Messages {
  const result: Messages = { ...base };

  for (const [key, value] of Object.entries(override)) {
    const existing = result[key];
    result[key] =
      isPlainObject(existing) && isPlainObject(value)
        ? deepMerge(existing, value)
        : value;
  }

  return result;
}

function isPlainObject(value: unknown): value is Messages {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
