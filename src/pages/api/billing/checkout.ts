import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import type Stripe from "stripe";
import { authOptions } from "../auth/[...nextauth]";
import { connectToDB } from "@/lib/mongodb";
import { User, type IUser } from "@/models/user";
import { ensureCustomer, syncFromStripe } from "@/lib/billing";
import { entitlementOf } from "@/lib/entitlement";
import { appUrl, hasStripe, PRICE_IDS, stripe, stripeError } from "@/lib/stripe";
import { isPlanId, type PlanId } from "@/lib/plans";
import { rateLimit } from "@/lib/rateLimit";
import { defaultLocale, locales } from "@/i18n/locales";

const CHECKOUT_LOCALE: Record<string, Stripe.Checkout.SessionCreateParams.Locale> = {
  en: "en",
  zh: "zh",
  es: "es",
  fr: "fr",
  pt: "pt",
  ru: "ru",
  de: "de",
  ja: "ja",
  it: "it",
  tr: "tr",
};

const DASHBOARD = "/dashboard";
const UPGRADE = "/dashboard/upgrade";

function localePath(locale: string, path: string) {
  return locale === defaultLocale ? path : `/${locale}${path}`;
}

function safeLocale(value: unknown) {
  return typeof value === "string" && locales.includes(value) ? value : defaultLocale;
}

function safeReturn(value: unknown, locale: string) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return localePath(locale, DASHBOARD);
  }
  return value;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!hasStripe()) {
    console.error("checkout: Stripe keys or price ids are missing");
    return res.status(503).json({ error: "billing_unavailable" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: "login_required" });
  }

  const plan = req.body?.plan;
  if (!isPlanId(plan)) {
    return res.status(400).json({ error: "unknown_plan" });
  }

  const userId = session.user.id;

  const attempts = await rateLimit(`checkout:${userId}`, 12, "1h");
  if (!attempts.ok) {
    return res.status(429).json({ error: "too_many_attempts", resetTime: attempts.resetAt });
  }

  const locale = safeLocale(req.body?.locale);
  const source = req.body?.source === "extension" ? "extension" : "web";
  const returnTo = safeReturn(req.body?.returnTo, locale);

  try {
    await connectToDB();
    const user = await User.findById(userId)
      .select("_id email name tier subscription")
      .lean<(IUser & { _id: string }) | null>();

    if (!user) return res.status(401).json({ error: "login_required" });

    const reconciled = await syncFromStripe(userId).catch(() => null);
    const current = entitlementOf(reconciled?.user?.subscription ?? user.subscription);

    if (current.lifetime) {
      return res.status(409).json({ error: "already_lifetime" });
    }

    if (current.tier === "pro" && plan !== "lifetime" && !current.cancelAtPeriodEnd) {
      return res.status(409).json({ error: "already_subscribed", manage: current.manageable });
    }

    const customerId = await ensureCustomer(user);
    const base = appUrl();
    const successPath = localePath(locale, UPGRADE);

    const replacing =
      plan === "lifetime"
        ? (reconciled?.user?.subscription?.subscriptionId ??
           user.subscription?.subscriptionId ??
           "")
        : "";

    const metadata = {
      userId,
      plan,
      priceId: PRICE_IDS[plan as PlanId],
      source,
      ...(replacing ? { subscriptionId: replacing } : {}),
    };

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: plan === "lifetime" ? "payment" : "subscription",
      customer: customerId,
      client_reference_id: userId,
      line_items: [{ price: PRICE_IDS[plan as PlanId], quantity: 1 }],
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      locale: CHECKOUT_LOCALE[locale] ?? "auto",
      metadata,
      success_url: `${base}${successPath}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}${successPath}?checkout=cancelled`,
    };

    if (plan === "lifetime") {
      params.payment_intent_data = { metadata };
      params.invoice_creation = { enabled: true };
    } else {
      params.subscription_data = { metadata };
      params.payment_method_collection = "always";
    }

    const checkout = await stripe.checkout.sessions.create(params, {
      idempotencyKey: `checkout:${userId}:${plan}:${Math.floor(Date.now() / 60_000)}`,
    });

    if (!checkout.url) {
      console.error(`checkout: Stripe returned session ${checkout.id} with no url`);
      return res.status(502).json({ error: "checkout_unavailable" });
    }

    return res.status(200).json({ url: checkout.url, sessionId: checkout.id, returnTo });
  } catch (err) {
    const { status, message } = stripeError(err);
    return res.status(status).json({ error: message });
  }
}
