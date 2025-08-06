"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Translation from "@/types/translation";
import { availableLanguages } from "@/lib/languages";

export function OverviewCards() {
  const [history, setHistory] = useState<Translation[]>([]);

  const { data: session } = useSession();
  useEffect(() => {
    if (!session) return;

    fetch("/api/translation/history")
      .then((res) => res.json())
      .then((data) => setHistory(data));
  }, [session]);

  if (!session) return null;
  const totalTranslations = history.length;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const thisWeekCount = history.filter(
    (h) => new Date(h.createdAt) > oneWeekAgo
  ).length;

  const langCount: Record<string, number> = {};
  history.forEach((h) => {
    Object.keys(h.result.translations).forEach((lang) => {
      langCount[lang] = (langCount[lang] || 0) + 1;
    });
  });

  const mostUsedLang = Object.entries(langCount).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0];

  const cards = [
    { title: "Total Translations", value: totalTranslations },
    { title: "This Week", value: thisWeekCount },
    {
      title: "Most Used Lang",
      value: mostUsedLang
        ? `${availableLanguages.find((l) => l.value === mostUsedLang)?.label}  `
        : "-",
    },
  ];

  return (
    <div className="flex flex-col gap-y-5">
      <h2 className="text-2xl font-semibold mt-2 -mb-2">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
