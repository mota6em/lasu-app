import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stats",
  description:
    "See your daily translation activity, consistency heatmap and top languages at a glance.",
  openGraph: {
    title: "Language stats | LaSu",
    description:
      "Your translation activity visualized. Monitor your learning trends and top languages with real-time insights.",
    url: "https://lasu.online/dashboard/stats",
  },
};

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
