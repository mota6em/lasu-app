"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Zap, BookOpen, ListChecks } from "lucide-react";
import Link from "next/link";

export default function page() {
  const modes = [
    {
      title: "Flashcards",
      desc: "Flip and learn with memory cards.",
      icon: <BookOpen className="w-6 h-6 text-blue-500" />,
      href: "/dashboard/practice/flashcards",
    },
    {
      title: "Multiple Choice",
      desc: "Pick the right translation.",
      icon: <ListChecks className="w-6 h-6 text-green-500" />,
      href: "/dashboard/practice/mcq",
    },
    {
      title: "Fill in the Blank",
      desc: "Complete the missing word.",
      icon: <Flame className="w-6 h-6 text-orange-500" />,
      href: "/dashboard/practice/fill",
    },
    {
      title: "Lightning Round",
      desc: "30s speed test, go fast! ⚡",
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      href: "/dashboard/practice/lightning",
    },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">🔥 Practice Hub</h1>
        <p className="text-gray-500">
          Sharpen your skills and keep your streak alive!
        </p>
        <div className="mt-4 inline-block px-4 py-2 bg-red-100 dark:bg-red-950 rounded-full">
          Streak:{" "}
          <span className="font-bold text-red-600 dark:text-red-300">
            0 days
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modes.map((m, i) => (
          <Link key={i} href={m.href}>
            <Card className="rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer">
              <CardHeader className="flex flex-row items-center gap-3">
                {m.icon}
                <CardTitle className="text-lg">{m.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-500">{m.desc}</CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10 text-center">
        <h2 className="text-xl font-semibold">🏆 Weekly Leaderboard</h2>
        <p className="text-gray-500">See who’s on top this week</p>
        <Button className="mt-3">View Leaderboard</Button>
      </div>
    </div>
  );
}
