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
  const [history, setHistory] = useState<Translation[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  useEffect(() => {
    const loadHistory = async () => {
      if (session?.user?.id) {
        const res = await fetch("/api/translation/history?wantStats=1");
        const stats = await res.json();
        setCards([
          { title: "Total Translations", value: stats.totalTranslations },
          { title: "This Week", value: stats.thisWeekCount },
          {
            title: "Most Used Lang",
            value: stats.mostUsedLang._id
              ? `${
                  availableLanguages.find(
                    (l) => l.value === stats.mostUsedLang._id
                  )?.label
                } `
              : "-",
          },
        ]);
      } else {
        const local = localStorage.getItem("lasu-history");
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed)) setHistory(parsed);
        }
      }
    };
    if (status === "authenticated" || status === "unauthenticated")
      loadHistory();
  }, [session, status]);

  return (
    <div className="flex flex-col gap-y-5">
      <h2 className="text-2xl font-semibold mt-2 -mb-2 -ml-2.5">📃Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card, idx) => (
          <Card key={idx} className="bg-muted dark:bg-zinc-800/50">
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-[150px]" />
              ) : (
                <p className="text-2xl font-bold">{card.value || "-"}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
