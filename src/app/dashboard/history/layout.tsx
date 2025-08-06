import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Translation History | LaSu",
  description:
    "View your recent translations, track your language learning progress, and revisit examples anytime — all in one place.",
  openGraph: {
    title: "Your Translation History | LaSu",
    description:
      "Track and review your past translations with examples and language stats. Your learning journey, stored and synced.",
    url: "https://lasu.app/dashboard/history",
    siteName: "LaSu - Your AI Language Support",
    type: "website",
  },
};
export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
