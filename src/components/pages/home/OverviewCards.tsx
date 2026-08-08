"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import CountUp from "react-countup";
import { ArrowRight, Flame, Languages, Layers, TrendingDown, TrendingUp } from "lucide-react";
import Sparkline from "@/components/fixedComponents/Sparkline";
import { Link } from "@/i18n/routing";
import { useOverviewCards } from "@/hooks/useOverviewCards";
import { useUserStats } from "@/hooks/useUserStats";
import { getLanguage } from "@/lib/languages";
import { fillDays } from "@/lib/series";
import { cn } from "@/lib/utils";

function StatShell({
  label,
  icon,
  children,
  footer,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="surface-card lift p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-2.5 font-display text-3xl font-bold tabular-nums leading-none">
        {children}
      </div>
      {footer && <div className="mt-2.5">{footer}</div>}
    </div>
  );
}

function LoadingCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="surface-card p-4">
          <div className="shimmer h-3 w-24 rounded" />
          <div className="shimmer mt-3 h-8 w-16 rounded" />
          <div className="shimmer mt-3 h-3 w-20 rounded" />
        </div>
      ))}
    </div>
  );
}

export function OverviewCards() {
  const t = useTranslations("overview");
  const { data, isLoading } = useOverviewCards();
  const { data: session } = useSession();
  const { stats, isMember } = useUserStats(session?.user?.id);

  if (isLoading) return <LoadingCards />;

  const delta = data.thisWeek - data.lastWeek;
  const langMeta = data.mostUsedLang ? getLanguage(data.mostUsedLang) : undefined;
  const spark = fillDays(data.dailySeries, 14).map((point) => point.count);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <StatShell
        label={t("total")}
        icon={<Layers className="h-3.5 w-3.5" />}
        footer={<Sparkline values={spark} className="h-8 w-full" />}
      >
        <CountUp end={data.total} duration={1.1} />
      </StatShell>

      <StatShell
        label={t("thisWeek")}
        icon={<TrendingUp className="h-3.5 w-3.5" />}
        footer={
          data.lastWeek > 0 || data.thisWeek > 0 ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                delta >= 0
                  ? "bg-success/12 text-success"
                  : "bg-destructive/10 text-destructive"
              )}
            >
              {delta >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {t("vsLastWeek", { delta: `${delta >= 0 ? "+" : ""}${delta}` })}
            </span>
          ) : (
            <span className="text-[11px] text-muted-foreground">
              {t("startTrend")}
            </span>
          )
        }
      >
        <CountUp end={data.thisWeek} duration={1.1} />
      </StatShell>

      <StatShell
        label={t("topLanguage")}
        icon={<Languages className="h-3.5 w-3.5" />}
        footer={
          data.topLangs.length > 1 ? (
            <span className="text-[11px] text-muted-foreground">
              {t("languagesUsed", { count: data.topLangs.length })}
            </span>
          ) : null
        }
      >
        {langMeta ? (
          <span className="flex items-center gap-2 text-2xl">
            <span aria-hidden>{langMeta.flag}</span>
            <span className="truncate">{langMeta.name}</span>
          </span>
        ) : (
          <span className="text-2xl text-muted-foreground">—</span>
        )}
      </StatShell>

      <StatShell label={t("streak")} icon={<Flame className="h-3.5 w-3.5" />}>
        {isMember ? (
          <span className="flex items-baseline gap-1.5">
            <CountUp end={stats.streak ?? 0} duration={1.1} />
            <span className="text-sm font-medium text-muted-foreground">{t("days")}</span>
          </span>
        ) : (
          <Link
            href="/dashboard/community"
            className="inline-flex items-center gap-1.5 text-base font-semibold text-brand-600 dark:text-brand-400"
          >
            {t("joinToTrack")}
            <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
          </Link>
        )}
      </StatShell>
    </div>
  );
}
