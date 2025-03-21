// components/Posts/CategoryPostsSection.tsx
import React, { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"

interface Post {
  id: number
  title: { rendered: string }
  slug: string
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string
    }>
  }
}

interface CategoryPostsSectionProps {
  categorySlug: string
  title: string
}

const CategoryPostsSection: React.FC<CategoryPostsSectionProps> = ({
  categorySlug,
  title,
}) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch posts for the given category slug
  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError("")
      // Get category info by slug to obtain its ID
      const catRes = await axios.get(
        `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wp/v2/categories?slug=${categorySlug}`
      )
      if (catRes.data.length === 0) {
        throw new Error("Category not found")
      }
      const categoryId = catRes.data[0].id
      // Fetch posts for that category, limit to 4 posts
      const postsRes = await axios.get(
        `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wp/v2/posts`,
        {
          params: {
            categories: categoryId,
            per_page: 4,
            _embed: true,
          },
        }
      )
      setPosts(postsRes.data)
    } catch (err: any) {
      setError(err.message || "Failed to load posts")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [categorySlug])

  return (
    <section className='mb-8'>
      {/* Title is a link to the blog category page */}
      <Link
        href={`/blog/${categorySlug}`}
        className='text-[#FC7E02] text-[35px] font-bold mb-4 block'
      >
        {title}
      </Link>
      {loading && <p>Loading...</p>}
      {error && <p className='text-red-500'>{error}</p>}
      <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
        {posts.map((post) => {
          const featuredImage =
            post._embedded?.["wp:featuredmedia"]?.[0]?.source_url
          return (
            <li key={post.id}>
              <Link
                href={`/blog/${post.slug}`}
                className='block rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'
              >
                {featuredImage && (
                  <img
                    src={featuredImage}
                    alt={post.title.rendered}
                    className='w-full h-48 object-cover'
                  />
                )}
                <div className='p-4'>
                  <h3
                    className='text-lg text-black hover:underline h-12 overflow-hidden'
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
      {/* "Show All" Button */}
      <div className='mt-4 text-center'>
        <Link
          href={`/blog/category/${categorySlug}`}
          className='text-[#FC7E02] underline'
        >
          Show All
        </Link>
      </div>
    </section>
  )
}

export default CategoryPostsSection
