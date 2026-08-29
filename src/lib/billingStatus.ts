import type { NextApiRequest } from "next";
import { connectToDB } from "@/lib/mongodb";
import { User, type IUser } from "@/models/user";
import { entitlementOf } from "@/lib/entitlement";
import { syncFromStripe } from "@/lib/billing";
import { peekRateLimit } from "@/lib/rateLimit";
import {
  audienceFor,
  quotaFor,
  quotaIdentifier,
  QUOTA_WINDOW,
  type Audience,
} from "@/lib/quota";
import { planCatalogue, hasStripe } from "@/lib/stripe";
import { RECOMMENDED_PLAN } from "@/lib/plans";
import type { BillingStatus, QuotaState } from "@/types/billing";

export function clientIp(req: NextApiRequest) {
  const forwarded = req.headers["x-forwarded-for"];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return value?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
}

export async function quotaState(
  audience: Audience,
  id: string,
): Promise<QuotaState> {
  const limit = quotaFor(audience);
  const snapshot = await peekRateLimit(quotaIdentifier(audience, id), QUOTA_WINDOW);
  const used = Math.min(snapshot.count, limit);

  return {
    audience,
    limit,
    used,
    remaining: Math.max(0, limit - snapshot.count),
    resetAt: snapshot.resetAt ?? null,
    unlimited: audience === "pro",
    exhausted: snapshot.count >= limit,
  };
}

type Options = { userId?: string | null; forceSync?: boolean };

export async function billingStatus(
  req: NextApiRequest,
  { userId, forceSync = false }: Options,
): Promise<BillingStatus> {
  const plans = await planCatalogue();

  if (!userId) {
    return {
      signedIn: false,
      tier: "free",
      entitlement: entitlementOf(null),
      quota: await quotaState("guest", clientIp(req)),
      plans,
      recommended: RECOMMENDED_PLAN,
      billingEnabled: hasStripe(),
    };
  }

  await connectToDB();

  let user = await User.findById(userId)
    .select("_id email name tier subscription")
    .lean<(IUser & { _id: string }) | null>();

  let entitlement = entitlementOf(user?.subscription);

  if (user && hasStripe() && (forceSync || entitlement.stale)) {
    const reconciled = await syncFromStripe(userId).catch((err) => {
      console.error("billingStatus: reconcile failed:", err);
      return null;
    });
    if (reconciled?.user) {
      user = reconciled.user as IUser & { _id: string };
      entitlement = entitlementOf(user.subscription);
    }
  }

  const audience = audienceFor(true, entitlement.tier);

  return {
    signedIn: true,
    tier: entitlement.tier,
    entitlement,
    quota: await quotaState(audience, userId),
    plans,
    recommended: RECOMMENDED_PLAN,
    billingEnabled: hasStripe(),
  };
}
