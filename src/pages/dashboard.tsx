// pages/dashboard.tsx
import React from "react"
import Layout from "@/components/Layout/Layout.component"
import UserProfile from "@/components/User/UserProfile"

const Dashboard: React.FC = () => {
  return (
    <Layout title='Trysil | Dashboard'>
      <div className='p-4'>
        <h1 className='text-3xl font-bold'>Dashboard</h1>
        <p>Welcome to your dashboard!</p>
        <UserProfile />
      </div>
    </Layout>
  )
}

export default Dashboard
