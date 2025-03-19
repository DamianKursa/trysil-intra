// pages/api/auth/user.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { parseCookies } from "@/utils/cookies"; // Adjust the path as needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = parseCookies(req.headers.cookie || "");
  const token = cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token found" });
  }

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wp/v2/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { id, name, username, email } = response.data;
    res.status(200).json({ id, name, username, email });
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ message: "Failed to fetch user profile" });
  }
}
