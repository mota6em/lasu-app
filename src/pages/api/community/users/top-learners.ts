import { connectToDB } from "@/lib/mongodb";
import CommunityUser from "@/models/communityUser";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDB();

  const { period } = req.query;
  let sortField = "allTimeTranslations";

  if (period === "daily") sortField = "dailyTranslations";
  if (period === "monthly") sortField = "monthlyTranslations";

  const topUsers = await CommunityUser.find({})
    .sort({ [sortField]: -1 })
    .limit(10);

  res.json(topUsers);
}
