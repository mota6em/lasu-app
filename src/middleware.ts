import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "./lib/rateLimit";

const allowedOrigins = [
  "https://lasu.app",
  "https://www.lasu.app",
  "http://localhost:3000",
];

const EXTENSION_ORIGIN = "chrome-extension://jllhdgojepfdpmlppkccogdobopmiaok";
const SEC_KEY = process.env.LASU_API_SEC_KEY!;

export async function middleware(req: NextRequest) {
  const origin = req.headers.get("origin");
  const method = req.method;

  // -----------------------------------------------------
  // 1) CORS Preflight — ALWAYS ALLOW
  // -----------------------------------------------------
  if (method === "OPTIONS") {
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", origin ?? "*");
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, lasu-api-sec-key, x-device-id"
    );
    return new NextResponse(null, { status: 204, headers });
  }

  // -----------------------------------------------------
  // 2) ORIGIN HANDLING
  // -----------------------------------------------------

  // a) Allowed website → NO rate limits
  if (origin && allowedOrigins.includes(origin)) {
    return NextResponse.next();
  }

  // b) Extension (origin null or chrome-extension://)
  const isExtension =
    origin === null ||
    origin === "null" ||
    origin?.startsWith("chrome-extension://") ||
    origin === EXTENSION_ORIGIN;

  // c) Unknown website → must include secret key
  if (!isExtension) {
    const apiKey = req.headers.get("lasu-api-sec-key");
    if (apiKey !== SEC_KEY) {
      return NextResponse.json(
        { error: "Forbidden: untrusted origin", origin },
        { status: 403 }
      );
    }
    return NextResponse.next();
  }

  // -----------------------------------------------------
  // 3) EXTENSION / CRON-JOB FLOW
  // -----------------------------------------------------
  const apiKey = req.headers.get("lasu-api-sec-key");

  // a) cron-job with API key → skip limits
  if (apiKey === SEC_KEY) {
    return NextResponse.next();
  }

  // b) extension → apply rate limits
  const deviceId =
    req.headers.get("x-device-id") ||
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    "unknown";

  // 25 per minute
  const minute = await rateLimit(deviceId, 25, "1m");
  if (!minute.ok) {
    return NextResponse.json(
      { error: "Too many requests (minute limit)" },
      { status: 429 }
    );
  }

  // 250 per day
  const daily = await rateLimit(deviceId, 250, "1d");
  if (!daily.ok) {
    return NextResponse.json({ error: "Daily limit reached" }, { status: 429 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
