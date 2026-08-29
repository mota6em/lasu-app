"use client";

import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, LogIn, Sparkles, Timer } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useCountdown } from "./Countdown";
import { useUpgradeDialog } from "@/store/useUpgradeDialog";
import type { TranslateError } from "@/types/billing";

const COPY = {
  login_required: { title: "signInTitle", body: "signInBody" },
  upgrade_required: { title: "limitTitle", body: "limitBody" },
  quota_exceeded: { title: "proLimitTitle", body: "proLimitBody" },
  rate_limited: { title: "rateLimitTitle", body: "rateLimitBody" },
} as const;

export function isQuotaError(error: TranslateError | null): boolean {
  return Boolean(error && error.code !== "generic" && error.code in COPY);
}

export default function QuotaPaywall({
  error,
  onRetry,
  compact,
}: {
  error: TranslateError;
  onRetry?: () => void;
  compact?: boolean;
}) {
  const t = useTranslations("billing");
  const tComposer = useTranslations("composer");
  const openUpgrade = useUpgradeDialog((s) => s.open);

  const code = (error.code in COPY ? error.code : "upgrade_required") as keyof typeof COPY;
  const copy = COPY[code];
  const limit = error.limit ?? 0;
  const { label, elapsed } = useCountdown(error.resetAt);

  const sellsPro = code === "upgrade_required";
  const isGuest = code === "login_required";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "surface-card relative overflow-hidden",
        compact ? "p-4" : "p-5",
        sellsPro
          ? "border-brand-500/35 bg-gradient-to-br from-brand-500/8 to-iris-500/8"
          : "border-border",
      )}
    >
      {sellsPro && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-brand-400/25 blur-3xl"
        />
      )}

      <div className="relative flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
            sellsPro
              ? "bg-gradient-to-br from-brand-500 to-brand-400 text-primary-foreground shadow-[var(--shadow-brand)]"
              : "bg-surface-2 text-muted-foreground",
          )}
        >
          {sellsPro ? (
            <Sparkles className="h-4.5 w-4.5" />
          ) : isGuest ? (
            <LogIn className="h-4 w-4" />
          ) : code === "rate_limited" ? (
            <Timer className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-base font-semibold leading-snug">
              {t(copy.title, { limit })}
            </h3>
            {limit > 0 && code !== "rate_limited" && (
              <span className="rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[10px] font-bold tabular-nums text-muted-foreground">
                {limit}/{limit}
              </span>
            )}
          </div>

          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {t(copy.body, { limit })}
          </p>

          {error.resetAt && !isGuest && (
            <p className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span className="tabular-nums">
                {elapsed ? t("resetsNow") : t("resetsIn", { time: label })}
              </span>
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {isGuest && (
              <button
                onClick={() => signIn("google")}
                className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-brand)] transition-transform active:scale-[0.98]"
              >
                <LogIn className="h-3.5 w-3.5" />
                {t("signInCta")}
              </button>
            )}

            {sellsPro && (
              <>
                <button
                  onClick={() => openUpgrade("quota")}
                  className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-brand)] transition-transform active:scale-[0.98]"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {t("upgrade")}
                </button>
                <Link
                  href="/dashboard/upgrade"
                  className="inline-flex h-9 items-center rounded-lg border border-border bg-surface px-3.5 text-sm font-medium transition-colors hover:border-border-strong hover:bg-surface-2"
                >
                  {t("compareTitle")}
                </Link>
              </>
            )}

            {elapsed && onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex h-9 cursor-pointer items-center rounded-lg border border-border bg-surface px-3.5 text-sm font-medium transition-colors hover:border-border-strong hover:bg-surface-2"
              >
                {tComposer("translate")}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
