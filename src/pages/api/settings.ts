import { connectToDB } from "@/lib/mongodb";
import { UserSettings } from "@/models/userSettings";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDB();
  const { method } = req;
  if (method === "GET") {
    const { userId } = req.query;
    const found = await UserSettings.findOne({ userId });
    return res.status(200).json(found || {});
  }
  if (method === "POST") {
    const { userId, settings } = req.body;
    const updated = await UserSettings.findOneAndUpdate(
      { userId },
      { settings },
      { upsert: true, new: true }
    );
    return res.status(200).json(updated);
  }

  res.status(405).end();
}
