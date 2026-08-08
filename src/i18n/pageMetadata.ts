import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildAlternates, openGraphLocale } from "./metadata";

interface RouteMetaOptions {
  namespace: string;
  path: string;
  titleKey?: string;
  descriptionKey?: string;
  noIndex?: boolean;
}

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
