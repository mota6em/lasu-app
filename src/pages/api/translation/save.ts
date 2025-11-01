import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { connectToDB } from "@/lib/mongodb";
import Translation from "@/models/translation";

const MAX_TRANSLATIONS = 250;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id)
    return res.status(401).json({ error: "Unauthorized" });

  const { sourceText, result, translationType } = req.body;
  await connectToDB();
  const count = await Translation.countDocuments({ userId: session.user.id });

  if (count >= MAX_TRANSLATIONS) {
    const oldest = await Translation.findOne({ userId: session.user.id })
      .sort({ createdAt: 1 })
      .limit(1);

    if (oldest) {
      await Translation.deleteOne({ _id: oldest._id });
      console.log(`Removed oldest translation: ${oldest._id}`);
    }
  }

  await Translation.create({
    userId: session.user.id,
    sourceText,
    result,
    translationType,
    createdAt: new Date(),
  });

  return res.status(200).json({ message: "Translation saved." });
}
