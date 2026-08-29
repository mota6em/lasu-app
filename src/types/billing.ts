import type { PlanId, PlanShape } from "@/lib/plans";

export type SubscriptionStatus =
  | "none"
  | "trialing"
  | "active"
  | "past_due"
  | "unpaid"
  | "paused"
  | "incomplete"
  | "incomplete_expired"
  | "canceled";

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

export type QuotaState = {
  audience: "guest" | "free" | "pro";
  limit: number;
  used: number;
  remaining: number;
  resetAt: number | null;
  unlimited: boolean;
  exhausted: boolean;
};

export type BillingStatus = {
  signedIn: boolean;
  tier: "free" | "pro";
  entitlement: Entitlement;
  quota: QuotaState;
  plans: Record<PlanId, PlanShape>;
  recommended: PlanId;
  billingEnabled: boolean;
};

export type QuotaErrorCode =
  | "login_required"
  | "upgrade_required"
  | "quota_exceeded"
  | "rate_limited";

export type TranslateError = {
  message: string;
  code: QuotaErrorCode | "generic";
  limit?: number;
  used?: number;
  resetAt?: number;
};
