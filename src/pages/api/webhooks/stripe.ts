import type { NextApiRequest, NextApiResponse } from "next";
import type Stripe from "stripe";
import { connectToDB } from "@/lib/mongodb";
import { StripeEvent } from "@/models/stripeEvent";
import { User, type IUser } from "@/models/user";
import { hasStripe, hasWebhookSecret, planCatalogue, stripe } from "@/lib/stripe";
import {
  applySubscription,
  cancelRecurringForLifetime,
  claimWelcome,
  findUserByCustomer,
  grantLifetime,
  patchFromSubscription,
  planFromSession,
  revokeLifetime,
} from "@/lib/billing";
import {
  sendCancelScheduled,
  sendPaymentFailed,
  sendProWelcome,
  sendSubscriptionEnded,
} from "@/lib/billingEmail";
import type { PlanId } from "@/lib/plans";

export const config = { api: { bodyParser: false } };

const HANDLED = new Set([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
  "checkout.session.expired",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.paused",
  "customer.subscription.resumed",
  "customer.subscription.trial_will_end",
  "invoice.paid",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
  "charge.refunded",
  "charge.dispute.created",
  "customer.deleted",
]);

type Account = IUser & { _id: string };

async function rawBody(req: NextApiRequest) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

function idOf(value: string | { id: string } | null | undefined) {
  if (!value) return "";
  return typeof value === "string" ? value : value.id;
}

function subscriptionOfInvoice(invoice: Stripe.Invoice) {
  const parent = (invoice as unknown as {
    parent?: { subscription_details?: { subscription?: string | { id: string } } };
  }).parent;
  const nested = parent?.subscription_details?.subscription;
  if (nested) return idOf(nested);
  return idOf((invoice as unknown as { subscription?: string | { id: string } }).subscription);
}

async function userFor(
  customerId: string,
  fallbackUserId?: string | null,
): Promise<Account | null> {
  if (fallbackUserId) {
    await connectToDB();
    const direct = await User.findById(fallbackUserId)
      .select("_id email name tier subscription")
      .lean<Account | null>();
    if (direct) return direct;
  }
  return (await findUserByCustomer(customerId)) as Account | null;
}

async function priceOfPlan(plan: PlanId) {
  const plans = await planCatalogue().catch(() => null);
  const shape = plans?.[plan];
  return shape ? { amount: shape.amount, currency: shape.currency } : null;
}

async function announceUpgrade(user: Account, plan: PlanId | null, renewsAt: Date | null) {
  if (!plan) return;
  if (!(await claimWelcome(String(user._id)))) return;
  await sendProWelcome(user, plan, await priceOfPlan(plan), renewsAt);
}

async function syncSubscriptionId(
  subscriptionId: string,
  eventAt: number,
  fallbackUserId?: string | null,
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const patch = patchFromSubscription(subscription);
  const user = await userFor(patch.customerId ?? "", fallbackUserId);
  if (!user) {
    console.warn(`webhook: no account for customer ${patch.customerId} (sub ${subscriptionId})`);
    return null;
  }
  const outcome = await applySubscription(String(user._id), patch, {
    eventAt,
    reason: `subscription ${subscription.status}`,
  });
  return { user, patch, outcome, subscription };
}

async function handleCheckout(session: Stripe.Checkout.Session, eventAt: number) {
  if (session.payment_status === "unpaid") return;

  const customerId = idOf(session.customer);
  const userId = session.client_reference_id || session.metadata?.userId || null;
  const user = await userFor(customerId, userId);

  if (!user) {
    console.error(`webhook: checkout ${session.id} completed with no matching account`);
    return;
  }

  const plan = planFromSession(session);

  if (session.mode === "payment") {
    if (plan !== "lifetime") return;

    const before = user.tier;
    await grantLifetime(String(user._id), {
      eventAt,
      priceId: session.metadata?.priceId,
    });
    await applySubscription(String(user._id), { customerId }, { eventAt });

    await cancelRecurringForLifetime(
      String(user._id),
      session.metadata?.subscriptionId,
    );

    if (before !== "pro") await announceUpgrade(user, "lifetime", null);
    return;
  }

  const subscriptionId = idOf(session.subscription);
  if (!subscriptionId) return;

  const synced = await syncSubscriptionId(subscriptionId, eventAt, userId);
  if (synced && user.tier !== "pro" && synced.outcome?.tier === "pro") {
    await announceUpgrade(user, synced.patch.plan ?? plan, synced.patch.currentPeriodEnd ?? null);
  }
}

async function handleSubscriptionEvent(subscription: Stripe.Subscription, eventAt: number) {
  const patch = patchFromSubscription(subscription);
  const user = await userFor(patch.customerId ?? "", subscription.metadata?.userId);

  if (!user) {
    console.warn(`webhook: no account for customer ${patch.customerId} (sub ${subscription.id})`);
    return;
  }

  const before = user.subscription;
  const outcome = await applySubscription(String(user._id), patch, {
    eventAt,
    reason: `subscription ${subscription.status}`,
  });

  if (!outcome || outcome.stale) return;
  if (!outcome.changed && before?.cancelAtPeriodEnd === patch.cancelAtPeriodEnd) return;

  if (outcome.tier === "pro" && outcome.previousTier === "free") {
    await announceUpgrade(user, patch.plan ?? null, patch.currentPeriodEnd ?? null);
    return;
  }

  if (outcome.tier === "free" && outcome.previousTier === "pro") {
    await sendSubscriptionEnded(user);
    return;
  }

  const ownsLifetime =
    outcome.user?.subscription?.lifetime ?? before?.lifetime ?? false;

  if (patch.cancelAtPeriodEnd && !before?.cancelAtPeriodEnd && !ownsLifetime) {
    await sendCancelScheduled(user, patch.currentPeriodEnd ?? null);
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice, eventAt: number) {
  const subscriptionId = subscriptionOfInvoice(invoice);
  if (!subscriptionId) return;

  const synced = await syncSubscriptionId(subscriptionId, eventAt);
  if (!synced) return;

  await applySubscription(
    String(synced.user._id),
    { latestInvoiceStatus: invoice.status ?? "paid", lastPaymentFailedAt: null },
    { eventAt },
  );

  if (synced.user.tier !== "pro" && synced.outcome?.tier === "pro") {
    await announceUpgrade(synced.user, synced.patch.plan ?? null, synced.patch.currentPeriodEnd ?? null);
  }
}

async function handleInvoiceFailed(invoice: Stripe.Invoice, eventAt: number) {
  const subscriptionId = subscriptionOfInvoice(invoice);
  const customerId = idOf(invoice.customer);
  const user = await userFor(customerId);
  if (!user) return;

  if (subscriptionId) await syncSubscriptionId(subscriptionId, eventAt);

  const outcome = await applySubscription(
    String(user._id),
    {
      latestInvoiceStatus: invoice.status ?? "open",
      lastPaymentFailedAt: new Date(),
    },
    { eventAt, reason: "invoice payment failed" },
  );

  const until = outcome?.user?.subscription?.currentPeriodEnd ?? null;
  await sendPaymentFailed(user, until ? new Date(until) : null);
}

async function handleRefund(charge: Stripe.Charge, eventAt: number, reason: string) {
  const intentId = idOf(charge.payment_intent);
  if (!intentId) return;

  const intent = await stripe.paymentIntents.retrieve(intentId).catch(() => null);
  if (intent?.metadata?.plan !== "lifetime") return;

  const user = await userFor(idOf(charge.customer), intent.metadata?.userId);
  if (!user) return;

  await revokeLifetime(String(user._id), { eventAt, reason });
  if (user.tier === "pro") await sendSubscriptionEnded(user);
}

async function handleDispute(dispute: Stripe.Dispute, eventAt: number) {
  const customerId = idOf(
    (dispute as unknown as { customer?: string | { id: string } }).customer,
  );
  const charge = await stripe.charges.retrieve(idOf(dispute.charge)).catch(() => null);
  const user = await userFor(customerId || idOf(charge?.customer));
  if (!user) return;

  const subscriptionId = user.subscription?.subscriptionId;
  if (subscriptionId) {
    await stripe.subscriptions.cancel(subscriptionId).catch(() => null);
  }

  await applySubscription(
    String(user._id),
    { lifetime: false, status: "canceled", plan: null, endedAt: new Date() },
    { eventAt, reason: "chargeback" },
  );
}

async function handleCustomerDeleted(customer: Stripe.Customer, eventAt: number) {
  const user = await findUserByCustomer(customer.id);
  if (!user) return;
  await applySubscription(
    String(user._id),
    {
      customerId: "",
      subscriptionId: "",
      status: "canceled",
      plan: null,
      lifetime: false,
      endedAt: new Date(),
    },
    { eventAt, reason: "customer deleted in stripe" },
  );
}

async function route(event: Stripe.Event) {
  const at = event.created ?? 0;

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      return handleCheckout(event.data.object as Stripe.Checkout.Session, at);

    case "checkout.session.async_payment_failed":
    case "checkout.session.expired":
      return;

    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
    case "customer.subscription.paused":
    case "customer.subscription.resumed":
    case "customer.subscription.trial_will_end":
      return handleSubscriptionEvent(event.data.object as Stripe.Subscription, at);

    case "invoice.paid":
    case "invoice.payment_succeeded":
      return handleInvoicePaid(event.data.object as Stripe.Invoice, at);

    case "invoice.payment_failed":
      return handleInvoiceFailed(event.data.object as Stripe.Invoice, at);

    case "charge.refunded":
      return handleRefund(event.data.object as Stripe.Charge, at, "lifetime refunded");

    case "charge.dispute.created":
      return handleDispute(event.data.object as Stripe.Dispute, at);

    case "customer.deleted":
      return handleCustomerDeleted(event.data.object as Stripe.Customer, at);

    default:
      return;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!hasStripe() || !hasWebhookSecret()) {
    console.error("webhook: STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET are not both set");
    return res.status(500).json({ error: "Billing is not configured" });
  }

  const signature = req.headers["stripe-signature"];
  if (typeof signature !== "string") {
    return res.status(400).json({ error: "Missing stripe-signature" });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      await rawBody(req),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("webhook: signature verification failed:", err);
    return res.status(400).json({ error: "Invalid signature" });
  }

  if (!HANDLED.has(event.type)) {
    return res.status(200).json({ received: true, ignored: event.type });
  }

  try {
    await connectToDB();
  } catch (err) {
    console.error("webhook: database unreachable, asking Stripe to retry:", err);
    return res.status(503).json({ error: "Database unavailable" });
  }

  const claimed = await StripeEvent.findOneAndUpdate(
    { eventId: event.id },
    { $setOnInsert: { eventId: event.id, type: event.type, createdAt: new Date() } },
    { upsert: true, new: false },
  ).catch((err: unknown) => {
    console.error("webhook: could not claim event:", err);
    return undefined;
  });

  if (claimed?.handledAt) {
    return res.status(200).json({ received: true, duplicate: true });
  }

  try {
    await route(event);
    await StripeEvent.updateOne(
      { eventId: event.id },
      { $set: { handledAt: new Date(), error: "" } },
    ).catch(() => null);
    return res.status(200).json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown failure";
    console.error(`webhook: ${event.type} (${event.id}) failed:`, err);
    await StripeEvent.updateOne({ eventId: event.id }, { $set: { error: message } }).catch(
      () => null,
    );
    return res.status(500).json({ error: "Handler failed" });
  }
}
