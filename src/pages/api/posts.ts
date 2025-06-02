// pages/api/posts/posts.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { parse } from "cookie";

type Post = any; // (You can replace with a stricter interface later)
type Data =
  | { posts: Post[]; totalPages: number }
  | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { categorySlug, page = "1", per_page = "10" } = req.query as {
    categorySlug?: string;
    page?: string;
    per_page?: string;
  };

  if (typeof categorySlug !== "string") {
    return res.status(400).json({ error: "Missing categorySlug" });
  }

  // 1) Figure out the logged‐in user’s country (e.g. "no", "se", "fi", …)
  let userCountry: string | null = null;
  const cookies = parse(req.headers.cookie || "");
  if (cookies.token) {
    try {
      // Call our existing /api/auth/user to get { id, name, username, email, avatar?, country }
      const userRes = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user`,
        { headers: { Cookie: req.headers.cookie! } }
      );
      userCountry = userRes.data.country; // e.g. "no"
    } catch (e: unknown) {
      console.warn("Could not fetch user country; returning no posts");
      return res.status(200).json({ posts: [], totalPages: 1 });
    }
  } else {
    // If there is no token at all, treat as “anonymous” (no country)
    userCountry = null;
  }

  // 2) Fetch the WP category ID for `categorySlug`
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
    // No such category slug ⇒ return empty
    return res.status(200).json({ posts: [], totalPages: 1 });
  }

  // 3) Fetch all posts in that category (embed their terms, so we know each post’s category slugs)
  let wpPosts: any[] = [];
  let totalPages = 1;
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
    wpPosts = postsRes.data;
    totalPages = parseInt(postsRes.headers["x-wp-totalpages"] || "1", 10);
  } catch (e: any) {
    console.error("Error fetching posts:", e.response?.data || e.message);
    return res.status(500).json({ error: "Failed to fetch posts" });
  }

  // 4) Filter out any post that has a country‐category not matching `userCountry`.
  //    If a post has no “country” category at all, it stays visible to everyone.
  const COUNTRY_SLUGS = ["no", "se", "fi", "dk", "is", "ee", "lv", "lt"];

  const filtered = wpPosts.filter((post) => {
    // The embedded terms for categories live under _embedded["wp:term"][0]
    // (e.g. an array of all category objects { id, name, slug, ... })
    const categoryTerms: any[] =
      post._embedded?.["wp:term"]?.[0] || [];

    // Find if any of this post’s categories is one of our country slugs
    const countryCat = categoryTerms.find((cat: any) =>
      COUNTRY_SLUGS.includes(cat.slug)
    );

    if (countryCat) {
      // If there *is* a country category, only keep it if it matches userCountry
      return countryCat.slug === userCountry;
    }

    // If there is no country category, keep the post for everyone
    return true;
  });

  // 5) Return the filtered array
  return res.status(200).json({ posts: filtered, totalPages });
}
