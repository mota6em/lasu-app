"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { Flame, Trophy, Zap } from "lucide-react";
import UserRanks from "./UserRanks";
import { useUserStats } from "@/hooks/useUserStats";
import { levelProgress } from "@/lib/xp";

export default function CommHero({
  userName,
  userId,
}: {
  userName: string;
  userId: string;
}) {
  const t = useTranslations("community");
  const { stats, loading } = useUserStats(userId);
  const progress = levelProgress(stats.xp ?? 0);

  const tiles = [
    { label: t("xp"), value: stats.xp ?? 0, icon: Zap },
    {
      label: t("streak"),
      value: stats.streak ?? 0,
      icon: Flame,
      suffix: ` ${t("days")}`,
    },
    {
      label: t("translations"),
      value: stats.allTimeTranslations ?? 0,
      icon: Trophy,
    },
  ];

  return (
    <section className="surface-card relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-400/20 blur-3xl animate-aurora"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-iris-400/15 blur-3xl animate-aurora"
      />

      <div className="relative p-6 md:p-8">
        <p className="text-sm text-muted-foreground">{t("welcomeBack")}</p>
        <h1 className="mt-0.5 font-display text-3xl font-bold tracking-tight md:text-4xl">
          {userName.split(" ")[0]}{" "}
          <span className="text-gradient">
            {t("levelHeading", { level: progress.level })}
          </span>
        </h1>

        <div className="mt-5 max-w-md">
          <div className="flex items-baseline justify-between text-xs text-muted-foreground">
            <span>
              {t("xpProgress", { into: progress.into, needed: progress.needed })}
            </span>
            <span>
              {t("xpToNext", {
                remaining: progress.remaining,
                level: progress.level + 1,
              })}
            </span>
          </div>
          <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-surface-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: loading ? "0%" : `${progress.percent}%` }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-iris-500"
            />
          </div>
        </div>

        <div className="mt-6 grid max-w-md grid-cols-3 gap-2">
          {tiles.map(({ label, value, icon: Icon, suffix }) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-surface-2/70 px-3 py-2.5"
            >
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Icon className="h-3 w-3 text-brand-500" />
                {label}
              </span>
              <span className="mt-0.5 block font-display text-xl font-bold tabular-nums">
                {loading ? "—" : <CountUp end={value} duration={1.2} />}
                {!loading && suffix && (
                  <span className="text-xs font-medium text-muted-foreground">
                    {suffix}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <UserRanks userId={userId} />
        </div>
      </div>
    </section>
  );
}
