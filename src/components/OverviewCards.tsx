"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Translation from "@/types/translation";
import { availableLanguages } from "@/lib/languages";
import { Skeleton } from "./ui/skeleton";

interface Card {
  title: string;
  value: string;
}

export function OverviewCards() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const [cards, setCards] = useState<
    { title: string; value: string | number }[]
  >([]);
  const [loadingLocal, setLoadingLocal] = useState(false);
  useEffect(() => {
    const load = async () => {
      if (session?.user?.id) {
        const res = await fetch("/api/translation/history?wantStats=1");
        const stats = await res.json();
        setCards([
          { title: "Total Translations", value: stats.totalTranslations },
          { title: "This Week", value: stats.thisWeekCount },
          {
            title: "Most Used Lang",
            value: stats.mostUsedLang
              ? availableLanguages.find(
                  (l) =>
                    l.value ===
                    (stats.mostUsedLang.lang ?? stats.mostUsedLang._id)
                )?.label ?? "-"
              : "-",
          },
        ]);
      } else {
        setLoadingLocal(true);
        try {
          const raw = localStorage.getItem("lasu-history");
          const parsed: Translation[] = raw ? JSON.parse(raw) : [];
          if (!Array.isArray(parsed) || parsed.length === 0) {
            setCards([
              { title: "Total Translations", value: 0 },
              { title: "This Week", value: 0 },
              { title: "Most Used Lang", value: "-" },
            ]);
          } else {
            const total = parsed.length;
            const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
            const thisWeek = parsed.filter(
              (t) => new Date(t.createdAt).getTime() > weekAgo
            ).length;
            const langCount: Record<string, number> = {};
            for (const t of parsed) {
              for (const [lang] of Object.entries(
                t.result?.translations ?? {}
              )) {
                langCount[lang] = (langCount[lang] || 0) + 1;
              }
            }
            const sortedLangs = Object.entries(langCount).sort(
              (a, b) => b[1] - a[1]
            );
            const mostLangValue = sortedLangs[0]?.[0];
            const mostLang = mostLangValue
              ? availableLanguages.find((l) => l.value === mostLangValue)
                  ?.label ?? mostLangValue
              : "-";
            setCards([
              { title: "Total Translations", value: total },
              { title: "This Week", value: thisWeek },
              { title: "Most Used Lang", value: mostLang },
            ]);
          }
        } finally {
          setLoadingLocal(false);
        }
      }
    };
    if (status !== "loading") load();
  }, [session, status]);

  const isServerLoading = status === "loading";
  const isLocalLoading = status === "unauthenticated" && loadingLocal;
  const isCardsReady = cards.length > 0;

  const showSkeleton = isServerLoading || isLocalLoading || !isCardsReady;

  return (
    <div className="flex flex-col gap-y-5">
      <h2 className="text-2xl font-semibold mt-2 -mb-2 -ml-2.5">📃Overview</h2>
      {showSkeleton ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <Card key={i} className="bg-muted dark:bg-zinc-800/50">
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-5 w-40" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cards.map((card, idx) => (
            <Card key={idx} className="bg-muted dark:bg-zinc-800/50">
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {String(card.value || "-")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
