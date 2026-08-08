import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practice Hub",
  description:
    "Turn every word you have translated into a flashcard. Recall and writing drills with instant feedback.",
  openGraph: {
    title: "Practice Hub | LaSu",
    description:
      "Recall and writing drills built from your own translation history.",
    url: "https://lasu.online/dashboard/practice",
  },
};

export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
