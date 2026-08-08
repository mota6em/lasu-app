import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome",
  description:
    "Get started with LaSu — AI translations with real context, saved as flashcards you can actually practise.",
};

export default function WelcomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
