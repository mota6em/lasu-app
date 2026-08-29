export type Tier = "free" | "pro";

export const BURST_WINDOW = "1m";
export const BURST_LIMIT = 10;

export const QUOTA_WINDOW = "1d";

export const DAILY_QUOTA = {
  guest: 5,
  free: 20,
  pro: 2000,
} as const;

export type Audience = keyof typeof DAILY_QUOTA;

export function quotaFor(audience: Audience) {
  return DAILY_QUOTA[audience];
}

export function audienceFor(signedIn: boolean, tier: Tier | undefined): Audience {
  if (!signedIn) return "guest";
  return tier === "pro" ? "pro" : "free";
}

export function quotaIdentifier(audience: Audience, id: string) {
  return audience === "guest" ? `quota:guest:${id}` : `quota:user:${id}`;
}
