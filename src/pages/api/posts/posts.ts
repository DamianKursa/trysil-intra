// pages/api/posts.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { parse } from "cookie";

type Post = any;  // tighten up to your shape later
type Data =
  | { posts: Post[]; totalPages: number }
  | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { categorySlug, page = "1", per_page = "10" } = req.query;

  // 1) Figure out the logged-in user’s country
  let userCountry: string | null = null;
  const cookies = parse(req.headers.cookie || "");
  if (cookies.token) {
    try {
      // hit your existing /api/auth/user
      const userRes = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user`,
        { headers: { cookie: req.headers.cookie! } }
      );
      userCountry = userRes.data.country; // e.g. "no", "se", etc.
    } catch (e) {
      console.warn("Could not fetch user country, returning no posts");
      return res.status(200).json({ posts: [], totalPages: 1 });
    }
  }

  // 2) If they’re asking for a category that doesn’t match their country, return empty
  if (typeof categorySlug === "string" && userCountry !== categorySlug) {
    return res.status(200).json({ posts: [], totalPages: 1 });
  }

  // 3) Lookup WP category ID by slug
  let categoryId: number | null = null;
  try {
    const catRes = await axios.get(
      `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wp/v2/categories`,
      { params: { slug: categorySlug } }
    );
    if (Array.isArray(catRes.data) && catRes.data.length > 0) {
      categoryId = catRes.data[0].id;
    }
  } catch (e) {
    console.error("Failed to fetch category ID:", e);
    return res.status(500).json({ error: "Failed to fetch category" });
  }
  if (!categoryId) {
    return res.status(200).json({ posts: [], totalPages: 1 });
  }

  // 4) Fetch posts in that category
  try {
    const postsRes = await axios.get(
      `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wp/v2/posts`,
      {
        params: {
          categories: categoryId,
          _embed: true,
          page,
          per_page,
        },
      }
    );
    const totalPages = parseInt(
      postsRes.headers["x-wp-totalpages"] || "1",
      10
    );
    return res
      .status(200)
      .json({ posts: postsRes.data, totalPages: totalPages });
  } catch (e: any) {
    console.error("Error fetching posts:", e.response?.data || e.message);
    return res.status(500).json({ error: "Failed to fetch posts" });
  }
}
