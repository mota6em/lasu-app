import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectToDB } from "@/lib/mongodb";
import Translation from "@/models/translation";
import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id)
    return res.status(401).json({ message: "Unauthorized" });

  await connectToDB();

  const history = await Translation.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .limit(20); //ToDo later: add pagination
  console.log("history", history);
  res.status(200).json(history);
}
