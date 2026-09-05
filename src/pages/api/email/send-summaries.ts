import { getDueSummaries, markSummariesSent } from "@/lib/db";
import { sendSummary } from "@/lib/email";
import { nextRun } from "@/lib/summarySchedule";
import Translation from "@/types/translation";
import User from "@/types/user";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (req.headers["cron-key"] !== process.env.CRON_SECRET) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = new Date();
  const dryRun = Boolean(req.body?.dryRun);

  try {
    const due = await getDueSummaries(now);
    const sentIds: string[] = [];
    const failed: string[] = [];
    let skipped = 0;

    for (const { user, translations, community, schedule, isPro, since } of due) {
      const id = user._id.toString();
      if (dryRun) {
        skipped++;
        continue;
      }

      try {
        const sent = await sendSummary(
          {
            _id: id,
            email: user.email,
            name: user.name,
            image: user.image,
            selectedLanguages: user.selectedLanguages,
            translationType: user.translationType,
            createdAt: user.createdAt,
          } as unknown as User,
          translations as unknown as Translation[],
          {
            since,
            schedule,
            isPro,
            community,
            now,
            nextAt: nextRun(schedule, now, now),
          },
        );

        if (sent) sentIds.push(id);
        else skipped++;
      } catch (err) {
        failed.push(user.email);
        console.error(`summary failed for ${user.email}:`, err);
      }
    }

    await markSummariesSent(sentIds, now);

    const body = { due: due.length, sent: sentIds.length, skipped, failed, dryRun };
    return res.status(failed.length ? 500 : 200).json(body);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error sending summaries" });
  }
}
