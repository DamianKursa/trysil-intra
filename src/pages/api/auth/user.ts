// pages/api/auth/user.ts

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { parseCookies } from "@/utils/cookies"; // your token parser

type UserPayload = {
  id: number;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  country?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserPayload | { message: string }>
) {
  // Only allow GET
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // 1) Extract token
  const cookies = parseCookies(req.headers.cookie || "");
  const token = cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  try {
    // 2) Get basic “me” info to discover the WP user ID
    const meRes = await axios.get(
      `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wp/v2/users/me`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const userId: number = meRes.data.id;

    // 3) Now hit your custom endpoint—which you updated to return avatar+country—
    //    passing that ID as a query param.
    const customRes = await axios.get(
      `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/custom/v1/user`,
      {
        params: { id: userId },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // 4) Shape & return the payload
    const { id, name, username, email, avatar, country } = customRes.data;
    return res.status(200).json({ id, name, username, email, avatar, country });
  } catch (err: any) {
    console.error("auth/user error:", err.response?.data || err.message);
    const status = err.response?.status || 500;
    return res
      .status(status)
      .json({ message: err.response?.data?.message || "Failed to fetch user profile" });
  }
}
