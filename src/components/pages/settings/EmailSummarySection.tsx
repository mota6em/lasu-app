"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Crown, Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Link, useRouter } from "@/i18n/routing";
import { useEmailDigest } from "@/store/useEmailDigest";
import { FREE_EVERY_DAYS, FREE_HOUR, nextRun } from "@/lib/summarySchedule";
import { cn } from "@/lib/utils";

const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const HOURS = Array.from({ length: 24 }, (_, hour) => hour);

function useDayLabels() {
  const locale = useLocale();
  return useMemo(() => {
    const format = new Intl.DateTimeFormat(locale, { weekday: "short" });
    return DAY_ORDER.map((day) => ({
      day,
      label: format.format(new Date(Date.UTC(2024, 0, 7 + day))),
    }));
  }, [locale]);
}

export function useEmailSummaryLabel() {
  const t = useTranslations("settings");
  const dayLabels = useDayLabels();
  const { enabled, hour, days } = useEmailDigest();

  if (!enabled) return t("emailOff");

  const clock = `${String(hour).padStart(2, "0")}:00`;
  if (!days.length) return t("emailEvery", { days: FREE_EVERY_DAYS, hour: clock });

  return `${dayLabels
    .filter((entry) => days.includes(entry.day))
    .map((entry) => entry.label)
    .join(", ")} · ${clock}`;
}

export default function EmailSummarySection({ onUpgrade }: { onUpgrade: () => void }) {
  const t = useTranslations("settings");
  const locale = useLocale();
  const router = useRouter();
  const dayLabels = useDayLabels();
  const { enabled, hour, days, includeSentences, timeZone, isPro, patch } = useEmailDigest();

  const next = useMemo(() => {
    if (!enabled) return null;
    const at = nextRun({ hour, days, includeSentences, timeZone }, null, new Date());
    return at
      ? new Intl.DateTimeFormat(locale, {
          timeZone,
          weekday: "long",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(at)
      : null;
  }, [enabled, hour, days, includeSentences, timeZone, locale]);

  const toggleDay = (day: number) =>
    patch({
      days: days.includes(day) ? days.filter((value) => value !== day) : [...days, day].sort(),
    });

  const goPro = () => {
    onUpgrade();
    router.push("/dashboard/upgrade");
  };

  const locked = (children: React.ReactNode) => (
    <div
      onClick={isPro ? undefined : goPro}
      className={cn(!isPro && "cursor-pointer opacity-55 transition-opacity hover:opacity-80")}
    >
      {children}
    </div>
  );

  return (
    <div>
      {!isPro && (
        <Link
          href="/dashboard/upgrade"
          onClick={onUpgrade}
          className="mb-2.5 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline dark:text-brand-400"
        >
          <Crown className="h-3 w-3" />
          {t("emailUpgrade")}
        </Link>
      )}

      <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border bg-surface-2 px-3 py-2.5">
        <span>
          <span className="block text-sm font-medium">{t("emailEnable")}</span>
          <span className="block text-[11px] leading-snug text-muted-foreground">
            {enabled && next
              ? t("emailNext", { when: next })
              : t("emailHint")}
          </span>
        </span>
        <Switch
          checked={enabled}
          onCheckedChange={(value) => patch({ enabled: value })}
          className="data-[state=checked]:bg-primary"
        />
      </label>

      {enabled && (
        <div className="mt-3 space-y-3">
          {(!isPro || !days.length) && (
            <p className="rounded-lg bg-surface-2 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
              {!isPro && <Lock className="me-1 inline h-3 w-3 align-[-1px]" />}
              {isPro
                ? t("emailNoDays", { days: FREE_EVERY_DAYS })
                : t("emailFixed", { days: FREE_EVERY_DAYS, hour: `${FREE_HOUR}:00` })}
            </p>
          )}

          {locked(
            <>
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                {t("emailDays")}
              </span>
              <div className="grid grid-cols-7 gap-1">
                {dayLabels.map(({ day, label }) => {
                  const active = isPro && days.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={!isPro}
                      onClick={() => toggleDay(day)}
                      className={cn(
                        "rounded-lg border py-1.5 text-[11px] font-medium capitalize transition-colors",
                        active
                          ? "border-brand-500 bg-brand-500/10 text-foreground"
                          : "border-border bg-surface text-muted-foreground hover:border-border-strong",
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </>,
          )}

          {locked(
            <>
              <span className="mb-1.5 mt-3 block text-xs font-medium text-muted-foreground">
                {t("emailTime", { zone: timeZone })}
              </span>
              <select
                disabled={!isPro}
                value={isPro ? hour : FREE_HOUR}
                onChange={(event) => patch({ hour: Number(event.target.value) })}
                className="h-10 w-full rounded-lg border border-border bg-surface-2 px-3 text-sm outline-none transition-colors focus:border-brand-400 disabled:cursor-not-allowed"
              >
                {HOURS.map((value) => (
                  <option key={value} value={value}>
                    {String(value).padStart(2, "0")}:00
                  </option>
                ))}
              </select>
            </>,
          )}

          {locked(
            <>
              <span className="mb-1.5 mt-3 block text-xs font-medium text-muted-foreground">
                {t("emailContent")}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[false, true].map((value) => {
                  const active = (isPro ? includeSentences : false) === value;
                  return (
                    <button
                      key={String(value)}
                      type="button"
                      disabled={!isPro}
                      onClick={() => patch({ includeSentences: value })}
                      className={cn(
                        "rounded-xl border p-2.5 text-left transition-all",
                        active
                          ? "border-brand-500 bg-brand-500/10 shadow-[var(--shadow-brand)]"
                          : "border-border bg-surface hover:border-border-strong",
                      )}
                    >
                      <span className="block text-sm font-medium">
                        {value ? t("emailWordsSentences") : t("emailWordsOnly")}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                        {value ? t("emailWordsSentencesHint") : t("emailWordsOnlyHint")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>,
          )}
        </div>
      )}
    </div>
  );
}
