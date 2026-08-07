import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "History",
  description:
    "Search every word and phrase you have translated, with examples, pronunciation and notes kept alongside them.",
  openGraph: {
    title: "Your translation history | LaSu",
    description:
      "Track and review your past translations with examples and language stats. Your learning journey, stored and synced.",
    url: "https://lasu.online/dashboard/history",
  },
};

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
