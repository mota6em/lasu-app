"use client";

import CountUp from "react-countup";
import { Flame, Layers, Star, Zap } from "lucide-react";

interface UserStatsGridProps {
  totalTranslations: number | string;
  xp: number | string;
  streakDays: number | string;
  level?: number | string;
}

const ICONS = {
  translations: Layers,
  xp: Zap,
  streak: Flame,
  level: Star,
};

function Tile({
  icon: Icon,
  label,
  value,
  suffix,
}: {
  icon: (typeof ICONS)[keyof typeof ICONS];
  label: string;
  value: number | string;
  suffix?: string;
}) {
  const numeric = typeof value === "number" ? value : Number(value);

  return (
    <div className="surface-card lift flex flex-col items-center px-3 py-4 text-center">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/12">
        <Icon className="h-4.5 w-4.5 text-brand-600 dark:text-brand-400" />
      </span>
      <p className="mt-2.5 font-display text-2xl font-bold tabular-nums">
        {Number.isFinite(numeric) ? <CountUp end={numeric} duration={1.2} /> : "—"}
        {suffix && (
          <span className="ms-0.5 text-xs font-medium text-muted-foreground">
            {suffix}
          </span>
        )}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export default function UserProfileStatsGrid({
  totalTranslations,
  xp,
  streakDays,
  level,
}: UserStatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Tile icon={ICONS.translations} label="Translations" value={totalTranslations} />
      <Tile icon={ICONS.xp} label="XP earned" value={xp} />
      <Tile icon={ICONS.streak} label="Day streak" value={streakDays} suffix="d" />
      <Tile icon={ICONS.level} label="Level" value={level ?? "—"} />
    </div>
  );
}
