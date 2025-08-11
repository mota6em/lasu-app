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

  const userId = session.user.id;
  await connectToDB();

  // get language stats for Overview Cards
  const { wantStats, page = "0", limit = "10" } = req.query;
  if (wantStats) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // total translations
    const totalTranslations = await Translation.countDocuments({ userId });

    // last week count
    const thisWeekCount = await Translation.countDocuments({
      userId,
      createdAt: { $gt: oneWeekAgo },
    });

    // language counts + most used
    const langAgg = await Translation.aggregate([
      { $match: { userId } },
      {
        $project: {
          translationsArray: { $objectToArray: "$result.translations" },
        },
      },
      { $unwind: "$translationsArray" },
      { $group: { _id: "$translationsArray.k", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const langCount = Object.fromEntries(
      langAgg.map(({ _id, count }) => [_id, count])
    );
    const mostUsedLang = langAgg[0]?._id || null;

    return res.status(200).json({
      totalTranslations,
      thisWeekCount,
      langCount,
      mostUsedLang,
    });
  }

  // Handle pagination
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = pageNum * limitNum;

  const history = await Translation.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();
  res.status(200).json(history);
}
