import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "@/lib/mongodb";
import { CommunityStatsCache } from "@/models/communityStatsCache";
import { recalcAndStoreCommunityStats } from "@/lib/recalculateCommunityStats";

// const TEN_MINUTES = 10 * 60 * 1000;
const TEN_MINUTES = 1 * 1000; //this is temp for testing

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDB();

  const cacheDoc: any = await CommunityStatsCache.findOne().lean();

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
  if (age > TEN_MINUTES) {
    recalcAndStoreCommunityStats().catch((err) =>
      console.error("recalc failed", err)
    );
  }

  return res.status(200).json({
    ok: true,
    cached: true,
    data: cacheDoc,
  });
}
