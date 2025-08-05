import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { connectToDB } from "@/lib/mongodb";
import Translation from "@/models/translation";

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
  await Translation.create({
    userId: session?.user?.id,
    sourceText,
    result,
    translationType,
    createdAt: new Date(),
  });
  return res.status(200).json({ message: "Translation saved." });
}
