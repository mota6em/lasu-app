import clientPromise from "./mongodb";

export async function getAllUsersWithTranslations(period: "week" | "day") {
  const client = await clientPromise;
  const db = client.db("lasu");

  const now = new Date();
  let startDate: Date;
  if (period === "week") {
    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (period === "day") {
    startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  } else {
    startDate = new Date(0);
  }

  const users = await db
    .collection("users")
    .find({ emailSummary: { $ne: false } })
    .toArray();
  const translations = await db
    .collection("translations")
    .find({ createdAt: { $gte: startDate } })
    .toArray();

  return users.map((user) => ({
    user,
    translations: translations.filter((t) => t.userId === user._id.toString()),
  }));
}
