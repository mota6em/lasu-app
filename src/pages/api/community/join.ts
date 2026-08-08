import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]";
import { connectToDB } from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import CommunityUser from "@/models/communityUser";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id)
    return res.status(401).json({ error: "Not logged in" });

  const { showName, showPicture, shareTranslations } = req.body;

  await connectToDB();

  let user = await CommunityUser.findOne({ userId: session.user.id });
  if (user) return res.status(200).json({ message: "Already joined", user });

  user = await CommunityUser.create({
    userId: session.user.id,
    name: session.user.name,
    image: session.user.image,
    showName,
    showPicture,
    shareTranslations,
  });

  return res.status(201).json({ message: "Welcome to the community!", user });
}
