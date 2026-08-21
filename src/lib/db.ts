import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";

export async function getAllUsersWithTranslations(period: "week" | "day") {
  const client = await clientPromise;
  const db = client.db("lasu");

  const now = new Date();
  const startDate =
    period === "week"
      ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      : new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // only pull translations in range, and only the fields the email templates use
  const translations = await db
    .collection("translations")
    .find(
      { createdAt: { $gte: startDate } },
      {
        projection: {
          userId: 1,
          sourceText: 1,
          translationType: 1,
          result: 1,
          createdAt: 1,
        },
      }
    )
    .toArray();

  if (translations.length === 0) return [];

  // group translations by userId in one pass instead of filtering per user
  const translationsByUserId = new Map<string, typeof translations>();
  for (const t of translations) {
    const list = translationsByUserId.get(t.userId);
    if (list) list.push(t);
    else translationsByUserId.set(t.userId, [t]);
  }

  // only fetch users who actually have translations in range, not the whole collection
  const userIds = Array.from(translationsByUserId.keys()).map(
    (id) => new ObjectId(id)
  );

  const communityStats = await db
    .collection("communityusers")
    .find(
      { userId: { $in: Array.from(translationsByUserId.keys()) } },
      { projection: { userId: 1, streak: 1, xp: 1, level: 1, rank: 1 } }
    )
    .toArray();

  const statsByUserId = new Map(communityStats.map((c) => [c.userId, c]));

  const users = await db.collection("users").find(
    { _id: { $in: userIds }, emailSummary: { $ne: false } },
    {
      projection: {
        email: 1,
        name: 1,
        image: 1,
        selectedLanguages: 1,
        translationType: 1,
        createdAt: 1,
      },
    }
  ).toArray();

  return users.map((user) => {
    const id = user._id.toString();
    const stats = statsByUserId.get(id);
    return {
      user,
      translations: translationsByUserId.get(id) || [],
      community: {
        streak: stats?.streak,
        xp: stats?.xp,
        level: stats?.level,
        rank: stats?.rank,
      },
    };
  });
}
