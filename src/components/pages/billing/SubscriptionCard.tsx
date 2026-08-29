"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  AlertTriangle,
  CalendarClock,
  CreditCard,
  ExternalLink,
  Infinity as InfinityIcon,
  Loader2,
  RefreshCw,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProBadge } from "./ProBadge";
import type { Entitlement } from "@/types/billing";
import type { PlanId } from "@/lib/plans";

const STATUS_KEY: Record<string, string> = {
  active: "statusActive",
  trialing: "statusTrialing",
  past_due: "statusPastDue",
  unpaid: "statusPastDue",
  paused: "statusPaused",
  canceled: "statusEnded",
  incomplete: "statusPastDue",
  incomplete_expired: "statusEnded",
  none: "statusEnded",
};

const PLAN_KEY: Record<PlanId, string> = {
  monthly: "planMonthly",
  yearly: "planYearly",
  lifetime: "planLifetime",
};

function useLongDate() {
  const locale = useLocale();
  return (value: string | null) => {
    if (!value) return "";
    try {
      return new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(value));
    } catch {
      return new Date(value).toDateString();
    }
  };
}

type Props = {
  entitlement: Entitlement;
  pending: PlanId | "portal" | null;
  onPortal: (intent?: "cancel" | "update" | "payment_method") => void;
};

export default function SubscriptionCard({ entitlement, pending, onPortal }: Props) {
  const t = useTranslations("billing");
  const longDate = useLongDate();
  const busy = pending === "portal";

  const ending = entitlement.cancelAtPeriodEnd && !entitlement.lifetime;
  const statusKey = entitlement.lifetime
    ? "statusLifetime"
    : ending
      ? "statusEnding"
      : (STATUS_KEY[entitlement.status] ?? "statusActive");

  const tone = entitlement.paymentFailed
    ? "border-destructive/35 bg-destructive/5"
    : ending
      ? "border-iris-500/30 bg-iris-500/5"
      : "border-brand-500/30 bg-gradient-to-br from-brand-500/8 to-iris-500/8";

  const planLabel = entitlement.plan ? t(PLAN_KEY[entitlement.plan] as "planMonthly") : "";

  return (
    <section className={cn("surface-card p-5 md:p-6", tone)}>
      <div className="flex flex-wrap items-center gap-2.5">
        <ProBadge />
        <h2 className="font-display text-lg font-semibold">{t("yourPlan")}</h2>
        <span className="ms-auto inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-semibold">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              entitlement.paymentFailed
                ? "bg-destructive"
                : ending
                  ? "bg-iris-500"
                  : "bg-success",
            )}
          />
          {t(statusKey as "statusActive")}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {planLabel && (
          <span className="font-display text-2xl font-bold tracking-tight">{planLabel}</span>
        )}
        {entitlement.lifetime ? (
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <InfinityIcon className="h-3.5 w-3.5" />
            {t("lifetimeNote")}
          </span>
        ) : entitlement.currentPeriodEnd ? (
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarClock className="h-3.5 w-3.5" />
            {ending
              ? t("endsOn", { date: longDate(entitlement.currentPeriodEnd) })
              : t("renewsOn", { date: longDate(entitlement.currentPeriodEnd) })}
          </span>
        ) : null}
      </div>

      {entitlement.paymentFailed && (
        <div className="mt-4 flex gap-2.5 rounded-lg border border-destructive/30 bg-destructive/8 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <div>
            <p className="text-sm font-semibold text-destructive">
              {t("paymentFailedTitle")}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {t("paymentFailedBody", { date: longDate(entitlement.currentPeriodEnd) })}
            </p>
          </div>
        </div>
      )}

      {ending && !entitlement.paymentFailed && (
        <div className="mt-4 flex gap-2.5 rounded-lg border border-iris-500/30 bg-iris-500/8 p-3">
          <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-iris-500" />
          <div>
            <p className="text-sm font-semibold">{t("endingTitle")}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {t("endingBody", { date: longDate(entitlement.currentPeriodEnd) })}
            </p>
          </div>
        </div>
      )}

      {entitlement.manageable && (
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            onClick={() => onPortal()}
            disabled={busy}
            className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-brand)] transition-transform active:scale-[0.98] disabled:opacity-55"
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Settings2 className="h-3.5 w-3.5" />
            )}
            {t("manage")}
          </button>

          {entitlement.paymentFailed && (
            <button
              onClick={() => onPortal("payment_method")}
              disabled={busy}
              className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-3.5 text-sm font-medium transition-colors hover:border-border-strong hover:bg-surface-2 disabled:opacity-55"
            >
              <CreditCard className="h-3.5 w-3.5" />
              {t("updatePayment")}
            </button>
          )}

          <button
            onClick={() => onPortal("update")}
            disabled={busy}
            className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-3.5 text-sm font-medium transition-colors hover:border-border-strong hover:bg-surface-2 disabled:opacity-55"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {ending ? t("resumePlan") : t("changePlan")}
          </button>

          {!ending && (
            <button
              onClick={() => onPortal("cancel")}
              disabled={busy}
              className="inline-flex h-9 cursor-pointer items-center rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-destructive disabled:opacity-55"
            >
              {t("cancelPlan")}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
