// components/Posts/CategoryPostsSection.tsx

import React, { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"

interface Post {
  id: number
  title: { rendered: string }
  slug: string
  _embedded?: { "wp:featuredmedia"?: Array<{ source_url: string }> }
}

interface Props {
  categorySlug: string
  title: string
}

const CategoryPostsSection: React.FC<Props> = ({ categorySlug, title }) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      setError("")

      try {
        const res = await axios.get("/api/posts", {
          params: { categorySlug, per_page: 4 },
          withCredentials: true, // ← ensures the cookie is sent
        })
        setPosts(res.data.posts)
      } catch (e: any) {
        console.error("Failed to load posts:", e)
        setError("Failed to load posts")
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [categorySlug])

  return (
    <section className='mb-8'>
      <Link href={`/blog/category/${categorySlug}`}>
        <a className='text-[#FC7E02] text-[35px] font-bold mb-4 block'>
          {title}
        </a>
      </Link>

      {loading && <p>Loading…</p>}
      {error && <p className='text-red-500'>{error}</p>}

      {!loading && !error && posts.length === 0 && (
        <p>No posts available in this category for your country.</p>
      )}

      <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
        {posts.map((post) => {
          const img = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url
          return (
            <li key={post.id}>
              <Link href={`/blog/${post.slug}`}>
                <a className='block rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'>
                  {img && (
                    <img
                      src={img}
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
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default CategoryPostsSection
