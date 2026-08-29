import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { billingStatus } from "@/lib/billingStatus";
import {
  applySubscription,
  cancelRecurringForLifetime,
  grantLifetime,
  planFromSession,
} from "@/lib/billing";
import { hasStripe, stripe } from "@/lib/stripe";
import { rateLimit } from "@/lib/rateLimit";

function idOf(value: string | { id: string } | null | undefined) {
  if (!value) return "";
  return typeof value === "string" ? value : value.id;
}

async function adoptCheckout(sessionId: string, userId: string) {
  const checkout = await stripe.checkout.sessions.retrieve(sessionId);

  const owner = checkout.client_reference_id || checkout.metadata?.userId;
  if (owner && owner !== userId) {
    console.warn(`sync: checkout ${sessionId} belongs to ${owner}, not ${userId}`);
    return false;
  }

  if (checkout.payment_status !== "paid" && checkout.status !== "complete") return false;

  const customerId = idOf(checkout.customer);
  if (customerId) await applySubscription(userId, { customerId });

  if (checkout.mode === "payment" && planFromSession(checkout) === "lifetime") {
    await grantLifetime(userId, { priceId: checkout.metadata?.priceId });
    await cancelRecurringForLifetime(userId, checkout.metadata?.subscriptionId);
    return true;
  }

  return checkout.mode === "subscription";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) return res.status(401).json({ error: "login_required" });

  const userId = session.user.id;

  const attempts = await rateLimit(`billing-sync:${userId}`, 30, "1h");
  if (!attempts.ok) {
    return res.status(429).json({ error: "too_many_attempts", resetTime: attempts.resetAt });
  }

  const sessionId = typeof req.body?.sessionId === "string" ? req.body.sessionId : "";

  try {
    if (sessionId && hasStripe() && /^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
      await adoptCheckout(sessionId, userId).catch((err) => {
        console.error("sync: could not adopt checkout session:", err);
      });
    }

    const status = await billingStatus(req, { userId, forceSync: true });
    res.setHeader("Cache-Control", "private, no-store");
    return res.status(200).json(status);
  } catch (err) {
    console.error("billing sync failed:", err);
    return res.status(500).json({ error: "sync_failed" });
  }
}
