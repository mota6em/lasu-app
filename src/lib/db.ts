import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";
import { effectiveTier } from "./entitlement";
import { isDue, normalizeSchedule, windowStart, type DigestSchedule } from "./summarySchedule";
import type { ISubscription } from "@/models/user";

type DueUser = {
  user: Record<string, unknown> & { _id: ObjectId; email: string };
  translations: Record<string, unknown>[];
  community: { streak?: number; xp?: number; level?: number; rank?: number };
  schedule: DigestSchedule;
  isPro: boolean;
  since: Date;
};

export async function getDueSummaries(at = new Date()): Promise<DueUser[]> {
  const client = await clientPromise;
  const db = client.db("lasu");

  const candidates = await db
    .collection("users")
    .find(
      { emailSummary: { $ne: false } },
      {
        projection: {
          email: 1,
          name: 1,
          image: 1,
          selectedLanguages: 1,
          translationType: 1,
          createdAt: 1,
          tier: 1,
          subscription: 1,
          emailDigest: 1,
        },
      },
    )
    .toArray();

  const due = candidates.flatMap((user) => {
    const isPro =
      effectiveTier(
        user as { tier?: "free" | "pro"; subscription?: ISubscription | null },
        at.getTime(),
      ) === "pro";
    const schedule = normalizeSchedule(user.emailDigest, isPro);
    const lastSentAt = user.emailDigest?.lastSentAt ? new Date(user.emailDigest.lastSentAt) : null;
    if (!isDue(schedule, lastSentAt, at)) return [];
    return [{ user, schedule, isPro, since: windowStart(schedule, lastSentAt, at) }];
  });

  if (!due.length) return [];

  const ids = due.map((entry) => entry.user._id.toString());
  const earliest = due.reduce(
    (min, entry) => (entry.since < min ? entry.since : min),
    due[0].since,
  );

  const [translations, communityStats] = await Promise.all([
    db
      .collection("translations")
      .find(
        { userId: { $in: ids }, createdAt: { $gte: earliest } },
        { projection: { userId: 1, sourceText: 1, translationType: 1, result: 1, createdAt: 1 } },
      )
      .toArray(),
    db
      .collection("communityusers")
      .find(
        { userId: { $in: ids } },
        { projection: { userId: 1, streak: 1, xp: 1, level: 1, rank: 1 } },
      )
      .toArray(),
  ]);

  const byUser = new Map<string, typeof translations>();
  for (const item of translations) {
    const list = byUser.get(item.userId);
    if (list) list.push(item);
    else byUser.set(item.userId, [item]);
  }

  const statsByUser = new Map(communityStats.map((entry) => [entry.userId, entry]));

  return due.map((entry) => {
    const id = entry.user._id.toString();
    const stats = statsByUser.get(id);
    return {
      ...entry,
      user: entry.user as DueUser["user"],
      translations: (byUser.get(id) || []).filter(
        (item) => new Date(item.createdAt) >= entry.since,
      ),
      community: {
        streak: stats?.streak,
        xp: stats?.xp,
        level: stats?.level,
        rank: stats?.rank,
      },
    };
  });
}

export async function markSummariesSent(userIds: string[], at: Date) {
  if (!userIds.length) return;
  const client = await clientPromise;
  await client
    .db("lasu")
    .collection("users")
    .updateMany(
      { _id: { $in: userIds.map((id) => new ObjectId(id)) } },
      { $set: { "emailDigest.lastSentAt": at } },
    );
}
