// File: /pages/api/posts/posts.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { parse } from "cookie";

type Post = any;
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
  console.log("[posts.ts] Raw incoming cookies:", req.headers.cookie);
  console.log("[posts.ts] Parsed cookies:", cookies);

  if (cookies.token) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      console.log("[posts.ts] NEXT_PUBLIC_BASE_URL:", baseUrl);

      // Build the URL to our own Next.js endpoint:
      const userUrl = `${baseUrl}/api/auth/user`;
      console.log("[posts.ts] Fetching user from:", userUrl);

      const userRes = await axios.get(userUrl, {
        // forward exactly the same cookie header
        headers: { cookie: req.headers.cookie as string },
      });
      console.log("[posts.ts] auth/user response data:", userRes.data);

      // We expect userRes.data.country to exist.
      userCountry = (userRes.data as any).country;
      console.log("[posts.ts] Detected userCountry =", userCountry);
    } catch (err: any) {
      console.error("[posts.ts] Error fetching user country:", err.message || err);
      console.warn("[posts.ts] Full error:", err.response?.data || err);
      // Return empty if we cannot find the user country
      return res.status(200).json({ posts: [], totalPages: 1 });
    }
  } else {
    console.log("[posts.ts] No token cookie present; returning no posts.");
    return res.status(200).json({ posts: [], totalPages: 1 });
  }

  // 2) If they’re asking for a category that doesn’t match their country, return empty
  if (typeof categorySlug === "string" && userCountry !== categorySlug) {
    console.log(
      `[posts.ts] User country (${userCountry}) != requested categorySlug (${categorySlug}). Returning empty.`
    );
    return res.status(200).json({ posts: [], totalPages: 1 });
  }

  // 3) Lookup WP category ID by slug
  let categoryId: number | null = null;
  try {
    const catRes = await axios.get(
      `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wp/v2/categories`,
      { params: { slug: categorySlug } }
    );
    console.log("[posts.ts] Category lookup response:", catRes.data);
    if (Array.isArray(catRes.data) && catRes.data.length > 0) {
      categoryId = catRes.data[0].id;
    }
  } catch (e) {
    console.error("[posts.ts] Failed to fetch category ID:", e);
    return res.status(500).json({ error: "Failed to fetch category" });
  }
  if (!categoryId) {
    console.log(`[posts.ts] No categoryId found for slug "${categorySlug}".`);
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
    console.log(
      `[posts.ts] Returning ${postsRes.data.length} posts (totalPages=${totalPages}).`
    );
    return res.status(200).json({ posts: postsRes.data, totalPages });
  } catch (e: any) {
    console.error("[posts.ts] Error fetching posts:", e.response?.data || e.message);
    return res.status(500).json({ error: "Failed to fetch posts" });
  }
}
