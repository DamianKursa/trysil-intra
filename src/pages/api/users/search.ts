// pages/api/users/search.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { query } = req.query;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ message: "Query parameter is required" });
  }

  try {
    // Use your WordPress API URL from your environment variable.
    const wpRes = await axios.get(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/custom/v1/users`, {
      params: { query },
    });
    return res.status(200).json(wpRes.data);
  } catch (error: any) {
    console.error("Error fetching users:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({ message: error.message });
  }
}
