import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Leaderboards, streaks and a live feed of what other LaSu learners are translating right now.",
  openGraph: {
    title: "LaSu Community",
    description:
      "Earn XP, hold a streak and see what other learners are translating in real time.",
    url: "https://lasu.online/dashboard/community",
  },
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
