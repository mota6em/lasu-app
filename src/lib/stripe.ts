import Stripe from "stripe";
import { FALLBACK_PLANS, PLAN_ORDER, type PlanId, type PlanShape } from "@/lib/plans";

const secretKey = process.env.STRIPE_SECRET_KEY;

export const STRIPE_API_VERSION = "2025-08-27.basil" as const;

export const stripe = new Stripe(secretKey ?? "", {
  apiVersion: STRIPE_API_VERSION,
  typescript: true,
  timeout: 20_000,
  maxNetworkRetries: 2,
  appInfo: { name: "LaSu", url: "https://lasu.online" },
});

export const PRICE_IDS: Record<PlanId, string> = {
  monthly: process.env.STRIPE_PRICE_ID_MONTHLY ?? "",
  yearly: process.env.STRIPE_PRICE_ID_YEARLY ?? "",
  lifetime: process.env.STRIPE_PRICE_ID_LIFETIME ?? "",
};

export function hasStripe() {
  return Boolean(secretKey) && PLAN_ORDER.every((plan) => PRICE_IDS[plan]);
}

export function hasWebhookSecret() {
  return Boolean(process.env.STRIPE_WEBHOOK_SECRET);
}

export function appUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "https://lasu.online").replace(/\/+$/, "");
}

export function planForPrice(priceId: string | null | undefined): PlanId | null {
  if (!priceId) return null;
  const match = PLAN_ORDER.find((plan) => PRICE_IDS[plan] === priceId);
  return match ?? null;
}

let catalogue: { plans: Record<PlanId, PlanShape>; at: number } | null = null;
const CATALOGUE_TTL_MS = 10 * 60 * 1000;

function shapeOf(id: PlanId, price: Stripe.Price): PlanShape {
  return {
    id,
    mode: price.type === "recurring" ? "subscription" : "payment",
    interval: price.recurring?.interval === "year" ? "year" : price.recurring?.interval === "month" ? "month" : null,
    amount: price.unit_amount ?? FALLBACK_PLANS[id].amount,
    currency: price.currency ?? FALLBACK_PLANS[id].currency,
  };
}

export async function planCatalogue(): Promise<Record<PlanId, PlanShape>> {
  if (catalogue && Date.now() - catalogue.at < CATALOGUE_TTL_MS) return catalogue.plans;
  if (!hasStripe()) return FALLBACK_PLANS;

  try {
    const prices = await Promise.all(
      PLAN_ORDER.map((plan) => stripe.prices.retrieve(PRICE_IDS[plan])),
    );

    const plans = PLAN_ORDER.reduce(
      (acc, plan, index) => {
        acc[plan] = shapeOf(plan, prices[index]);
        return acc;
      },
      {} as Record<PlanId, PlanShape>,
    );

    catalogue = { plans, at: Date.now() };
    return plans;
  } catch (err) {
    console.error("stripe: price catalogue unavailable, using fallbacks:", err);
    return FALLBACK_PLANS;
  }
}

export function stripeError(err: unknown): { status: number; message: string } {
  if (err instanceof Stripe.errors.StripeError) {
    if (err.type === "StripeCardError") {
      return { status: 402, message: err.message };
    }
    if (err.type === "StripeInvalidRequestError") {
      console.error("stripe: invalid request:", err.message);
      return { status: 500, message: "Checkout is misconfigured. We are on it." };
    }
    if (err.type === "StripeRateLimitError") {
      return { status: 429, message: "Too many attempts. Try again in a moment." };
    }
    if (err.type === "StripeConnectionError" || err.type === "StripeAPIError") {
      return { status: 503, message: "Could not reach the payment provider. Try again shortly." };
    }
  }
  console.error("stripe: unexpected failure:", err);
  return { status: 500, message: "Something went wrong. Try again." };
}
