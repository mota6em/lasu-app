"use client";

import { useUserRanks } from "@/hooks/useUserRanks";

const PERIODS = [
  { key: "daily", label: "Today" },
  { key: "monthly", label: "This month" },
  { key: "allTime", label: "All time" },
] as const;

export default function UserRanks({ userId }: { userId: string }) {
  const { userRanks, isLoading } = useUserRanks(userId);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted-foreground">Your rank</span>
      {PERIODS.map(({ key, label }) => (
        <span
          key={key}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs"
        >
          <span className="text-muted-foreground">{label}</span>
          <span className="font-semibold tabular-nums">
            {isLoading ? "—" : userRanks[key] ? `#${userRanks[key]}` : "—"}
          </span>
        </span>
      ))}
    </div>
  );
}
