import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "@/lib/mongodb";
import LiveTranslation from "@/models/liveTranslations";
import { User } from "@/models/user";
import { addXPtoUser } from "@/lib/commUserStatus";

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

      // limit to 100: find the cutoff (100th newest) and drop anything older
      const cutoff = await LiveTranslation.findOne({})
        .sort({ createdAt: -1 })
        .skip(99)
        .select("createdAt")
        .lean();
      if (cutoff) {
        await LiveTranslation.deleteMany({
          createdAt: { $lt: (cutoff as any).createdAt },
        });
      }

      await addXPtoUser(newTrans.userId, newTrans.sourceText.length * 2);

      return res.status(201).json(newTrans);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
