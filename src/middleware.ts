import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "./lib/rateLimit";

const allowedOrigins = [
  "https://lasu.app",
  "https://www.lasu.app",
  "http://localhost:3000",
];

const SEC_KEY = process.env.LASU_API_SEC_KEY!;

export async function middleware(req: NextRequest) {
  const origin = req.headers.get("origin");
  const method = req.method;
  const path = req.nextUrl.pathname;

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
  // 2) Requests WITH Origin
  // -----------------------------------------------------
  if (origin) {
    if (allowedOrigins.includes(origin)) {
      return NextResponse.next();
    }

    const apiKey = req.headers.get("lasu-api-sec-key");
    if (apiKey !== SEC_KEY) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    return NextResponse.next();
  }

  // -----------------------------------------------------
  // 3) origin === null (extension / cron-job)
  // -----------------------------------------------------
  const apiKey = req.headers.get("lasu-api-sec-key");

  // a) cron-job.org or backend scripts → skip rate limit
  if (apiKey && apiKey === SEC_KEY) {
    return NextResponse.next();
  }

  // b) extension users → rate limit
  const deviceId =
    req.headers.get("x-device-id") ||
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    "unknown";

  // 5 per minute
  const minute = await rateLimit(deviceId, 5, "1m");
  if (!minute.ok) {
    return NextResponse.json(
      { error: "Too many requests (minute limit)" },
      { status: 429 }
    );
  }

  // 100 per day
  const daily = await rateLimit(deviceId, 100, "1d");
  if (!daily.ok) {
    return NextResponse.json({ error: "Daily limit reached" }, { status: 429 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
