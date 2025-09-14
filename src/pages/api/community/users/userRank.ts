import { connectToDB } from "@/lib/mongodb";
import CommunityUser from "@/models/communityUser";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDB();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ message: "Missing userId" });
    }

    const user = await CommunityUser.findOne({ userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const dailyRank =
      (await CommunityUser.countDocuments({
        dailyTranslations: { $gt: user.dailyTranslations },
      })) + 1;

    const monthlyRank =
      (await CommunityUser.countDocuments({
        monthlyTranslations: { $gt: user.monthlyTranslations },
      })) + 1;

    const allTimeRank =
      (await CommunityUser.countDocuments({
        allTimeTranslations: { $gt: user.allTimeTranslations },
      })) + 1;

    return res.status(200).json({
      daily: dailyRank,
      monthly: monthlyRank,
      allTime: allTimeRank,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
