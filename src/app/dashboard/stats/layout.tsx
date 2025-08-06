import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Language Stats | LaSu",
  description:
    "Explore your language learning stats. Visualize trends, track progress, and discover your most used languages with beautiful charts.",
  openGraph: {
    title: "Language Stats | LaSu",
    description:
      "Your translation activity visualized. Monitor your learning trends and top languages with real-time insights.",
    url: "https://lasu.app/dashboard/stats",
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
