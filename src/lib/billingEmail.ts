import { transporter } from "@/lib/email";
import { appUrl } from "@/lib/stripe";
import { formatPrice, type PlanId } from "@/lib/plans";

const APP = appUrl();

const C = {
  page: "#f2f0ec",
  card: "#ffffff",
  soft: "#f8f7f4",
  ink: "#15171e",
  muted: "#676972",
  line: "#e5e3df",
  brand: "#ee9b1a",
  brandDeep: "#b45d1b",
  brandTint: "#fcf7e8",
  iris: "#6953e3",
  danger: "#c0392b",
  dangerTint: "#fdefed",
};

const PLAN_LABEL: Record<PlanId, string> = {
  monthly: "Pro · Monthly",
  yearly: "Pro · Yearly",
  lifetime: "Pro · Lifetime",
};

function shell(title: string, accent: string, body: string) {
  return `<!doctype html>
<html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>${title}</title></head>
<body style="margin:0;padding:0;background:${C.page};font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};padding:32px 12px;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${C.card};border:1px solid ${C.line};border-radius:16px;overflow:hidden;">
      <tr><td style="height:4px;background:${accent};"></td></tr>
      <tr><td style="padding:28px 28px 8px 28px;">
        <div style="font-size:19px;font-weight:700;color:${C.ink};letter-spacing:-0.2px;">LaSu</div>
      </td></tr>
      <tr><td style="padding:0 28px 28px 28px;">${body}</td></tr>
      <tr><td style="padding:0 28px 26px 28px;">
        <div style="border-top:1px solid ${C.line};padding-top:16px;font-size:12px;line-height:19px;color:${C.muted};">
          Questions about your subscription? Just reply to this email.<br />
          <a href="${APP}/dashboard/upgrade" style="color:${C.muted};text-decoration:underline;">Manage your plan</a>
          &nbsp;·&nbsp;
          <a href="${APP}" style="color:${C.muted};text-decoration:underline;">lasu.online</a>
        </div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function heading(text: string) {
  return `<h1 style="margin:8px 0 0 0;font-size:23px;line-height:30px;font-weight:700;color:${C.ink};letter-spacing:-0.3px;">${text}</h1>`;
}

function paragraph(text: string) {
  return `<p style="margin:12px 0 0 0;font-size:15px;line-height:24px;color:${C.ink};">${text}</p>`;
}

function button(href: string, label: string, color = C.brand) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0 0 0;"><tr><td style="background:${color};border-radius:10px;">
    <a href="${href}" style="display:inline-block;padding:12px 22px;font-size:15px;font-weight:600;color:#1c1206;text-decoration:none;">${label}</a>
  </td></tr></table>`;
}

function panel(rows: [string, string][], tint = C.soft) {
  const cells = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 0;font-size:13px;color:${C.muted};">${label}</td>
         <td style="padding:6px 0;font-size:13px;font-weight:600;color:${C.ink};text-align:right;">${value}</td></tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 0 0;background:${tint};border:1px solid ${C.line};border-radius:12px;padding:14px 16px;">${cells}</table>`;
}

function firstName(name?: string) {
  return (name || "").trim().split(/\s+/)[0] || "there";
}

function longDate(value: Date | null | undefined) {
  if (!value) return "—";
  return value.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

async function send(to: string, subject: string, html: string, text: string) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
  try {
    await transporter.sendMail({
      from: `"LaSu" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    });
  } catch (err) {
    console.error(`billingEmail: could not send "${subject}" to ${to}:`, err);
  }
}

type Recipient = { email: string; name?: string };

export async function sendProWelcome(
  user: Recipient,
  plan: PlanId,
  price: { amount: number; currency: string } | null,
  renewsAt: Date | null,
) {
  const amount = price ? formatPrice(price.amount, price.currency) : "";
  const rows: [string, string][] = [["Plan", PLAN_LABEL[plan]]];
  if (amount) rows.push(["Price", plan === "lifetime" ? `${amount} once` : amount]);
  rows.push([
    plan === "lifetime" ? "Access" : "Renews",
    plan === "lifetime" ? "Yours for life" : longDate(renewsAt),
  ]);

  const html = shell(
    "Welcome to LaSu Pro",
    C.brand,
    heading("You're Pro. Translate without counting.") +
      paragraph(`Hi ${firstName(user.name)}, your upgrade went through — unlimited translations are live right now, on the web app and in the browser extension.`) +
      panel(rows, C.brandTint) +
      paragraph("Nothing else to set up. Your extension picks this up automatically the next time you translate.") +
      button(`${APP}/dashboard`, "Start translating"),
  );

  const text = [
    "You're Pro. Translate without counting.",
    "",
    `Hi ${firstName(user.name)}, your upgrade went through — unlimited translations are live right now, on the web app and in the browser extension.`,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    `Start translating: ${APP}/dashboard`,
  ].join("\n");

  await send(user.email, "Welcome to LaSu Pro 🎉", html, text);
}

export async function sendPaymentFailed(user: Recipient, retryUntil: Date | null) {
  const html = shell(
    "Payment problem",
    C.danger,
    heading("We couldn't take this month's payment") +
      paragraph(`Hi ${firstName(user.name)}, your card was declined, so LaSu Pro is at risk. Updating your payment details takes about a minute.`) +
      panel([["Status", "Payment failed"], ["Pro access until", longDate(retryUntil)]], C.dangerTint) +
      paragraph("Stripe will retry a few times on its own. Your history, streak and saved words stay exactly where they are either way.") +
      button(`${APP}/dashboard/upgrade`, "Update payment method"),
  );

  const text = [
    "We couldn't take this month's payment",
    "",
    `Hi ${firstName(user.name)}, your card was declined, so LaSu Pro is at risk.`,
    `Pro access until: ${longDate(retryUntil)}`,
    "",
    `Update your payment method: ${APP}/dashboard/upgrade`,
  ].join("\n");

  await send(user.email, "Action needed: your LaSu Pro payment failed", html, text);
}

export async function sendCancelScheduled(user: Recipient, endsAt: Date | null) {
  const html = shell(
    "Subscription ending",
    C.iris,
    heading("Your Pro plan is set to end") +
      paragraph(`Hi ${firstName(user.name)}, we've cancelled the renewal. You keep everything Pro until the date below — no need to rush.`) +
      panel([["Pro until", longDate(endsAt)], ["After that", "Back to the free daily limit"]]) +
      paragraph("Changed your mind? Restarting takes one click, and nothing in your account is lost.") +
      button(`${APP}/dashboard/upgrade`, "Keep Pro"),
  );

  const text = [
    "Your Pro plan is set to end",
    "",
    `Hi ${firstName(user.name)}, we've cancelled the renewal. You keep Pro until ${longDate(endsAt)}.`,
    "",
    `Keep Pro: ${APP}/dashboard/upgrade`,
  ].join("\n");

  await send(user.email, "Your LaSu Pro plan is ending", html, text);
}

export async function sendSubscriptionEnded(user: Recipient) {
  const html = shell(
    "Back to free",
    C.iris,
    heading("Your Pro plan has ended") +
      paragraph(`Hi ${firstName(user.name)}, you're back on the free plan. Your history, streak, saved words and community profile are all untouched — only the daily translation limit is back.`) +
      paragraph("If LaSu was doing its job, Pro is waiting whenever you want it.") +
      button(`${APP}/dashboard/upgrade`, "See plans"),
  );

  const text = [
    "Your Pro plan has ended",
    "",
    `Hi ${firstName(user.name)}, you're back on the free plan. Nothing in your account was lost.`,
    "",
    `See plans: ${APP}/dashboard/upgrade`,
  ].join("\n");

  await send(user.email, "Your LaSu Pro plan has ended", html, text);
}
