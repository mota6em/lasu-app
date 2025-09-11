import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "@/lib/mongodb";
import LiveTranslation from "@/models/liveTranslations";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDB();

  if (req.method === "GET") {
    try {
      const translations = await LiveTranslation.find({})
        .sort({ createdAt: -1 })
        .limit(100);
      return res.status(200).json(translations);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const data = req.body;
      const newTrans = await LiveTranslation.create(data);

      // limit to 100
      const count = await LiveTranslation.countDocuments();
      if (count > 100) {
        const oldest = await LiveTranslation.find({})
          .sort({ createdAt: 1 })
          .limit(count - 100);
        await LiveTranslation.deleteMany({
          _id: { $in: oldest.map((o) => o._id) },
        });
      }

      return res.status(201).json(newTrans);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
