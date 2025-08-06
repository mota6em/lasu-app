"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { availableLanguages } from "@/lib/languages";
import type { Translation } from "@/types/translation";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StatsPage() {
  const { data: session } = useSession();
  const [history, setHistory] = useState<Translation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.id) {
        const res = await fetch("/api/translation/history");
        const data = await res.json();
        if (Array.isArray(data)) setHistory(data);
      } else {
        const local = localStorage.getItem("lasu-history");
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed)) setHistory(parsed);
        }
      }
    };
    fetchData();
  }, [session]);

  const langCount: Record<string, number> = {};
  const dailyCount: Record<string, number> = {};

  history.forEach((h) => {
    Object.keys(h.result.translations).forEach((lang) => {
      langCount[lang] = (langCount[lang] || 0) + 1;
    });

    const date = new Date(h.createdAt).toLocaleDateString();
    dailyCount[date] = (dailyCount[date] || 0) + 1;
  });

  const topLangs = Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const chartData = Object.entries(dailyCount).map(([date, count]) => ({
    date,
    count,
  }));

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto space-y-10">
      <h1 className="text-4xl font-extrabold text-center tracking-tight">
        📊 Your Language Stats
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topLangs.map(([lang, count]) => (
          <Card
            key={lang}
            className="bg-gradient-to-tr from-blue-100 via-white to-purple-100 dark:from-muted dark:to-muted/10"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {availableLanguages.find((l) => l.value === lang)?.label ||
                  lang}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">{count}</p>
              <p className="text-muted-foreground text-sm">translations</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-white dark:bg-muted/20 p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-bold mb-4">
          📈 Daily Translation Activity
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <Line
              type="monotone"
              dataKey="count"
              stroke="#4F46E5"
              strokeWidth={2}
            />
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
