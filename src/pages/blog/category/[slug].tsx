// pages/blog/category/[slug].tsx

import { GetServerSideProps } from "next"
import axios from "axios"
import DashboardLayout from "@/components/Layout/DashboardLayout"
import Link from "next/link"

interface Post {
  id: number
  title: { rendered: string }
  slug: string
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>
  }
}

interface BlogCategoryPageProps {
  categorySlug: string
  categoryName: string
  posts: Post[]
}

const BlogCategoryPage: React.FC<BlogCategoryPageProps> = ({
  categorySlug,
  categoryName,
  posts,
}) => {
  return (
    <DashboardLayout>
      <div className='container mx-auto py-16 px-4'>
        <h1 className='text-[#FC7E02] text-[35px] font-bold mb-8'>
          {categoryName}
        </h1>
        {posts.length === 0 ? (
          <p>No posts found in this category.</p>
        ) : (
          <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
            {posts.map((post) => {
              const featuredImage =
                post._embedded?.["wp:featuredmedia"]?.[0]?.source_url
              return (
                <li
                  key={post.id}
                  className='rounded-lg shadow-md overflow-hidden'
                >
                  <Link href={`/blog/${post.slug}`} legacyBehavior>
                    <a className='block'>
                      {featuredImage && (
                        <img
                          src={featuredImage}
                          alt={post.title.rendered}
                          className='w-full h-48 object-cover'
                        />
                      )}
                      <div className='p-4'>
                        <h2
                          className='text-lg text-black hover:underline h-12 overflow-hidden'
                          dangerouslySetInnerHTML={{
                            __html: post.title.rendered,
                          }}
                        />
                      </div>
                    </a>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}

        <div className='mt-8 text-center'>
          <Link href='/' legacyBehavior>
            <a className='text-[#FC7E02] hover:underline'>Back to Home</a>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default BlogCategoryPage

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  const { slug } = params as { slug: string }
  if (!slug) {
    return { notFound: true }
  }

  // 1) Fetch category name
  let categoryName = ""
  try {
    const catRes = await axios.get(
      `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wp/v2/categories?slug=${slug}`
    )
    if (catRes.data.length > 0) {
      categoryName = catRes.data[0].name
    } else {
      return { notFound: true }
    }
  } catch (err) {
    console.error("Could not fetch category info:", err)
    return { notFound: true }
  }

  // 2) Call our own /api/posts, forwarding cookies
  let posts: Post[] = []
  try {
    const protocol = process.env.VERCEL_URL ? "https" : "http"
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${req.headers.host}`

    const postsRes = await axios.get(`${baseUrl}/api/posts`, {
      headers: { Cookie: req.headers.cookie || "" },
      params: {
        categorySlug: slug,
        per_page: 100,
        page: 1,
      },
    })
    posts = postsRes.data.posts
  } catch (err) {
    console.error("Error fetching /api/posts in getServerSideProps:", err)
    posts = []
  }

  return {
    props: {
      categorySlug: slug,
      categoryName,
      posts,
    },
  }
}
