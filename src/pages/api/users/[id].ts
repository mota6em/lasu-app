import { connectToDB } from "@/lib/mongodb";
import { User } from "@/models/user";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await connectToDB();

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // GET user info
    if (req.method === "GET") {
      const user = await User.findById(id).select(
        "name image email emailSummary",
      );
      if (!user) return res.status(404).json({ error: "User not found" });
      return res.status(200).json(user);
    }

    // PATCH - update name or image or emailSummary
    if (req.method === "PATCH") {
      const { name, image, emailSummary } = req.body;

      if (!name && !image && emailSummary === undefined)
        return res.status(400).json({ error: "No data to update" });

      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          ...(name && { name }),
          ...(image && { image }),
          ...(emailSummary !== undefined && { emailSummary }),
        },
        { new: true },
      ).select("name image email emailSummary");

      if (!updatedUser)
        return res.status(404).json({ error: "User not found" });

      return res.status(200).json({ success: true, user: updatedUser });
    }

    // invalid method
    res.setHeader("Allow", ["GET", "PATCH"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
