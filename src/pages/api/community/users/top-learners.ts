import { connectToDB } from "@/lib/mongodb";
import CommunityUser from "@/models/communityUser";
import { User } from "@/models/user";
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
    .limit(10)
    .select(
      "userId name showName image showPicture xp dailyTranslations monthlyTranslations allTimeTranslations"
    );

  const userIds = topUsers.map((u) => u.userId);
  const users = await User.find({ _id: { $in: userIds } }).select(
    "name image"
  );
  const usersById = new Map(users.map((u) => [u._id.toString(), u]));

  const enriched = topUsers.map((u) => {
    const liveUser = usersById.get(u.userId);
    return {
      userId: u.userId,
      name: u.showName ? liveUser?.name || u.name || "Anonymous" : "Anonymous",
      image: u.showPicture
        ? liveUser?.image || u.image || "/imgs/userIcon.jpg"
        : "/imgs/userIcon.jpg",
      showName: u.showName,
      showPicture: u.showPicture,
      xp: u.xp || 0,
      dailyTranslations: u.dailyTranslations,
      monthlyTranslations: u.monthlyTranslations,
      allTimeTranslations: u.allTimeTranslations,
    };
  });

  res.json(enriched);
}
