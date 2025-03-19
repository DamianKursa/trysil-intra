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
    "wp:featuredmedia"?: Array<{
      source_url: string
    }>
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
        <h1 className='text-4xl font-bold mb-8'>{categoryName}</h1>
        {posts.length === 0 ? (
          <p>No posts found in this category.</p>
        ) : (
          <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            {posts.map((post) => {
              const featuredImage =
                post._embedded?.["wp:featuredmedia"]?.[0]?.source_url
              return (
                <li
                  key={post.id}
                  className='bg-white rounded-lg shadow overflow-hidden'
                >
                  <Link href={`/blog/${post.slug}`}>
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
                          className='text-xl font-bold'
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
          <Link href='/blog' className='text-blue-600 hover:underline'>
            Back to Blog Home
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default BlogCategoryPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { slug } = params || {}

  if (!slug || typeof slug !== "string") {
    return { notFound: true }
  }

  try {
    // Fetch category info by slug to get ID and name
    const catRes = await axios.get(
      `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wp/v2/categories?slug=${slug}`
    )
    if (catRes.data.length === 0) {
      return { notFound: true }
    }
    const category = catRes.data[0]
    const categoryId = category.id
    const categoryName = category.name

    // Fetch posts for that category
    const postsRes = await axios.get(
      `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wp/v2/posts`,
      {
        params: {
          categories: categoryId,
          per_page: 10,
          _embed: true,
        },
      }
    )

    return {
      props: {
        categorySlug: slug,
        categoryName,
        posts: postsRes.data,
      },
    }
  } catch (error) {
    console.error("Error fetching category posts:", error)
    return {
      props: {
        categorySlug: slug,
        categoryName: "",
        posts: [],
      },
    }
  }
}
