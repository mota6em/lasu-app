"use client";

import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Brain } from "lucide-react";
import PracticeBoard from "@/components/pages/practice/PracticeBoard";

export default function PracticePage() {
  const t = useTranslations("practice");
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") signIn("google");
  }, [status]);

  return (
    <div className="space-y-8">
      <header className="text-center animate-fade-up">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/25 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-700 dark:text-brand-300">
          <Brain className="h-3.5 w-3.5" />
          {t("badge")}
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
          {t.rich("heading", {
            accent: (chunks) => <span className="text-gradient">{chunks}</span>,
          })}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {t("subheading")}
        </p>
      </header>

      {status === "loading" ? (
        <div className="mx-auto h-64 w-full max-w-xl shimmer rounded-2xl" />
      ) : (
        <PracticeBoard />
      )}
    </div>
  );
}
