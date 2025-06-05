import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { parse } from "cookie";

type Post = any; // You can refine this later
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
      return res.status(200).json({ posts: [], totalPages: 1 });
    }
  } else {
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
    return res.status(200).json({ posts: [], totalPages: 1 });
  }

  //
  // 3) Fetch child category IDs (direct children only)
  //
  let categoryIds: number[] = [categoryId];
  try {
    const subCatsRes = await axios.get(
      `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wp/v2/categories`,
      { params: { parent: categoryId, per_page: 100 } }
    );
    const subCatIds = subCatsRes.data.map((cat: any) => cat.id);
    categoryIds.push(...subCatIds);
    console.log("[posts.ts] categoryIds including children =", categoryIds);
  } catch (err) {
    console.warn("[posts.ts] Could not fetch child categories:", err);
  }

  //
  // 4) Fetch posts from all relevant categories
  //
  let allPosts: any[] = [];
  let totalPages = 1;
  try {
    const postsRes = await axios.get(
      `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wp/v2/posts`,
      {
        params: {
          categories: categoryIds.join(","),
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
  // 5) Filter: keep only posts with valid country tag matching user
  //
  const filtered = allPosts.filter((post) => {
    const categoryTerms: any[] = post._embedded?.["wp:term"]?.[0] || [];
    const slugs: string[] = categoryTerms.map((c) => c.slug);

    if (!slugs.includes(categorySlug)) {
      return false;
    }

    const postCountryTag = slugs.find((s) => COUNTRY_SLUGS.includes(s));
    if (!postCountryTag) {
      console.log(
        `[posts.ts] post #${post.id} has NO country tag → hide it entirely`
      );
      return false;
    }

    const keep = postCountryTag === userCountry;
    console.log(
      `[posts.ts] post #${post.id} has countryTag="${postCountryTag}", userCountry="${userCountry}" → keep? ${keep}`
    );
    return keep;
  });

  console.log(
    `[posts.ts] filteredPosts count = ${filtered.length} / total ${allPosts.length}`
  );

  return res.status(200).json({ posts: filtered, totalPages });
}
