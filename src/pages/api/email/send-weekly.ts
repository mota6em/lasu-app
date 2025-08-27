import { getAllUsersWithTranslations } from "@/lib/db";
import { sendWeeklySummary } from "@/lib/email";
import Translation from "@/types/translation";
import User from "@/types/user";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const secret = process.env.CRON_SECRET;
  const reqSecret = req.headers["cron-key"];
  if (reqSecret !== secret) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const users = await getAllUsersWithTranslations();

    for (const { user, translations } of users) {
      for (const { user, translations } of users) {
        const typedUser = {
          _id: user._id.toString(),
          email: (user as any).email,
          name: (user as any).name,
          image: (user as any).image,
          selectedLanguages: (user as any).selectedLanguages,
          translationType: (user as any).translationType,
          createdAt: (user as any).createdAt,
        } as User;

        const typedTranslations: Translation[] = translations.map((t) => ({
          _id: t._id.toString(),
          sourceText: (t as any).sourceText,
          translationType: (t as any).translationType,
          result: (t as any).result,
          createdAt: (t as any).createdAt,
        }));
        await sendWeeklySummary(typedUser, typedTranslations);
      }
    }

    res.status(200).json({ message: "Weekly summaries sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending weekly summaries" });
  }
}
