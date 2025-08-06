import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  console.log("session.user.id", session?.user?.id);
  if (!session) {
    return res.status(200).json({ user: null });
  }

  return res.status(200).json({
    user: { id: session.user.id, name: session.user.name },
  });
}
