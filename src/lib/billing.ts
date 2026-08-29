import type Stripe from "stripe";
import { connectToDB } from "@/lib/mongodb";
import { User, type IUser, type ISubscription, type SubscriptionStatus } from "@/models/user";
import { tierFor } from "@/lib/entitlement";
import { planForPrice, stripe, hasStripe } from "@/lib/stripe";
import type { PlanId } from "@/lib/plans";

type SubscriptionPatch = Partial<ISubscription>;

const STATUSES: SubscriptionStatus[] = [
  "trialing",
  "active",
  "past_due",
  "unpaid",
  "paused",
  "incomplete",
  "incomplete_expired",
  "canceled",
];

function toStatus(value: string | null | undefined): SubscriptionStatus {
  return STATUSES.includes(value as SubscriptionStatus)
    ? (value as SubscriptionStatus)
    : "none";
}

function secondsToDate(value: number | null | undefined) {
  return typeof value === "number" && value > 0 ? new Date(value * 1000) : null;
}

function idOf(value: string | { id: string } | null | undefined) {
  if (!value) return "";
  return typeof value === "string" ? value : value.id;
}

function periodEndOf(subscription: Stripe.Subscription) {
  const ends = subscription.items?.data
    ?.map((item) => item.current_period_end)
    .filter((value): value is number => typeof value === "number" && value > 0);
  if (!ends?.length) return null;
  return secondsToDate(Math.max(...ends));
}

function priceOf(subscription: Stripe.Subscription) {
  return subscription.items?.data?.[0]?.price?.id ?? "";
}

export function patchFromSubscription(subscription: Stripe.Subscription): SubscriptionPatch {
  const priceId = priceOf(subscription);

  return {
    provider: "stripe",
    customerId: idOf(subscription.customer),
    subscriptionId: subscription.id,
    status: toStatus(subscription.status),
    plan: planForPrice(priceId),
    priceId,
    currentPeriodEnd: periodEndOf(subscription),
    cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
    canceledAt: secondsToDate(subscription.canceled_at),
    startedAt: secondsToDate(subscription.start_date),
    endedAt: secondsToDate(subscription.ended_at),
  };
}

function dotted(patch: SubscriptionPatch) {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) continue;
    out[`subscription.${key}`] = value;
  }
  return out;
}

type ApplyOptions = {
  eventAt?: number;
  reason?: string;
};

export async function applySubscription(
  userId: string,
  patch: SubscriptionPatch,
  { eventAt = 0, reason = "" }: ApplyOptions = {},
) {
  await connectToDB();

  const current = await User.findById(userId).select("subscription tier email name").lean<
    (IUser & { _id: string }) | null
  >();
  if (!current) return null;

  const known = current.subscription?.syncedEventAt ?? 0;
  if (eventAt && known && eventAt < known) {
    console.warn(
      `billing: ignoring stale event for ${userId} (${eventAt} < ${known})${reason ? ` — ${reason}` : ""}`,
    );
    return { user: current, tier: current.tier, changed: false, stale: true, previousTier: current.tier };
  }

  const merged: ISubscription = {
    ...(current.subscription ?? { provider: "stripe", status: "none", lifetime: false, cancelAtPeriodEnd: false }),
    ...patch,
  };

  const effective: SubscriptionPatch =
    merged.lifetime && merged.plan !== "lifetime"
      ? { ...patch, plan: "lifetime" }
      : patch;

  if (effective.plan === "lifetime") merged.plan = "lifetime";

  const tier = tierFor(merged);
  const lapsed = current.tier === "pro" && tier === "free";

  const updated = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        ...dotted(effective),
        ...(lapsed ? { "subscription.welcomedAt": null } : {}),
        "subscription.updatedAt": new Date(),
        ...(eventAt ? { "subscription.syncedEventAt": eventAt } : {}),
        tier,
      },
    },
    { new: true },
  ).lean<(IUser & { _id: string }) | null>();

  const changed = current.tier !== tier;
  if (changed) {
    console.info(`billing: ${current.email} ${current.tier} -> ${tier}${reason ? ` (${reason})` : ""}`);
  }

  return { user: updated, tier, changed, stale: false, previousTier: current.tier };
}

export async function grantLifetime(userId: string, options: ApplyOptions & { priceId?: string } = {}) {
  return applySubscription(
    userId,
    {
      lifetime: true,
      plan: "lifetime",
      status: "active",
      priceId: options.priceId,
      startedAt: new Date(),
      canceledAt: null,
      endedAt: null,
      cancelAtPeriodEnd: false,
    },
    { ...options, reason: options.reason || "lifetime purchase" },
  );
}

export async function revokeLifetime(userId: string, options: ApplyOptions = {}) {
  return applySubscription(
    userId,
    { lifetime: false, plan: null, status: "canceled", endedAt: new Date() },
    { ...options, reason: options.reason || "lifetime revoked" },
  );
}

export async function claimWelcome(userId: string) {
  await connectToDB();
  const claimed = await User.findOneAndUpdate(
    {
      _id: userId,
      $or: [
        { "subscription.welcomedAt": null },
        { "subscription.welcomedAt": { $exists: false } },
      ],
    },
    { $set: { "subscription.welcomedAt": new Date() } },
  ).lean();
  return Boolean(claimed);
}

export async function findUserByCustomer(customerId: string) {
  if (!customerId) return null;
  await connectToDB();

  const direct = await User.findOne({ "subscription.customerId": customerId })
    .select("_id email name tier subscription")
    .lean<(IUser & { _id: string }) | null>();
  if (direct) return direct;

  if (!hasStripe()) return null;

  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) return null;

    const metaUserId = customer.metadata?.userId;
    if (metaUserId) {
      const byMeta = await User.findById(metaUserId)
        .select("_id email name tier subscription")
        .lean<(IUser & { _id: string }) | null>();
      if (byMeta) return byMeta;
    }

    if (!customer.email) return null;
    return await User.findOne({ email: customer.email.toLowerCase() })
      .select("_id email name tier subscription")
      .lean<(IUser & { _id: string }) | null>();
  } catch (err) {
    console.error(`billing: could not resolve customer ${customerId}:`, err);
    return null;
  }
}

export async function ensureCustomer(user: { _id: unknown; email: string; name?: string; subscription?: ISubscription }) {
  const existing = user.subscription?.customerId;
  const userId = String(user._id);

  if (existing) {
    try {
      const customer = await stripe.customers.retrieve(existing);
      if (!customer.deleted) return existing;
    } catch {
      console.warn(`billing: customer ${existing} is gone, creating a new one`);
    }
  }

  const found = await stripe.customers.list({ email: user.email, limit: 1 });
  const reused = found.data.find((customer) => !customer.deleted);

  const customer =
    reused ??
    (await stripe.customers.create(
      {
        email: user.email,
        name: user.name || undefined,
        metadata: { userId },
      },
      { idempotencyKey: `customer:${userId}` },
    ));

  if (reused && reused.metadata?.userId !== userId) {
    await stripe.customers
      .update(reused.id, { metadata: { ...reused.metadata, userId } })
      .catch(() => null);
  }

  await connectToDB();
  await User.updateOne({ _id: userId }, { $set: { "subscription.customerId": customer.id } });

  return customer.id;
}

function rank(subscription: Stripe.Subscription) {
  const order: Record<string, number> = {
    active: 0,
    trialing: 1,
    past_due: 2,
    unpaid: 3,
    paused: 4,
    incomplete: 5,
    canceled: 6,
    incomplete_expired: 7,
  };
  return order[subscription.status] ?? 9;
}

async function lifetimePaid(customerId: string) {
  const intents = await stripe.paymentIntents.list({ customer: customerId, limit: 20 });
  return intents.data.some(
    (intent) => intent.status === "succeeded" && intent.metadata?.plan === "lifetime",
  );
}

export async function syncFromStripe(userId: string) {
  if (!hasStripe()) return null;
  await connectToDB();

  const user = await User.findById(userId)
    .select("_id email name tier subscription")
    .lean<(IUser & { _id: string }) | null>();
  if (!user) return null;

  let customerId = user.subscription?.customerId ?? "";

  if (!customerId) {
    const found = await stripe.customers.list({ email: user.email, limit: 1 });
    customerId = found.data.find((customer) => !customer.deleted)?.id ?? "";
    if (!customerId) return { user, tier: user.tier, changed: false };
  }

  const [subscriptions, lifetime] = await Promise.all([
    stripe.subscriptions.list({ customer: customerId, status: "all", limit: 10 }),
    lifetimePaid(customerId).catch(() => Boolean(user.subscription?.lifetime)),
  ]);

  const best = [...subscriptions.data].sort(
    (a, b) => rank(a) - rank(b) || b.created - a.created,
  )[0];

  const patch: SubscriptionPatch = best
    ? patchFromSubscription(best)
    : {
        provider: "stripe",
        customerId,
        subscriptionId: "",
        status: "none",
        plan: null,
        priceId: "",
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      };

  patch.customerId = customerId;
  patch.lifetime = lifetime || Boolean(user.subscription?.lifetime);

  if (patch.lifetime) {
    patch.plan = best && patch.status !== "none" && patch.status !== "canceled" ? patch.plan : "lifetime";
  }

  return applySubscription(userId, patch, { reason: "reconciled from stripe" });
}

const BILLABLE: Stripe.Subscription.Status[] = [
  "active",
  "trialing",
  "past_due",
  "unpaid",
  "paused",
  "incomplete",
];

export async function cancelRecurringForLifetime(
  userId: string,
  hint?: string | null,
) {
  if (!hasStripe()) return { cancelled: [] as string[] };

  await connectToDB();
  const user = await User.findById(userId)
    .select("_id email subscription")
    .lean<(IUser & { _id: string }) | null>();

  const customerId = user?.subscription?.customerId ?? "";
  const found = new Map<string, Stripe.Subscription>();

  if (customerId) {
    try {
      const list = await stripe.subscriptions.list({
        customer: customerId,
        status: "all",
        limit: 20,
      });
      for (const subscription of list.data) found.set(subscription.id, subscription);
    } catch (err) {
      console.error(`billing: could not list subscriptions for ${customerId}:`, err);
    }
  }

  for (const id of [hint, user?.subscription?.subscriptionId]) {
    if (!id || found.has(id)) continue;
    try {
      found.set(id, await stripe.subscriptions.retrieve(id));
    } catch {
    }
  }

  const cancelled: string[] = [];

  for (const subscription of found.values()) {
    if (!BILLABLE.includes(subscription.status)) continue;
    if (subscription.cancel_at_period_end) {
      cancelled.push(subscription.id);
      continue;
    }

    try {
      await stripe.subscriptions.update(subscription.id, {
        cancel_at_period_end: true,
        metadata: {
          ...subscription.metadata,
          canceled_reason: "upgraded_to_lifetime",
        },
      });
      cancelled.push(subscription.id);
      console.info(
        `billing: ${user?.email ?? userId} bought lifetime — ${subscription.id} will not renew`,
      );
    } catch (err) {
      console.error(`billing: could not stop renewal on ${subscription.id}:`, err);
    }
  }

  return { cancelled };
}

export function planFromSession(session: Stripe.Checkout.Session): PlanId | null {
  const fromMetadata = session.metadata?.plan;
  if (fromMetadata === "monthly" || fromMetadata === "yearly" || fromMetadata === "lifetime") {
    return fromMetadata;
  }
  return null;
}
