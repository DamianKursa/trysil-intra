// pages/api/auth/logout.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { deleteCookie } from "@/utils/cookies"; // Adjust the path as needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    deleteCookie(res, "token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to log out" });
  }
}
