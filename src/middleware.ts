import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import createIntlMiddleware from "next-intl/middleware";
import { rateLimit } from "./lib/rateLimit";
import { routing } from "./i18n/routing";

const allowedOrigins = ["https://lasu.online", "https://www.lasu.online"];

const EXT_ID = "chrome-extension://jllhdgojepfdpmlppkccogdobopmiaok";
const SEC_KEY = process.env.LASU_API_SEC_KEY!;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

const intlMiddleware = createIntlMiddleware(routing);

function isAllowedOrigin(origin: string | null) {
  return !!origin && (allowedOrigins.includes(origin) || origin === EXT_ID);
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

function rateLimited(
  status: number,
  error: string,
  extra?: Record<string, unknown>,
  resetAt?: number,
) {
  const headers = new Headers();
  if (resetAt) {
    headers.set(
      "Retry-After",
      String(Math.max(0, Math.ceil((resetAt - Date.now()) / 1000))),
    );
  }
  return NextResponse.json(
    { error, ...(resetAt ? { resetTime: resetAt } : {}), ...extra },
    { status, headers },
  );
}

async function handleApi(req: NextRequest) {
  const origin = req.headers.get("origin");
  const method = req.method;
  const path = req.nextUrl.pathname;

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
    return new NextResponse(null, { status: 204, headers });
  }

  // ---------------------------
  // Origin verification — trusted origin, or a valid internal key
  // ---------------------------
  if (!isAllowedOrigin(origin)) {
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
  // Layer 1 — anti-abuse burst (10 req/min per IP)
  // ---------------------------
  const clientIp = getClientIp(req);
  const burst = await rateLimit(`ip:${clientIp}`, 10, "1m");
  if (!burst.ok) {
    return rateLimited(429, "Too many requests", undefined, burst.resetAt);
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

  if (!token?.id) {
    const guest = await rateLimit(`quota:guest:${clientIp}`, 5, "1d");
    if (!guest.ok) {
      return rateLimited(401, "login_required", undefined, guest.resetAt);
    }
    return NextResponse.next();
  }

  if (token.tier === "pro") {
    const pro = await rateLimit(`quota:user:${token.id}`, 300, "1d");
    if (!pro.ok) {
      return rateLimited(429, "quota_exceeded", undefined, pro.resetAt);
    }
    return NextResponse.next();
  }

  const free = await rateLimit(`quota:user:${token.id}`, 20, "1d");
  if (!free.ok) {
    return rateLimited(402, "upgrade_required", undefined, free.resetAt);
  }

  return NextResponse.next();
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
