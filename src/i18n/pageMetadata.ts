import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  buildAlternates,
  localeHref,
  openGraphLocale,
  OG_IMAGE,
} from "./metadata";

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

    const title = `${t(titleKey)} | LaSu`;
    const description = t(descriptionKey);
    const url = localeHref(locale, path);

    return {
      title: { absolute: title },
      description,
      alternates: buildAlternates(locale, path),
      robots: noIndex
        ? { index: false, follow: false }
        : {
            index: true,
            follow: true,
            googleBot: {
              index: true,
              follow: true,
              "max-image-preview": "large",
              "max-snippet": -1,
            },
          },
      openGraph: {
        title,
        description,
        url,
        siteName: "LaSu",
        locale: openGraphLocale(locale),
        type: "website",
        images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: title }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [OG_IMAGE],
        creator: "@mota6em",
      },
    };
  };
}
