// pages/api/posts.ts

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { parse } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end();
  }

  const { page = "1", per_page = "10" } = req.query;

  // 1) Auth check
  const cookies = parse(req.headers.cookie || "");
  if (!cookies.token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // 2) Fetch the user so we know their country
    const userRes = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user`,
      { headers: { cookie: req.headers.cookie || "" } }
    );
    const country: string = userRes.data.country;

    // 3) Look up the WP category ID for that country slug
    let catId: number | undefined;
    if (country) {
      const catLookup = await axios.get(
        `${process.env.WORDPRESS_API_URL}/wp-json/wp/v2/categories`,
        { params: { slug: country } }
      );
      catId = catLookup.data[0]?.id;
    }

    // 4) Fetch paginated posts, filtering by that category if present
    const postsRes = await axios.get(
      `${process.env.WORDPRESS_API_URL}/wp-json/wp/v2/posts`,
      {
        params: {
          _embed: true,
          page: parseInt(page as string, 10),
          per_page: parseInt(per_page as string, 10),
          ...(catId ? { categories: catId } : {}),
        },
      }
    );

    const totalPages = parseInt(postsRes.headers["x-wp-totalpages"] || "1", 10);

    return res.status(200).json({
      posts: postsRes.data,
      totalPages,
    });
  } catch (err: any) {
    const status = err.response?.status || 500;
    return res
      .status(status)
      .json({ message: err.response?.data?.message || "Failed to fetch posts" });
  }
}
