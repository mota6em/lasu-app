export type PlanId = "monthly" | "yearly" | "lifetime";

export type PlanShape = {
  id: PlanId;
  mode: "subscription" | "payment";
  interval: "month" | "year" | null;
  amount: number;
  currency: string;
};

export const PLAN_ORDER: PlanId[] = ["monthly", "yearly", "lifetime"];

export const RECOMMENDED_PLAN: PlanId = "yearly";

export const FALLBACK_PLANS: Record<PlanId, PlanShape> = {
  monthly: { id: "monthly", mode: "subscription", interval: "month", amount: 349, currency: "usd" },
  yearly: { id: "yearly", mode: "subscription", interval: "year", amount: 2999, currency: "usd" },
  lifetime: { id: "lifetime", mode: "payment", interval: null, amount: 6500, currency: "usd" },
};

export function isPlanId(value: unknown): value is PlanId {
  return typeof value === "string" && (PLAN_ORDER as string[]).includes(value);
}

const ZERO_DECIMAL = new Set([
  "bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga",
  "pyg", "rwf", "ugx", "vnd", "vuv", "xaf", "xof", "xpf",
]);

export function minorToMajor(amount: number, currency: string) {
  return ZERO_DECIMAL.has(currency.toLowerCase()) ? amount : amount / 100;
}

export function formatPrice(
  amount: number,
  currency: string,
  locale = "en",
  options?: Intl.NumberFormatOptions,
) {
  const value = minorToMajor(amount, currency);
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
      maximumFractionDigits: 2,
      ...options,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency.toUpperCase()}`;
  }
}

export function perMonthAmount(plan: PlanShape) {
  if (plan.interval === "year") return Math.round(plan.amount / 12);
  return plan.amount;
}

export function yearlySavingsPercent(monthly: PlanShape, yearly: PlanShape) {
  if (monthly.currency !== yearly.currency) return 0;
  const fullYear = monthly.amount * 12;
  if (!fullYear || yearly.amount >= fullYear) return 0;
  return Math.round(((fullYear - yearly.amount) / fullYear) * 100);
}
