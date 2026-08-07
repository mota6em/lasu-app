"use client";

import { motion } from "framer-motion";
import { Clock, Globe2, MessageSquareText, Trophy } from "lucide-react";
import LearnersLeaderboard from "./LearnersLeaderboard";
import StatsSection from "./StatsSection";
import { useCommunityStats, type CommunityPeriod, type CommunityTab } from "@/hooks/useCommunityStats";
import { cn } from "@/lib/utils";

const TABS: { value: CommunityTab; label: string; icon: typeof Trophy }[] = [
  { value: "learners", label: "Leaderboard", icon: Trophy },
  { value: "words", label: "Top words", icon: MessageSquareText },
  { value: "languages", label: "Top languages", icon: Globe2 },
];

const PERIODS: { value: CommunityPeriod; label: string }[] = [
  { value: "daily", label: "Today" },
  { value: "monthly", label: "This month" },
  { value: "allTime", label: "All time" },
];

export default function CommTopStats() {
  const { stats, tab, setTab, period, setPeriod, shouldShowSkeleton } =
    useCommunityStats();

  return (
    <section className="surface-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-3 py-2.5">
        <div className="flex gap-0.5">
          {TABS.map(({ value, label, icon: Icon }) => {
            const active = tab === value;
            return (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={cn(
                  "relative inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="community-tab"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 rounded-lg bg-surface-2"
                  />
                )}
                <Icon className="relative h-3.5 w-3.5" />
                <span className="relative">{label}</span>
              </button>
            );
          })}
        </div>

        <div className="inline-flex items-center gap-0.5 rounded-lg border border-border bg-surface-2 p-0.5">
          {PERIODS.map((option) => (
            <button
              key={option.value}
              onClick={() => setPeriod(option.value)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                period === option.value
                  ? "bg-surface text-foreground shadow-[var(--shadow-soft)]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 md:p-5">
        {tab === "learners" ? (
          <LearnersLeaderboard
            learners={stats?.[period]?.learners ?? []}
            loading={shouldShowSkeleton}
          />
        ) : (
          <StatsSection
            items={stats?.[period]?.[tab] ?? []}
            loading={shouldShowSkeleton}
            emptyLabel={
              tab === "words"
                ? "No words ranked for this period yet."
                : "No languages ranked for this period yet."
            }
          />
        )}
      </div>

      <p className="flex items-center justify-center gap-1.5 border-t border-border bg-surface-2/50 py-2 text-[11px] text-muted-foreground">
        <Clock className="h-3 w-3" />
        Leaderboards refresh every hour
      </p>
    </section>
  );
}
