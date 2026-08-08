import { connectToDB } from "@/lib/mongodb";
import LiveTranslation from "@/models/liveTranslations";
import { CommunityStatsCache } from "@/models/communityStatsCache";
import CommunityUser from "@/models/communityUser";
import type { PipelineStage } from "mongoose";

// helper: get date ranges
function getDayStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
function getMonthStart() {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

// helper to resolve learner info
async function enrichLearners(aggregated: any) {
  const userIds = aggregated.map((l: any) => l._id);
  const users = await CommunityUser.find({ userId: { $in: userIds } });
  const usersById = new Map(users.map((u) => [u.userId, u]));

  const results = [];
  for (const l of aggregated) {
    const user = usersById.get(l._id);
    if (!user) continue;

    results.push({
      id: user.userId,
      name: user.showName ? user.name || "Anonymous" : "Anonymous",
      image: user.showPicture
        ? user.image || "/imgs/userIcon.jpg"
        : "/imgs/userIcon.jpg",
      xp: user.xp || 0,
      showName: user.showName,
      showPicture: user.showPicture,
      totalTranslations: l.count,
    });
  }

  return results;
}

// this runs heavy aggregations ONE TIME and stores the result in db
export async function recalcAndStoreCommunityStats() {
  await connectToDB();

  const now = new Date();
  const dayStart = getDayStart();
  const monthStart = getMonthStart();

  const wordsPipeline = (match: Record<string, any>): PipelineStage[] => [
    ...(Object.keys(match).length ? [{ $match: match }] : []),
    { $group: { _id: "$sourceText", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ];
  const langsPipeline = (match: Record<string, any>): PipelineStage[] => [
    ...(Object.keys(match).length ? [{ $match: match }] : []),
    { $project: { langs: { $objectToArray: "$result.translations" } } },
    { $unwind: "$langs" },
    { $group: { _id: "$langs.k", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ];
  const learnersPipeline = (match: Record<string, any>): PipelineStage[] => [
    ...(Object.keys(match).length ? [{ $match: match }] : []),
    { $group: { _id: "$userId", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ];

  const [
    dailyWords,
    dailyLangs,
    dailyLearnersRaw,
    monthlyWords,
    monthlyLangs,
    monthlyLearnersRaw,
    allTimeWords,
    allTimeLangs,
    allTimeLearnersRaw,
  ] = await Promise.all([
    LiveTranslation.aggregate(wordsPipeline({ createdAt: { $gte: dayStart } })),
    LiveTranslation.aggregate(langsPipeline({ createdAt: { $gte: dayStart } })),
    LiveTranslation.aggregate(learnersPipeline({ createdAt: { $gte: dayStart } })),
    LiveTranslation.aggregate(wordsPipeline({ createdAt: { $gte: monthStart } })),
    LiveTranslation.aggregate(langsPipeline({ createdAt: { $gte: monthStart } })),
    LiveTranslation.aggregate(learnersPipeline({ createdAt: { $gte: monthStart } })),
    LiveTranslation.aggregate(wordsPipeline({})),
    LiveTranslation.aggregate(langsPipeline({})),
    LiveTranslation.aggregate(learnersPipeline({})),
  ]);

  const [dailyLearners, monthlyLearners, allTimeLearners] = await Promise.all([
    enrichLearners(dailyLearnersRaw),
    enrichLearners(monthlyLearnersRaw),
    enrichLearners(allTimeLearnersRaw),
  ]);

  // ----- SAVE INTO CACHE -----
  await CommunityStatsCache.findOneAndUpdate(
    {},
    {
      lastUpdated: now,
      daily: {
        words: dailyWords,
        languages: dailyLangs,
        learners: dailyLearners,
      },
      monthly: {
        words: monthlyWords,
        languages: monthlyLangs,
        learners: monthlyLearners,
      },
      allTime: {
        words: allTimeWords,
        languages: allTimeLangs,
        learners: allTimeLearners,
      },
    },
    { upsert: true, new: true }
  );
}
