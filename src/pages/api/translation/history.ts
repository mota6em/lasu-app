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
  const { wantStats, page, limit, filter = "all" } = req.query;
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
    const mostUsedLang = langAgg[0] || null;
    const topLangs: [string, number][] = langAgg.map((x: any) => [
      x._id,
      x.count,
    ]);

    const dailyAgg = await Translation.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dailySeries = dailyAgg.map((d: any) => ({
      date: d._id,
      count: d.count,
    }));

    return res.status(200).json({
      totalTranslations,
      thisWeekCount,
      langCount,
      mostUsedLang,
      topLangs,
      dailySeries,
    });
  }

  const query: any = { userId };
  if (filter !== "all") query.translationFilter = filter;

  let cursor = Translation.find(query).sort({ createdAt: -1 });

  // only apply pagination if limit is provided
  if (limit) {
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = pageNum * limitNum;
    cursor = cursor.skip(skip).limit(limitNum);
  }

  const history = await cursor.lean();
  res.status(200).json(history);
}
