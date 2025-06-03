// pages/dashboard.tsx
import React from "react"
import DashboardLayout from "@/components/Layout/DashboardLayout"
import CategoryPostsSection from "@/components/Posts/CategoryPostsSection"
import { GetServerSideProps } from "next"

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div>
        {/* Left side: Posts sections */}
        <div className='md:col-span-2'>
          <CategoryPostsSection categorySlug='news' title='News' />
          <CategoryPostsSection
            categorySlug='sales-and-market'
            title='Sales and Market'
          />
          <CategoryPostsSection categorySlug='economy' title='Economy' />
          <CategoryPostsSection
            categorySlug='project-economy'
            title='Project Economy'
          />
          <CategoryPostsSection
            categorySlug='corporate-group'
            title='Corporate group'
          />
          <CategoryPostsSection categorySlug='project' title='project' />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies.token
  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }
  return { props: {} }
}
