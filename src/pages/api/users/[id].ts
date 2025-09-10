import { connectToDB } from "@/lib/mongodb";
import { User } from "@/models/user";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDB();

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const user = await User.findById(id).select("name image email");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
