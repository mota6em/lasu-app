import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import "../globals.css";
import AuthProvider from "@/components/topbar/AuthProvider";
import { ThemeProvider } from "@/components/topbar/theme-provider";
import Providers from "../providers";
import ToastHub from "@/components/fixedComponents/ToastHub";
import { Analytics } from "@vercel/analytics/next";
import { routing } from "@/i18n/routing";
import { localeDirection } from "@/i18n/locales";
import { buildAlternates, openGraphLocale } from "@/i18n/metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: {
      default: t("siteTitle"),
      template: `%s | LaSu`,
    },
    description: t("siteDescription"),
    keywords: t("keywords").split(",").map((k) => k.trim()),
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "any" },
      ],
      apple: "/apple-icon.png",
    },
    authors: [{ name: "Motasem Abubaraka", url: "https://lasu.online" }],
    creator: "Motasem Abubaraka",
    metadataBase: new URL("https://lasu.online"),
    alternates: buildAlternates(locale, "/"),
    openGraph: {
      title: t("siteTitle"),
      description: t("ogDescription"),
      url: "https://lasu.online",
      siteName: "LaSu",
      locale: openGraphLocale(locale),
      type: "website",
      images: [
        {
          url: "https://lasu.online/meta-img.png",
          width: 1200,
          height: 630,
          alt: t("siteTitle"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("siteTitle"),
      description: t("twitterDescription"),
      images: ["https://lasu.online/meta-img.png"],
      creator: "@mota6em",
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdfcfa" },
    { media: "(prefers-color-scheme: dark)", color: "#111114" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "meta" });

  return (
    <html
      lang={locale}
      dir={localeDirection(locale)}
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "LaSu",
              url: "https://lasu.online",
              inLanguage: locale,
              description: t("siteDescription"),
            }),
          }}
        />

        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Providers>
              <AuthProvider>{children}</AuthProvider>
              <ToastHub />
              <Analytics />
            </Providers>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
