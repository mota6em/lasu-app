import type { Metadata } from "next";
import DashboardLayoutClient from "./DashboardLayoutClient";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}

export const metadata: Metadata = {
  title: "LaSu - Your AI Language Support",
  description:
    "Learn languages effortlessly with LaSu - the Chrome extension that offers AI-powered translations, real-life examples, and contextual understanding as you browse.",
  keywords: [
    "language learning",
    "AI translation",
    "chrome extension",
    "LaSu",
    "multilingual",
    "context-aware translation",
    "AI Language Support",
    "learn languages while browsing",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  authors: [{ name: "Motasem Abubaraka", url: "https://lasu.app" }],
  creator: "Motasem Abubaraka",
  metadataBase: new URL("https://lasu.app"),
  openGraph: {
    title: "LaSu - Your AI Language Support",
    description:
      "Translate, understand, and learn languages as you browse. The ultimate tool for polyglots and learners.",
    url: "https://lasu.app",
    siteName: "LaSu - Your AI Language Support",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://lasu.app/meta-img.png",
        width: 1200,
        height: 630,
        alt: "LaSu AI Language Support Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LaSu - Your AI Language Support",
    description:
      "AI-powered Chrome extension for smarter language learning and browsing.",
    images: ["https://lasu.app/meta-img.png"],
    creator: "@mota6em",
  },
};
