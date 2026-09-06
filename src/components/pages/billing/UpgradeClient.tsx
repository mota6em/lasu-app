"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  Infinity as InfinityIcon,
  Loader2,
  MailCheck,
  Puzzle,
  Rocket,
  Shield,
  Sparkles,
  X,
} from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import PricingPlans from "./PricingPlans";
import SubscriptionCard from "./SubscriptionCard";
import { useCountdown } from "./Countdown";
import { ERROR_KEY } from "./errors";
import { BILLING_KEY, useBilling, useBillingActions } from "@/hooks/useBilling";
import { useQueryClient } from "@tanstack/react-query";
import type { PlanId } from "@/lib/plans";

const PERKS = [
  { key: "perkUnlimited", icon: InfinityIcon, accent: "brand" },
  { key: "perkSchedule", icon: MailCheck, accent: "iris" },
  { key: "perkEverywhere", icon: Puzzle, accent: "brand" },
  { key: "perkKeep", icon: Shield, accent: "iris" },
  { key: "perkFuture", icon: Rocket, accent: "brand" },
] as const;

const FAQ = ["faqCancel", "faqExtension", "faqSwitch", "faqPayment"] as const;

function Perks() {
  const t = useTranslations("billing");

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {PERKS.map((perk, index) => {
        const Icon = perk.icon;
        return (
          <motion.div
            key={perk.key}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.05 * index, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="surface-card p-4"
          >
            <span
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-lg",
                perk.accent === "brand"
                  ? "bg-brand-500/12 text-brand-600 dark:text-brand-400"
                  : "bg-iris-500/12 text-iris-600 dark:text-iris-300",
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <p className="mt-3 text-sm font-semibold">{t(`${perk.key}Title` as "perkUnlimitedTitle")}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {t(`${perk.key}Body` as "perkUnlimitedBody")}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

function Comparison({ freeLimit }: { freeLimit: number }) {
  const t = useTranslations("billing");

  const rows = [
    { label: t("featureDaily"), free: t("featureDailyFree", { limit: freeLimit }), pro: t("featureDailyPro") },
    {
      label: t("featureSummaries"),
      free: t("featureSummariesFree"),
      pro: t("featureSummariesPro"),
    },
    { label: t("featureExtension"), free: true, pro: true },
    { label: t("featureHistory"), free: true, pro: true },
    { label: t("featureFuture"), free: false, pro: true },
  ];

  const mark = (value: boolean) =>
    value ? (
      <Check className="mx-auto h-4 w-4 text-success" aria-label={t("included")} />
    ) : (
      <X className="mx-auto h-4 w-4 text-muted-foreground/60" aria-label={t("notIncluded")} />
    );

  return (
    <div className="surface-card overflow-hidden">
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-border bg-surface-2/60 px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        <span>{t("compareTitle")}</span>
        <span className="w-24 text-center">{t("compareFree")}</span>
        <span className="w-24 text-center text-brand-700 dark:text-brand-300">
          {t("comparePro")}
        </span>
      </div>
      <ul className="divide-y divide-border">
        {rows.map((row) => (
          <li
            key={row.label}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-3.5 text-sm"
          >
            <span>{row.label}</span>
            <span className="w-24 text-center text-xs tabular-nums text-muted-foreground">
              {typeof row.free === "boolean" ? mark(row.free) : row.free}
            </span>
            <span className="w-24 text-center text-xs font-semibold tabular-nums">
              {typeof row.pro === "boolean" ? mark(row.pro) : row.pro}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Faq() {
  const t = useTranslations("billing");
  const [open, setOpen] = useState<string | null>(FAQ[0]);

  return (
    <div className="surface-card divide-y divide-border overflow-hidden">
      {FAQ.map((item) => {
        const expanded = open === item;
        return (
          <div key={item}>
            <button
              onClick={() => setOpen(expanded ? null : item)}
              aria-expanded={expanded}
              className="flex w-full cursor-pointer items-center gap-3 px-5 py-4 text-start text-sm font-medium transition-colors hover:bg-surface-2/60"
            >
              <span className="flex-1">{t(`${item}Q` as "faqCancelQ")}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300",
                  expanded && "rotate-180",
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                    {t(`${item}A` as "faqCancelA")}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function QuotaStrip() {
  const t = useTranslations("billing");
  const { quota, isPro } = useBilling();
  const { label, elapsed } = useCountdown(quota?.resetAt);

  if (!quota || isPro) return null;

  const percent = quota.limit ? Math.min(100, (quota.used / quota.limit) * 100) : 0;

  return (
    <div className="surface-card p-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-medium">
          {t("usedToday", { used: quota.used, limit: quota.limit })}
        </span>
        {quota.resetAt && (
          <span className="ms-auto text-xs tabular-nums text-muted-foreground">
            {elapsed ? t("resetsNow") : t("resetsIn", { time: label })}
          </span>
        )}
      </div>
      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
        <motion.div
          className={cn(
            "h-full rounded-full",
            percent >= 100
              ? "bg-destructive"
              : "bg-gradient-to-r from-brand-500 to-iris-500",
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

export default function UpgradeClient() {
  const t = useTranslations("billing");
  const params = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { status: authStatus, update: refreshSession } = useSession();
  const { status, isPro, entitlement } = useBilling();
  const { checkout, openPortal, sync, pending, error, setError } = useBillingActions();
  const [confirming, setConfirming] = useState(false);
  const handled = useRef(false);

  const outcome = params?.get("checkout") ?? null;
  const sessionId = params?.get("session_id") ?? null;
  const portalClosed = params?.get("portal") ?? null;
  const fromExtension = params?.get("src") === "extension";

  const clean = useCallback(() => {
    router.replace("/dashboard/upgrade", { scroll: false });
  }, [router]);

  useEffect(() => {
    if (handled.current) return;

    if (outcome === "success") {
      handled.current = true;
      setConfirming(true);
      sync(sessionId)
        .then(async (fresh) => {
          if (fresh?.tier !== "pro") return;
          // The quota the API enforces comes off the session token, which
          // caches the tier. Refresh it now or the first translation after
          // paying is still refused.
          await refreshSession({ tier: true }).catch(() => null);
          toast.success(`${t("welcomeTitle")} — ${t("welcomeBody")}`, { duration: 6000 });
        })
        .finally(() => {
          setConfirming(false);
          clean();
        });
      return;
    }

    if (outcome === "cancelled") {
      handled.current = true;
      toast(t("checkoutCancelled"));
      clean();
      return;
    }

    if (portalClosed) {
      handled.current = true;
      sync()
        .then(() => refreshSession({ tier: true }).catch(() => null))
        .finally(clean);
    }
  }, [outcome, sessionId, portalClosed, sync, clean, refreshSession, t]);

  useEffect(() => {
    if (!error) return;
    toast.error(t(ERROR_KEY[error] ?? "errGeneric"));
    setError(null);
  }, [error, setError, t]);

  const onChoose = (plan: PlanId) => {
    if (authStatus === "unauthenticated") {
      signIn("google");
      return;
    }
    checkout(plan, { source: fromExtension ? "extension" : "web" });
  };

  const onPortal = async (intent?: "cancel" | "update" | "payment_method") => {
    await openPortal(intent);
    queryClient.invalidateQueries({ queryKey: BILLING_KEY });
  };

  const freeLimit = status?.quota.audience === "guest" ? 20 : (status?.quota.limit ?? 20);

  return (
    <div className="space-y-8 pb-6">
      <header className="animate-fade-up text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-700 dark:text-brand-300">
          <Sparkles className="h-3 w-3" />
          {t("eyebrow")}
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-5xl">
          {t("heading")
            .split(t("headingAccent"))
            .flatMap((part, index, all) => [
              <span key={`p${index}`}>{part}</span>,
              index < all.length - 1 ? (
                <span key={`a${index}`} className="text-gradient">
                  {t("headingAccent")}
                </span>
              ) : null,
            ])}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {t("subtitle")}
        </p>
      </header>

      {confirming && (
        <div className="surface-card flex items-center justify-center gap-2.5 border-brand-500/30 bg-brand-500/8 p-4 text-sm font-medium">
          <Loader2 className="h-4 w-4 animate-spin text-brand-500" />
          {t("confirming")}
        </div>
      )}

      {fromExtension && !isPro && (
        <div className="surface-card flex gap-3 border-iris-500/30 bg-iris-500/6 p-4">
          <Puzzle className="mt-0.5 h-4 w-4 shrink-0 text-iris-500" />
          <div>
            <p className="text-sm font-semibold">{t("perkEverywhereTitle")}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {t("perkEverywhereBody")}
            </p>
          </div>
        </div>
      )}

      {isPro && entitlement && (
        <SubscriptionCard entitlement={entitlement} pending={pending} onPortal={onPortal} />
      )}

      {/* A recurring subscriber can still buy lifetime; their renewal is
          cancelled automatically once the payment lands. */}
      {isPro && entitlement && !entitlement.lifetime && (
        <section className="space-y-3">
          <div>
            <h2 className="font-display text-lg font-semibold">
              {t("lifetimeUpsellTitle")}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {t("lifetimeUpsellBody")}
            </p>
          </div>

          <PricingPlans
            status={status}
            pending={pending}
            onChoose={onChoose}
            disabled={status ? !status.billingEnabled : false}
            only={["lifetime"]}
          />

          <p className="text-xs text-muted-foreground">{t("lifetimeUpsellNote")}</p>
        </section>
      )}

      {!isPro && authStatus === "authenticated" && <QuotaStrip />}

      {!isPro && (
        <>
          <PricingPlans
            status={status}
            pending={pending}
            onChoose={onChoose}
            disabled={status ? !status.billingEnabled : false}
          />
          <p className="text-center text-xs text-muted-foreground">{t("stripeNote")}</p>
        </>
      )}

      <Perks />

      {!isPro && <Comparison freeLimit={freeLimit} />}

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">{t("faqTitle")}</h2>
        <Faq />
      </section>
    </div>
  );
}
