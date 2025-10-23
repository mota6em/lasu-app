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
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;

      const translations = await LiveTranslation.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await LiveTranslation.countDocuments();

      return res.status(200).json({
        data: translations,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
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

      await addXPtoUser(newTrans.userId, newTrans.sourceText.length * 2);

      return res.status(201).json(newTrans);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
