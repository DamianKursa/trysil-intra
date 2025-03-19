// pages/blog/[slug].tsx
import { GetServerSideProps } from "next"
import { getSinglePost } from "@/utils/api/getPosts"
import DashboardLayout from "@/components/Layout/DashboardLayout"
import Image from "next/image"

interface BlogPost {
  id: number
  title: { rendered: string }
  content: { rendered: string }
  slug: string
  date: string
  featuredImage: string | null
  author: {
    name: string
    avatar: string | null
  }
  categories: { name: string }[]
  tags: { name: string }[]
}

interface BlogPostPageProps {
  post: BlogPost | null
}

const BlogPostPage = ({ post }: BlogPostPageProps) => {
  if (!post) {
    return (
      <DashboardLayout>
        <div className='container mx-auto py-16 px-4'>
          <h1 className='text-[56px] font-bold text-black'>Post Not Found</h1>
          <p className='text-[18px] font-light text-black'>
            The post you are looking for does not exist or has been removed.
          </p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className='container mx-auto py-16 max-w-[1130px] px-4 md:px-0'>
        {/* Title */}
        <h1
          className='text-[40px] md:text-[56px] font-bold text-black mb-6'
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        {/* Divider */}
        <div className='border-b border-beige-dark mb-8'></div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className='w-full mb-8'>
            <img
              src={post.featuredImage}
              alt={post.title.rendered}
              className='w-full h-[200px] md:h-[635px] object-cover rounded-lg'
            />
          </div>
        )}

        {/* Content */}
        <div className='mx-auto max-w-[899px] blog-content text-left'>
          <div
            className='text-[18px] font-light text-black leading-7 mb-8'
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />

          {/* Divider */}
          <div className='border-b border-beige-dark my-8'></div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default BlogPostPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { slug } = params || {}

  if (!slug) {
    return { notFound: true }
  }

  try {
    const post = await getSinglePost(slug as string)
    if (!post) {
      return { notFound: true }
    }
    return { props: { post } }
  } catch (error) {
    console.error("Error in getServerSideProps:", error)
    return { props: { post: null } }
  }
}
