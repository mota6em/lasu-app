const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL!;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!;

export async function rateLimit(
  identifier: string,
  limit: number,
  window: string // "1m", "1d"
) {
  const key = `rl:${identifier}:${window}`;

  const response = await fetch(`${UPSTASH_REDIS_REST_URL}/incr/${key}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
    },
  });

  const body = await response.json();
  const count = body.result;

  if (count === 1) {
    const seconds = convertWindow(window);
    await fetch(`${UPSTASH_REDIS_REST_URL}/expire/${key}/${seconds}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
      },
    });
  }

  return { ok: count <= limit, count };
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
