import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import createIntlMiddleware from "next-intl/middleware";
import { rateLimit, type RateLimitResult } from "./lib/rateLimit";
import {
  audienceFor,
  BURST_LIMIT,
  BURST_WINDOW,
  quotaFor,
  quotaIdentifier,
  QUOTA_WINDOW,
  type Audience,
} from "./lib/quota";
import { routing } from "./i18n/routing";

const allowedOrigins = [
  "https://lasu.online",
  "https://www.lasu.online",
  ...(process.env.NODE_ENV === "development"
    ? ["http://localhost:3000", "http://127.0.0.1:3000"]
    : []),
];

const EXT_ID = "chrome-extension://jllhdgojepfdpmlppkccogdobopmiaok";
const SEC_KEY = process.env.LASU_API_SEC_KEY!;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

const IS_DEV = process.env.NODE_ENV === "development";

const intlMiddleware = createIntlMiddleware(routing);

function isAllowedOrigin(origin: string | null) {
  if (!origin) return false;
  if (allowedOrigins.includes(origin) || origin === EXT_ID) return true;
  return IS_DEV && origin.startsWith("chrome-extension://");
}

// Browsers omit Origin on same-origin GETs, so the app's own fetches arrive
// bare. Sec-Fetch-Site is what separates those from a cross-site caller.
function isFirstParty(req: NextRequest) {
  const site = req.headers.get("sec-fetch-site");
  if (site) return site === "same-origin" || site === "same-site" || site === "none";

  const referer = req.headers.get("referer");
  if (!referer) return false;
  try {
    return new URL(referer).host === req.headers.get("host");
  } catch {
    return false;
  }
}

function isTrusted(req: NextRequest, origin: string | null) {
  return isAllowedOrigin(origin) || (!origin && isFirstParty(req));
}

// The one live caller (an external cron-job.org job) sends `lasu-api-sec-key`;
// `x-lasu-api-key` is the name new/internal callers should use going forward.
function hasInternalKey(req: NextRequest) {
  const key =
    req.headers.get("x-lasu-api-key") ?? req.headers.get("lasu-api-sec-key");
  return key === SEC_KEY;
}

function getClientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function quotaHeaders(headers: Headers, limit: number, result: RateLimitResult) {
  headers.set("x-lasu-quota-limit", String(limit));
  headers.set("x-lasu-quota-used", String(Math.min(result.count, limit)));
  headers.set("x-lasu-quota-remaining", String(result.remaining));
  if (result.resetAt) headers.set("x-lasu-quota-reset", String(result.resetAt));
}

function allowWithQuota(limit: number, result: RateLimitResult, audience: Audience) {
  const response = NextResponse.next();
  quotaHeaders(response.headers, limit, result);
  response.headers.set("x-lasu-tier", audience === "pro" ? "pro" : "free");
  return response;
}

function rateLimited(
  status: number,
  error: string,
  result: RateLimitResult,
  extra?: Record<string, unknown>,
) {
  const headers = new Headers();
  if (result.resetAt) {
    headers.set(
      "Retry-After",
      String(Math.max(0, Math.ceil((result.resetAt - Date.now()) / 1000))),
    );
  }
  quotaHeaders(headers, result.limit, result);

  return NextResponse.json(
    {
      error,
      limit: result.limit,
      used: Math.min(result.count, result.limit),
      remaining: result.remaining,
      ...(result.resetAt ? { resetTime: result.resetAt } : {}),
      ...extra,
    },
    { status, headers },
  );
}

async function handleApi(req: NextRequest) {
  const origin = req.headers.get("origin");
  const method = req.method;
  const path = req.nextUrl.pathname;

  if (path.startsWith("/api/webhooks/")) {
    return NextResponse.next();
  }

  // NextAuth's own routes (OAuth redirect + callback, CSRF, session, signout)
  // are driven by top-level browser navigation, not fetch/XHR — browsers send
  // no Origin header on those, and NextAuth already has its own CSRF/state
  // protection. Never apply the origin gate to them.
  if (path.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Only translate + save are rate-limited
  const isLimitedRoute =
    path.startsWith("/api/translate") ||
    path.startsWith("/api/translation/save");

  // ---------------------------
  // CORS preflight — exact-origin match only, never a wildcard
  // ---------------------------
  if (method === "OPTIONS") {
    if (!isAllowedOrigin(origin)) {
      return new NextResponse(null, { status: 403 });
    }
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", origin as string);
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, lasu-api-sec-key, x-lasu-api-key, x-device-id",
    );
    headers.set(
      "Access-Control-Expose-Headers",
      "x-lasu-quota-limit, x-lasu-quota-used, x-lasu-quota-remaining, x-lasu-quota-reset, x-lasu-tier",
    );
    return new NextResponse(null, { status: 204, headers });
  }

  // ---------------------------
  // Origin verification — trusted origin, or a valid internal key
  // ---------------------------
  if (!isTrusted(req, origin)) {
    if (!hasInternalKey(req)) {
      return NextResponse.json(
        { error: "Forbidden: untrusted origin", origin },
        { status: 403 },
      );
    }
    // Internal callers (cron) skip rate limiting entirely.
    return NextResponse.next();
  }

  if (!isLimitedRoute) {
    return NextResponse.next();
  }

  // A trusted origin presenting the internal key also skips limits.
  if (hasInternalKey(req)) {
    return NextResponse.next();
  }

  // ---------------------------
  // Layer 1 — anti-abuse burst (per IP)
  // ---------------------------
  const clientIp = getClientIp(req);
  const burst = await rateLimit(`ip:${clientIp}`, BURST_LIMIT, BURST_WINDOW);
  if (!burst.ok) {
    return rateLimited(429, "Too many requests", burst);
  }

  // Only /api/translate spends LLM budget — /api/translation/save just rides
  // the burst layer above (it already requires its own session).
  if (!path.startsWith("/api/translate")) {
    return NextResponse.next();
  }

  // ---------------------------
  // Layer 2 — freemium quota, tiered by account status
  // ---------------------------
  const token = NEXTAUTH_SECRET
    ? await getToken({ req, secret: NEXTAUTH_SECRET }).catch(() => null)
    : null;

  const signedIn = Boolean(token?.id);
  const audience = audienceFor(signedIn, token?.tier);
  const limit = quotaFor(audience);
  const identity = signedIn ? (token!.id as string) : clientIp;

  const quota = await rateLimit(quotaIdentifier(audience, identity), limit, QUOTA_WINDOW);

  if (quota.ok) {
    return allowWithQuota(limit, quota, audience);
  }

  if (audience === "guest") {
    return rateLimited(401, "login_required", quota);
  }

  if (audience === "pro") {
    return rateLimited(429, "quota_exceeded", quota, { tier: "pro" });
  }

  return rateLimited(402, "upgrade_required", quota, { tier: "free" });
}

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api")) {
    try {
      return await handleApi(req);
    } catch (err) {
      console.error("api middleware failed, failing closed:", err);
      return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/api/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
