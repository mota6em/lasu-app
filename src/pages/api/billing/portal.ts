import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import type Stripe from "stripe";
import { authOptions } from "../auth/[...nextauth]";
import { connectToDB } from "@/lib/mongodb";
import { User, type IUser } from "@/models/user";
import { syncFromStripe } from "@/lib/billing";
import { appUrl, hasStripe, PRICE_IDS, stripe, stripeError } from "@/lib/stripe";
import { defaultLocale, locales } from "@/i18n/locales";

const UPGRADE = "/dashboard/upgrade";

function localePath(locale: string, path: string) {
  return locale === defaultLocale ? path : `/${locale}${path}`;
}

function safeLocale(value: unknown) {
  return typeof value === "string" && locales.includes(value) ? value : defaultLocale;
}

let configurationId: string | null = null;

async function portalConfiguration() {
  if (configurationId) return configurationId;

  const existing = await stripe.billingPortal.configurations.list({ limit: 1, active: true });
  if (existing.data.length) {
    configurationId = existing.data[0].id;
    return configurationId;
  }

  const products: Stripe.BillingPortal.ConfigurationCreateParams.Features.SubscriptionUpdate.Product[] =
    [];

  try {
    const [monthly, yearly] = await Promise.all([
      stripe.prices.retrieve(PRICE_IDS.monthly),
      stripe.prices.retrieve(PRICE_IDS.yearly),
    ]);
    const productId = typeof monthly.product === "string" ? monthly.product : monthly.product.id;
    products.push({ product: productId, prices: [monthly.id, yearly.id] });
  } catch (err) {
    console.warn("portal: could not read prices for plan switching:", err);
  }

  const created = await stripe.billingPortal.configurations.create({
    business_profile: {
      headline: "LaSu — manage your Pro subscription",
      privacy_policy_url: `${appUrl()}/privacy`,
      ...(process.env.NEXT_PUBLIC_TERMS_URL
        ? { terms_of_service_url: process.env.NEXT_PUBLIC_TERMS_URL }
        : {}),
    },
    features: {
      customer_update: { enabled: true, allowed_updates: ["email", "address", "name"] },
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      subscription_cancel: {
        enabled: true,
        mode: "at_period_end",
        cancellation_reason: {
          enabled: true,
          options: [
            "too_expensive",
            "missing_features",
            "switched_service",
            "unused",
            "customer_service",
            "too_complex",
            "low_quality",
            "other",
          ],
        },
      },
      ...(products.length
        ? {
            subscription_update: {
              enabled: true,
              default_allowed_updates: ["price"] as const,
              proration_behavior: "create_prorations" as const,
              products,
            },
          }
        : {}),
    },
  });

  configurationId = created.id;
  return configurationId;
}

function flowFor(intent: unknown, subscriptionId: string, returnUrl: string) {
  if (!subscriptionId) return undefined;

  if (intent === "cancel") {
    return {
      type: "subscription_cancel" as const,
      subscription_cancel: { subscription: subscriptionId },
      after_completion: { type: "redirect" as const, redirect: { return_url: returnUrl } },
    };
  }

  if (intent === "update") {
    return {
      type: "subscription_update" as const,
      subscription_update: { subscription: subscriptionId },
      after_completion: { type: "redirect" as const, redirect: { return_url: returnUrl } },
    };
  }

  if (intent === "payment_method") {
    return {
      type: "payment_method_update" as const,
      after_completion: { type: "redirect" as const, redirect: { return_url: returnUrl } },
    };
  }

  return undefined;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!hasStripe()) return res.status(503).json({ error: "billing_unavailable" });

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) return res.status(401).json({ error: "login_required" });

  const locale = safeLocale(req.body?.locale);
  const returnUrl = `${appUrl()}${localePath(locale, UPGRADE)}?portal=closed`;

  try {
    await connectToDB();

    const reconciled = await syncFromStripe(session.user.id).catch(() => null);
    const user =
      reconciled?.user ??
      (await User.findById(session.user.id)
        .select("_id subscription")
        .lean<(IUser & { _id: string }) | null>());

    const customerId = user?.subscription?.customerId;
    if (!customerId) return res.status(409).json({ error: "no_customer" });

    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
      configuration: await portalConfiguration(),
      flow_data: flowFor(req.body?.intent, user?.subscription?.subscriptionId ?? "", returnUrl),
    });

    return res.status(200).json({ url: portal.url });
  } catch (err) {
    configurationId = null;
    const { status, message } = stripeError(err);
    return res.status(status).json({ error: message });
  }
}
