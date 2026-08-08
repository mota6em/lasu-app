import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildAlternates, openGraphLocale } from "./metadata";

interface RouteMetaOptions {
  /** message namespace holding `title` and `description` for this route */
  namespace: string;
  /** path without the locale prefix, e.g. /dashboard/history */
  path: string;
  titleKey?: string;
  descriptionKey?: string;
  noIndex?: boolean;
}

/**
 * Without this every page would inherit the root layout's alternates and
 * point search engines at the home page instead of itself.
 */
export function routeMetadata({
  namespace,
  path,
  titleKey = "title",
  descriptionKey = "subtitle",
  noIndex,
}: RouteMetaOptions) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace });

    const title = t(titleKey);
    const description = t(descriptionKey);

    return {
      // absolute, because the root template does not reach nested layouts and
      // relying on it produced bare titles like "Historial"
      title: { absolute: `${title} | LaSu` },
      description,
      alternates: buildAlternates(locale, path),
      ...(noIndex && { robots: { index: false, follow: false } }),
      openGraph: {
        title: `${title} | LaSu`,
        description,
        url: `https://lasu.online${locale === "en" ? "" : `/${locale}`}${path}`,
        locale: openGraphLocale(locale),
        type: "website",
      },
    };
  };
}
