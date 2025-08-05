import { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "@/lib/mongodb";
import Translation from "@/models/translation";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
  } = req;

  await connectToDB();

  if (method === "DELETE") {
    try {
      const deleted = await Translation.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ message: "Translation not found" });
      }
      return res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
      return res.status(500).json({ message: "Server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
