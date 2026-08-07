"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Translation from "@/types/translation";
import { availableLanguages } from "@/lib/languages";
import { useTranslationStats } from "./useTranslationStats";

export interface OverviewCard {
  title: string;
  value: string | number;
}

export function useOverviewCards() {
  const { data: session, status } = useSession();
  const { data: stats, isLoading: statsLoading } = useTranslationStats(
    session?.user?.id
  );
  const [localCards, setLocalCards] = useState<OverviewCard[] | null>(null);
  const [loadingLocal, setLoadingLocal] = useState(false);

  useEffect(() => {
    if (session?.user?.id) return;
    if (status === "loading") return;

    // Local user → read stats from localStorage
    setLoadingLocal(true);
    try {
      const raw = localStorage.getItem("lasu-history");
      const parsed: Translation[] = raw ? JSON.parse(raw) : [];

      if (!Array.isArray(parsed) || parsed.length === 0) {
        setLocalCards([
          { title: "Total Translations", value: 0 },
          { title: "This Week", value: 0 },
          { title: "Most Used Lang", value: "-" },
        ]);
        return;
      }

      const total = parsed.length;
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const thisWeek = parsed.filter(
        (t) => new Date(t.createdAt).getTime() > weekAgo
      ).length;

      const langCount: Record<string, number> = {};
      for (const t of parsed) {
        for (const [lang] of Object.entries(t.result?.translations ?? {})) {
          langCount[lang] = (langCount[lang] || 0) + 1;
        }
      }

      const sortedLangs = Object.entries(langCount).sort((a, b) => b[1] - a[1]);
      const mostLangValue = sortedLangs[0]?.[0];
      const mostLang =
        availableLanguages.find((l) => l.value === mostLangValue)?.label ??
        mostLangValue ??
        "-";

      setLocalCards([
        { title: "Total Translations", value: total },
        { title: "This Week", value: thisWeek },
        { title: "Most Used Lang", value: mostLang },
      ]);
    } finally {
      setLoadingLocal(false);
    }
  }, [session, status]);

  const cards: OverviewCard[] = session?.user?.id
    ? stats
      ? [
          { title: "Total Translations", value: stats.totalTranslations },
          { title: "This Week", value: stats.thisWeekCount },
          {
            title: "Most Used Lang",
            value:
              availableLanguages.find(
                (l) =>
                  l.value === (stats.mostUsedLang?.lang ?? stats.mostUsedLang?._id)
              )?.label ?? "-",
          },
        ]
      : []
    : (localCards ?? []);

  const isServerLoading = status === "loading" || (!!session?.user?.id && statsLoading);
  const isLocalLoading = status === "unauthenticated" && loadingLocal;
  const isCardsReady = cards.length > 0;
  const showSkeleton = isServerLoading || isLocalLoading || !isCardsReady;

  return { cards, showSkeleton };
}
