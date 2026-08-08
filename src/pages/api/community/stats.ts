import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "@/lib/mongodb";
import { CommunityStatsCache } from "@/models/communityStatsCache";
import { recalcAndStoreCommunityStats } from "@/lib/recalculateCommunityStats";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  await connectToDB();

  let cacheDoc: any = await CommunityStatsCache.findOne().lean();

  if (!cacheDoc) {
    await recalcAndStoreCommunityStats();
    cacheDoc = await CommunityStatsCache.findOne().lean();
    return res.status(200).json({ ok: true, cached: false, data: cacheDoc });
  }

  const now = new Date();
  const last = new Date(cacheDoc.lastUpdated);
  const needsUpdate =
    now.getHours() !== last.getHours() || now.getDate() !== last.getDate();

  if (needsUpdate) {
    await recalcAndStoreCommunityStats();
    cacheDoc = await CommunityStatsCache.findOne().lean();
  }

  return res.status(200).json({ ok: true, cached: false, data: cacheDoc });
}
