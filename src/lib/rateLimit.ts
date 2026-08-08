const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const TIMEOUT_MS = 2000;

export type RateLimitResult = {
  ok: boolean;
  count: number;
  degraded: boolean;
};

const allow = (reason: string): RateLimitResult => {
  if (reason) console.warn(`rateLimit degraded: ${reason}`);
  return { ok: true, count: 0, degraded: true };
};

async function redis(path: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(`${UPSTASH_REDIS_REST_URL}${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function rateLimit(
  identifier: string,
  limit: number,
  window: string
): Promise<RateLimitResult> {
  if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
    return allow("UPSTASH_REDIS_REST_URL or _TOKEN is not set");
  }

  const key = encodeURIComponent(`rl:${identifier}:${window}`);

  try {
    const response = await redis(`/incr/${key}`);
    if (!response.ok) {
      return allow(`incr responded ${response.status}`);
    }

    const body = await response.json();
    const count = Number(body?.result);
    if (!Number.isFinite(count)) {
      return allow("incr returned no usable count");
    }

    if (count === 1) {
      await redis(`/expire/${key}/${convertWindow(window)}`).catch(() => null);
    }

    return { ok: count <= limit, count, degraded: false };
  } catch (err) {
    return allow(err instanceof Error ? err.message : "redis unreachable");
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
