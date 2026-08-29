import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { billingStatus } from "@/lib/billingStatus";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  try {
    const status = await billingStatus(req, { userId: session?.user?.id });
    res.setHeader("Cache-Control", "private, no-store");
    return res.status(200).json(status);
  } catch (err) {
    console.error("billing status failed:", err);
    return res.status(500).json({ error: "status_unavailable" });
  }
}
