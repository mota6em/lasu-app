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

    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const allUsers = await CommunityUser.find().sort({ xp: -1 });
    const dailyUsers = await CommunityUser.find({
      lastActive: { $gte: startOfDay },
    }).sort({ xp: -1 });
    const monthlyUsers = await CommunityUser.find({
      lastActive: { $gte: startOfMonth },
    }).sort({ xp: -1 });

    const getRank = (arr: typeof allUsers) => {
      const idx = arr.findIndex((u) => u.userId.toString() === userId);
      return idx === -1 ? null : idx + 1;
    };

    return res.status(200).json({
      daily: getRank(dailyUsers),
      monthly: getRank(monthlyUsers),
      allTime: getRank(allUsers),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
