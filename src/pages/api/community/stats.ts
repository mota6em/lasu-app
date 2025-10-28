import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "@/lib/mongodb";
import { CommunityStatsCache } from "@/models/communityStatsCache";
import { recalcAndStoreCommunityStats } from "@/lib/recalculateCommunityStats";

const ONE_HOUR = 60 * 60 * 1000; // 1 hour

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDB();

  let cacheDoc: any = await CommunityStatsCache.findOne().lean();

  if (!cacheDoc) {
    await recalcAndStoreCommunityStats();
    const fresh = await CommunityStatsCache.findOne().lean();
    return res.status(200).json({
      ok: true,
      cached: false,
      data: fresh,
    });
  }

  const age = Date.now() - new Date(cacheDoc.lastUpdated).getTime();
  if (age > ONE_HOUR) {
    await recalcAndStoreCommunityStats();
    cacheDoc = await CommunityStatsCache.findOne().lean();
  }

  return res.status(200).json({
    ok: true,
    cached: false,
    data: cacheDoc,
  });
}
