import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { rateLimit } from "./lib/rateLimit";
import { routing } from "./i18n/routing";

const allowedOrigins = [
  "https://lasu.online",
  "https://www.lasu.online",
  "http://localhost:3000",
];

const EXT_ID = "chrome-extension://jllhdgojepfdpmlppkccogdobopmiaok";
const SEC_KEY = process.env.LASU_API_SEC_KEY!;

const intlMiddleware = createIntlMiddleware(routing);

async function handleApi(req: NextRequest) {
  const origin = req.headers.get("origin");
  const method = req.method;
  const path = req.nextUrl.pathname;

  // Only translate + save are rate-limited
  const isLimitedRoute =
    path.startsWith("/api/translate") ||
    path.startsWith("/api/translation/save");

  // OPTIONS always allowed
  if (method === "OPTIONS") {
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", origin ?? "*");
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, lasu-api-sec-key, x-device-id",
    );
    return new NextResponse(null, { status: 204, headers });
  }

  if (origin && allowedOrigins.includes(origin)) {
    return NextResponse.next();
  }

  const isExtension =
    origin === null ||
    origin === "null" ||
    origin === EXT_ID ||
    origin?.startsWith("chrome-extension://");

  // ---------------------------
  // Unknown domain → require key
  // ---------------------------
  if (!isExtension) {
    const apiKey = req.headers.get("lasu-api-sec-key");
    if (apiKey !== SEC_KEY) {
      return NextResponse.json(
        { error: "Forbidden: untrusted origin", origin },
        { status: 403 },
      );
    }
    return NextResponse.next();
  }

  // ---------------------------
  // Extension but NOT a limited route → full access
  // ---------------------------
  if (!isLimitedRoute) {
    return NextResponse.next();
  }

  // ---------------------------
  // cron-job.org with API key → skip limits
  // ---------------------------
  const apiKey = req.headers.get("lasu-api-sec-key");
  if (apiKey === SEC_KEY) {
    return NextResponse.next();
  }

  // ---------------------------
  // Extension rate limit ONLY translate + save
  // ---------------------------
  const deviceId =
    req.headers.get("x-device-id") ||
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    "unknown";

  // 25 per minute
  const minute = await rateLimit(deviceId, 25, "1m");
  if (!minute.ok) {
    return NextResponse.json(
      { error: "Too many requests (minute limit)" },
      { status: 429 },
    );
  }

  // 250 per day
  const daily = await rateLimit(deviceId, 250, "1d");
  if (!daily.ok) {
    return NextResponse.json({ error: "Daily limit reached" }, { status: 429 });
  }

  return NextResponse.next();
}

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api")) {
    try {
      return await handleApi(req);
    } catch (err) {
      console.error("api middleware failed, passing through:", err);
      return NextResponse.next();
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
