"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";

export function OverviewCards() {
  const cards = [
    { title: "Total Translations", value: "12,938" },
    { title: "This Week", value: "189" },
    { title: "Most Used Lang", value: "🇺🇸 English" },
  ];
  const { data: session } = useSession();
  if (!session) {
    return null;
  }
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
