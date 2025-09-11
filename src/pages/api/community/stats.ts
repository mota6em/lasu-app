import { connectToDB } from "@/lib/mongodb";
import LiveTranslation from "@/models/liveTranslations";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDB();

  try {
    const now = new Date();

    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const aggregateWords = async (matchFilter: Record<string, unknown>) => {
      const words = await LiveTranslation.aggregate([
        { $match: matchFilter },
        { $group: { _id: "$sourceText", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]);
      return words;
    };

    const aggregateLangs = async (matchFilter: Record<string, unknown>) => {
      const langs = await LiveTranslation.aggregate([
        { $match: matchFilter },
        {
          $project: {
            langs: { $objectToArray: "$result.translations" },
          },
        },
        { $unwind: "$langs" },
        { $group: { _id: "$langs.k", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]);
      return langs;
    };

    const dailyWords = await aggregateWords({
      createdAt: { $gte: startOfDay },
    });
    const dailyLangs = await aggregateLangs({
      createdAt: { $gte: startOfDay },
    });

    const monthlyWords = await aggregateWords({
      createdAt: { $gte: startOfMonth },
    });
    const monthlyLangs = await aggregateLangs({
      createdAt: { $gte: startOfMonth },
    });

    const allTimeWords = await aggregateWords({});
    const allTimeLangs = await aggregateLangs({});

    return res.status(200).json({
      daily: { words: dailyWords, languages: dailyLangs },
      monthly: { words: monthlyWords, languages: monthlyLangs },
      allTime: { words: allTimeWords, languages: allTimeLangs },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
