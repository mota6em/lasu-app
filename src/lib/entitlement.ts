import type { ISubscription, SubscriptionStatus } from "@/models/user";
import type { PlanId } from "@/lib/plans";

export const PAST_DUE_GRACE_MS = 3 * 24 * 60 * 60 * 1000;

const STALE_AFTER_MS = 24 * 60 * 60 * 1000;

const ENTITLED_STATUSES: SubscriptionStatus[] = ["active", "trialing"];
const GRACE_STATUSES: SubscriptionStatus[] = ["past_due", "unpaid"];

export type Entitlement = {
  tier: "free" | "pro";
  status: SubscriptionStatus;
  plan: PlanId | null;
  lifetime: boolean;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  inGrace: boolean;
  paymentFailed: boolean;
  hasCustomer: boolean;
  manageable: boolean;
  stale: boolean;
};

const EMPTY: ISubscription = {
  provider: "stripe",
  status: "none",
  lifetime: false,
  cancelAtPeriodEnd: false,
};

function asDate(value: unknown): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value as string);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isEntitled(sub: ISubscription | undefined | null, now = Date.now()) {
  if (!sub) return false;
  if (sub.lifetime) return true;
  if (ENTITLED_STATUSES.includes(sub.status)) return true;

  if (GRACE_STATUSES.includes(sub.status)) {
    const end = asDate(sub.currentPeriodEnd);
    if (end) return end.getTime() + PAST_DUE_GRACE_MS > now;
  }

  return false;
}

export function tierFor(sub: ISubscription | undefined | null, now = Date.now()) {
  return isEntitled(sub, now) ? "pro" : "free";
}

function isStale(sub: ISubscription, now: number) {
  if (sub.lifetime || sub.status === "none") return false;
  const end = asDate(sub.currentPeriodEnd);
  if (!end) return false;
  return end.getTime() + STALE_AFTER_MS < now;
}

export function entitlementOf(
  sub: ISubscription | undefined | null,
  now = Date.now(),
): Entitlement {
  const value = sub ?? EMPTY;
  const end = asDate(value.currentPeriodEnd);
  const entitled = isEntitled(value, now);

  return {
    tier: entitled ? "pro" : "free",
    status: value.status ?? "none",
    plan: (value.plan as PlanId | null) ?? null,
    lifetime: Boolean(value.lifetime),
    currentPeriodEnd: end ? end.toISOString() : null,
    cancelAtPeriodEnd: Boolean(value.cancelAtPeriodEnd),
    canceledAt: asDate(value.canceledAt)?.toISOString() ?? null,
    inGrace: entitled && GRACE_STATUSES.includes(value.status),
    paymentFailed: Boolean(value.lastPaymentFailedAt) && GRACE_STATUSES.includes(value.status),
    hasCustomer: Boolean(value.customerId),
    manageable: Boolean(value.customerId) && !value.lifetime,
    stale: isStale(value, now),
  };
}

export function effectiveTier(user: {
  tier?: "free" | "pro";
  subscription?: ISubscription | null;
}, now = Date.now()): "free" | "pro" {
  const sub = user.subscription;
  const tracked = Boolean(sub && (sub.lifetime || (sub.status && sub.status !== "none")));
  if (!tracked) return user.tier === "pro" ? "pro" : "free";
  return tierFor(sub, now);
}
