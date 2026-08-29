const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const TIMEOUT_MS = 2000;

export type RateLimitResult = {
  ok: boolean;
  count: number;
  limit: number;
  remaining: number;
  degraded: boolean;
  resetAt?: number;
};

export type QuotaSnapshot = {
  count: number;
  degraded: boolean;
  resetAt?: number;
};

const allow = (limit: number, reason: string): RateLimitResult => {
  if (reason) console.warn(`rateLimit degraded: ${reason}`);
  return { ok: true, count: 0, limit, remaining: limit, degraded: true };
};

function configured() {
  return Boolean(UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN);
}

async function upstash(path: string, body?: unknown) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(`${UPSTASH_REDIS_REST_URL}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

async function pipeline(commands: (string | number)[][]) {
  const response = await upstash("/pipeline", commands);
  if (!response.ok) throw new Error(`pipeline responded ${response.status}`);
  const body = await response.json();
  if (!Array.isArray(body)) throw new Error("pipeline returned no array");
  return body.map((entry) => (entry as { result?: unknown })?.result);
}

function toNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function resetFromTtl(ttl: number | null) {
  if (ttl === null || ttl < 0) return undefined;
  return Date.now() + ttl * 1000;
}

export function keyFor(identifier: string, window: string) {
  return `rl:${identifier}:${window}`;
}

export async function rateLimit(
  identifier: string,
  limit: number,
  window: string,
): Promise<RateLimitResult> {
  if (!configured()) {
    return allow(limit, "UPSTASH_REDIS_REST_URL or _TOKEN is not set");
  }

  const key = keyFor(identifier, window);
  const seconds = convertWindow(window);

  try {
    const [rawCount, rawTtl] = await pipeline([
      ["INCR", key],
      ["TTL", key],
    ]);

    const count = toNumber(rawCount);
    if (count === null) return allow(limit, "incr returned no usable count");

    let ttl = toNumber(rawTtl);

    if (ttl === null || ttl < 0) {
      await pipeline([["EXPIRE", key, seconds]]).catch(() => null);
      ttl = seconds;
    }

    const remaining = Math.max(0, limit - count);
    return {
      ok: count <= limit,
      count,
      limit,
      remaining,
      degraded: false,
      resetAt: resetFromTtl(ttl),
    };
  } catch (err) {
    return allow(limit, err instanceof Error ? err.message : "redis unreachable");
  }
}

export async function peekRateLimit(
  identifier: string,
  window: string,
): Promise<QuotaSnapshot> {
  if (!configured()) return { count: 0, degraded: true };

  const key = keyFor(identifier, window);

  try {
    const [rawCount, rawTtl] = await pipeline([
      ["GET", key],
      ["TTL", key],
    ]);

    return {
      count: toNumber(rawCount) ?? 0,
      degraded: false,
      resetAt: resetFromTtl(toNumber(rawTtl)),
    };
  } catch {
    return { count: 0, degraded: true };
  }
}

function convertWindow(window: string) {
  if (window.endsWith("m")) {
    return parseInt(window) * 60;
  }
  if (window.endsWith("h")) {
    return parseInt(window) * 3600;
  }
  if (window.endsWith("d")) {
    return parseInt(window) * 86400;
  }
  return 60;
}
