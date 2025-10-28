import { connectToDB } from "@/lib/mongodb";
import LiveTranslation from "@/models/liveTranslations";
import { CommunityStatsCache } from "@/models/communityStatsCache";
import CommunityUser from "@/models/communityUser";

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
  const results = [];
  console.log("aggregated -------------", aggregated);

  for (const l of aggregated) {
    const user = await CommunityUser.findOne({ userId: l._id });
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

  console.log("---results", results);
  return results;
}

// this runs heavy aggregations ONE TIME and stores the result in db
export async function recalcAndStoreCommunityStats() {
  await connectToDB();

  const now = new Date();
  const dayStart = getDayStart();
  const monthStart = getMonthStart();

  // TODAY
  const dailyWords = await LiveTranslation.aggregate([
    { $match: { createdAt: { $gte: dayStart } } },
    { $group: { _id: "$sourceText", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  const dailyLangs = await LiveTranslation.aggregate([
    { $match: { createdAt: { $gte: dayStart } } },
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

  const dailyLearnersRaw = await LiveTranslation.aggregate([
    { $match: { createdAt: { $gte: dayStart } } },
    { $group: { _id: "$userId", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);
  const dailyLearners = await enrichLearners(dailyLearnersRaw);

  // MONTH
  const monthlyWords = await LiveTranslation.aggregate([
    { $match: { createdAt: { $gte: monthStart } } },
    { $group: { _id: "$sourceText", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  const monthlyLangs = await LiveTranslation.aggregate([
    { $match: { createdAt: { $gte: monthStart } } },
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

  const monthlyLearnersRaw = await LiveTranslation.aggregate([
    { $match: { createdAt: { $gte: monthStart } } },
    { $group: { _id: "$userId", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);
  const monthlyLearners = await enrichLearners(monthlyLearnersRaw);

  // ALL TIME
  const allTimeWords = await LiveTranslation.aggregate([
    { $group: { _id: "$sourceText", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  const allTimeLangs = await LiveTranslation.aggregate([
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

  const allTimeLearnersRaw = await LiveTranslation.aggregate([
    { $group: { _id: "$userId", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);
  const allTimeLearners = await enrichLearners(allTimeLearnersRaw);

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
