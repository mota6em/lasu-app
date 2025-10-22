"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "../../ui/skeleton";
import { useOverviewCards } from "@/hooks/useOverviewCards";

export function OverviewCards() {
  const { cards, showSkeleton } = useOverviewCards();

  return (
    <div className="flex flex-col gap-y-5">
      <h2 className="text-2xl font-semibold mt-2 -mb-2">📃Overview</h2>
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
