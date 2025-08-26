import clientPromise from "./mongodb";

export async function getAllUsersWithTranslations() {
  const client = await clientPromise;
  const db = client.db("lasu"); 

  const users = await db.collection("users").find({}).toArray();
  const translations = await db.collection("translations").find({}).toArray();

  return users.map((user) => ({
    user,
    translations: translations.filter((t) => t.userId === user._id.toString()),
  }));
}
