import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { CommunityUserSchema } from "@/models/communityUser";



const CommunityUser =
  mongoose.models.CommunityUser ||
  mongoose.model("CommunityUser", CommunityUserSchema);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.query;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    const user = await CommunityUser.findOne({ userId }).lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
