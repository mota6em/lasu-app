import { getAllUsersWithTranslations } from "@/lib/db";
import { sendWeeklySummary } from "@/lib/email";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const users = await getAllUsersWithTranslations();

    for (const { user, translations } of users) {
      await sendWeeklySummary(user, translations);
    }

    res.status(200).json({ message: "Weekly summaries sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending weekly summaries" });
  }
}
