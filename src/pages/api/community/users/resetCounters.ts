import { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "@/lib/mongodb";
import CommunityUser from "@/models/communityUser";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDB();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // AUTH CHECK
  const authHeader = req.headers.authorization;
  if (
    !authHeader ||
    authHeader !== `Bearer ${process.env.RESET_COUNTERS_CRON_SECRET}`
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const today = new Date();

    await CommunityUser.updateMany({}, { dailyTranslations: 0 });

    if (today.getDate() === 1) {
      await CommunityUser.updateMany({}, { monthlyTranslations: 0 });
    }

    return res.status(200).json({ message: "Counters reset successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
