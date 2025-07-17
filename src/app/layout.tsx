import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LaSu - Your AI Language Support",
  description:
    "LaSu helps you learn languages effortlessly by translating selected text with real-life examples and AI-powered context understanding. Built for learners, loved by polyglots.",
  keywords: [
    "language learning",
    "AI translation",
    "chrome extension",
    "LaSu",
    "multilingual",
    "context-aware translation",
    "AI Language Support",
  ],
  authors: [{ name: "Motasem Abubaraka" }],
  creator: "Motasem Abubaraka",
  openGraph: {
    title: "LaSu - Your AI Language Support",
    description:
      "Translate, understand, and learn languages as you browse. The ultimate tool for polyglots and learners.",
    url: "https://lasu.app",
    siteName: "LaSu",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
