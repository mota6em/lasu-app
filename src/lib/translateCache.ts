import { createHash } from "crypto";

const TTL_MS = 60 * 60 * 1000;
const MAX_ENTRIES = 500;

type Entry = { value: unknown; expiresAt: number };

const store = new Map<string, Entry>();

export function translateCacheKey(parts: (string | string[])[]): string {
  const flat = parts.map((p) => (Array.isArray(p) ? p.join(",") : p)).join(" ");
  return createHash("sha256").update(flat).digest("hex");
}

export function readTranslateCache<T>(key: string): T | null {
  const hit = store.get(key);
  if (!hit) return null;

  if (Date.now() > hit.expiresAt) {
    store.delete(key);
    return null;
  }

  // Refresh recency so the eviction below drops genuinely cold entries.
  store.delete(key);
  store.set(key, hit);
  return hit.value as T;
}

export function writeTranslateCache(key: string, value: unknown) {
  store.delete(key);
  store.set(key, { value, expiresAt: Date.now() + TTL_MS });

  while (store.size > MAX_ENTRIES) {
    const oldest = store.keys().next();
    if (oldest.done) break;
    store.delete(oldest.value);
  }
}
