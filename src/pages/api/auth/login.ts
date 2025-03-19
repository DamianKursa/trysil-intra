// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { setCookie } from "@/utils/cookies"; // Adjust the path as needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Missing username or password" });
  }

  const jwtEndpoint = `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/jwt-auth/v1/token`;

  try {
    const response = await axios.post(jwtEndpoint, { username, password }, {
      headers: { "Content-Type": "application/json" },
    });

    const data = response.data;

    // Set the token in an HttpOnly cookie that lasts for 7 days
    setCookie(res, "token", data.token, { maxAge: 60 * 60 * 24 * 7 });
    
    return res.status(200).json(data);
  } catch (error: any) {
    const message = error.response?.data?.message || "Authentication failed";
    return res.status(error.response?.status || 500).json({ message });
  }
}
