"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check, Crown, Infinity as InfinityIcon, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatPrice,
  perMonthAmount,
  PLAN_ORDER,
  yearlySavingsPercent,
  type PlanId,
  type PlanShape,
} from "@/lib/plans";
import type { BillingStatus } from "@/types/billing";

const PLAN_ICON: Record<PlanId, typeof Sparkles> = {
  monthly: Sparkles,
  yearly: Crown,
  lifetime: InfinityIcon,
};

type Props = {
  status: BillingStatus | undefined;
  pending: PlanId | "portal" | null;
  onChoose: (plan: PlanId) => void;
  disabled?: boolean;
  only?: PlanId[];
};

function PlanCard({
  plan,
  shape,
  status,
  pending,
  onChoose,
  disabled,
  index,
  soloed,
}: Props & {
  plan: PlanId;
  shape: PlanShape;
  index: number;
  soloed?: boolean;
}) {
  const t = useTranslations("billing");
  const locale = useLocale();

  const recommended = !soloed && plan === (status?.recommended ?? "yearly");
  const isCurrent =
    status?.tier === "pro" &&
    (status.entitlement.plan === plan ||
      (plan === "lifetime" && status.entitlement.lifetime));

  const Icon = PLAN_ICON[plan];
  const busy = pending === plan;
  const monthly = status?.plans?.monthly;

  const savings =
    plan === "yearly" && monthly ? yearlySavingsPercent(monthly, shape) : 0;

  const price = formatPrice(shape.amount, shape.currency, locale);
  const cadence =
    plan === "lifetime"
      ? t("oneTime")
      : plan === "yearly"
        ? t("perYear")
        : t("perMonth");

  const footnote =
    plan === "lifetime"
      ? t("paidOnce")
      : plan === "yearly"
        ? t("equivalentPerMonth", {
            price: formatPrice(perMonthAmount(shape), shape.currency, locale),
          })
        : t("billedMonthly", { price });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "surface-card lift relative flex flex-col p-6",
        recommended &&
          "border-brand-500/45 shadow-[var(--shadow-brand)] md:-my-2 md:py-8",
      )}
    >
      {recommended && (
        <span className="absolute -top-3 start-6 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-500 to-brand-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-primary-foreground shadow-[var(--shadow-brand)]">
          <Crown className="h-3 w-3" />
          {t("mostPopular")}
        </span>
      )}

      {plan === "lifetime" && !recommended && !soloed && (
        <span className="absolute -top-3 start-6 inline-flex items-center rounded-full border border-iris-500/35 bg-iris-500/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-iris-600 dark:text-iris-300">
          {t("bestValue")}
        </span>
      )}

      <div className="flex items-center gap-2">
        <span
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-lg",
            recommended ? "bg-brand-500/15 text-brand-600 dark:text-brand-400" : "bg-surface-2 text-muted-foreground",
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="font-display text-base font-semibold">{t(`plan${plan[0].toUpperCase()}${plan.slice(1)}` as "planMonthly")}</h3>
        {savings > 0 && (
          <span className="ms-auto rounded-full border border-success/30 bg-success/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-success">
            {t("save", { percent: savings })}
          </span>
        )}
      </div>

      <div className="mt-5 flex items-baseline gap-1.5">
        <span className="font-display text-4xl font-bold tracking-tight tabular-nums">
          {price}
        </span>
        <span className="text-sm text-muted-foreground">{cadence}</span>
      </div>

      <p className="mt-1.5 text-xs text-muted-foreground">{footnote}</p>

      <ul className="mt-5 flex-1 space-y-2.5 border-t border-border pt-5">
        {[t("perkUnlimitedTitle"), t("perkEverywhereTitle"), t("perkFutureTitle")].map(
          (line) => (
            <li key={line} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
              <span>{line}</span>
            </li>
          ),
        )}
      </ul>

      <button
        onClick={() => onChoose(plan)}
        disabled={disabled || busy || isCurrent || Boolean(pending)}
        className={cn(
          "mt-6 inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-[15px] font-semibold transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55",
          recommended
            ? "bg-primary text-primary-foreground shadow-[var(--shadow-brand)] hover:brightness-105"
            : "border border-border bg-surface-2 hover:border-brand-400 hover:bg-brand-500/10",
        )}
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {isCurrent
          ? t("currentPlan")
          : busy
            ? t("redirecting")
            : t("choose", { plan: t(`plan${plan[0].toUpperCase()}${plan.slice(1)}` as "planMonthly") })}
      </button>
    </motion.div>
  );
}

export default function PricingPlans({ only, ...props }: Props) {
  const { status } = props;
  const plans = status?.plans;
  if (!plans) return null;

  const shown = only?.length ? PLAN_ORDER.filter((p) => only.includes(p)) : PLAN_ORDER;

  return (
    <div
      className={cn(
        "grid gap-4",
        shown.length === 1
          ? "max-w-md"
          : shown.length === 2
            ? "md:grid-cols-2 md:items-center"
            : "md:grid-cols-3 md:items-center",
      )}
    >
      {shown.map((plan, index) => (
        <PlanCard
          key={plan}
          plan={plan}
          shape={plans[plan]}
          index={index}
          soloed={shown.length === 1}
          {...props}
        />
      ))}
    </div>
  );
}
