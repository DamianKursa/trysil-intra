// File: pages/api/posts/posts.ts

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { parse } from "cookie";

type Post = any;  // (you can tighten this up later)
type Data =
  | { posts: Post[]; totalPages: number }
  | { error: string };

// Two‐letter country slugs
const COUNTRY_SLUGS = ["no", "se", "fi", "dk", "is", "ee", "lv", "lt"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { categorySlug, page = "1", per_page = "10" } = req.query as {
    categorySlug?: string;
    page?: string;
    per_page?: string;
  };

  if (!categorySlug || typeof categorySlug !== "string") {
    return res.status(400).json({ error: "Missing or invalid categorySlug" });
  }

  //
  // 1) Determine the logged‐in user’s country
  //
  let userCountry: string | null = null;
  const cookies = parse(req.headers.cookie || "");
  if (cookies.token) {
    try {
      console.log("[posts.ts] Found cookie.token, calling /api/auth/user…");
      const userRes = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user`,
        { headers: { Cookie: req.headers.cookie! } }
      );
      userCountry = userRes.data.country || null;
      console.log("[posts.ts] userCountry =", userCountry);
    } catch (e: unknown) {
      console.warn("[posts.ts] Could not fetch user country:", e);
      // If we can’t determine country, return an empty set
      return res.status(200).json({ posts: [], totalPages: 1 });
    }
  } else {
    // No token → anonymous; treat as “no country”
    userCountry = null;
    console.log("[posts.ts] No token found, treating as anonymous");
  }

  //
  // 2) Look up WP category ID by slug (e.g. “economy”)
  //
  let categoryId: number | null = null;
  try {
    const catRes = await axios.get(
      `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wp/v2/categories`,
      { params: { slug: categorySlug } }
    );
    if (Array.isArray(catRes.data) && catRes.data.length > 0) {
      categoryId = catRes.data[0].id;
    }
    console.log("[posts.ts] categorySlug → categoryId =", categoryId);
  } catch (err) {
    console.error("[posts.ts] Failed to fetch category ID:", err);
    return res.status(500).json({ error: "Failed to fetch category" });
  }
  if (!categoryId) {
    // If the slug doesn’t exist in WP, return empty
    return res.status(200).json({ posts: [], totalPages: 1 });
  }

  //
  // 3) Fetch all posts in that “main” category, embedding their categories
  //
  let allPosts: any[] = [];
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
    allPosts = postsRes.data;
    totalPages = parseInt(postsRes.headers["x-wp-totalpages"] || "1", 10);
    console.log(
      `[posts.ts] fetched ${allPosts.length} posts from WP (page ${page})`
    );
  } catch (err: any) {
    console.error(
      "[posts.ts] Error fetching posts:",
      err.response?.data || err.message
    );
    return res.status(500).json({ error: "Failed to fetch posts" });
  }

  //
  // 4) Filter logic:
  //    • Only keep posts that have at least one country‐slug in their terms.
  //    • Among those, only keep if that country‐slug === userCountry.
  //
  const filtered = allPosts.filter((post) => {
    // a) Grab every category‐slug for this post from _embedded
    const categoryTerms: any[] = post._embedded?.["wp:term"]?.[0] || [];
    const slugs: string[] = categoryTerms.map((c) => c.slug);

    // b) If this post does not even have the “main” categorySlug (shouldn’t happen
    //    because we already filtered by categoryId), skip it as well:
    if (!slugs.includes(categorySlug)) {
      return false;
    }

    // c) Look for any two‐letter country slug in this post’s categories
    const postCountryTag = slugs.find((s) => COUNTRY_SLUGS.includes(s));

    if (!postCountryTag) {
      // **NEW BEHAVIOR**: if the post has NO country tag at all, don't show it.
      console.log(
        `[posts.ts] post #${post.id} has NO country tag → hide it entirely`
      );
      return false;
    }

    // d) If it _does_ have a country tag, only keep if it matches userCountry
    const keep = postCountryTag === userCountry;
    console.log(
      `[posts.ts] post #${post.id} has countryTag="${postCountryTag}", userCountry="${userCountry}" → keep? ${keep}`
    );
    return keep;
  });

  console.log(
    `[posts.ts] filteredPosts count = ${filtered.length} / total ${allPosts.length}`
  );

  //
  // 5) Return the filtered array & totalPages
  //
  return res.status(200).json({ posts: filtered, totalPages });
}
