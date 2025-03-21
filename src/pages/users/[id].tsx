// pages/users/[id].tsx
import { GetServerSideProps } from "next"
import DashboardLayout from "@/components/Layout/DashboardLayout"
import axios from "axios"

interface UserProfile {
  id: number
  name: string
  username: string
  email: string
  avatar: string // URL to the user's avatar image
  // Add any other custom fields you need
}

interface UserProfilePageProps {
  user: UserProfile | null
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ user }) => {
  if (!user) {
    return (
      <DashboardLayout>
        <div className='container mx-auto py-16 px-4'>
          <h1 className='text-4xl font-bold'>User Not Found</h1>
          <p>The user you are looking for does not exist.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className='container mx-auto py-16 px-4'>
        <div className='flex flex-col items-center'>
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className='w-32 h-32 rounded-full object-cover'
            />
          ) : (
            <div className='w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center'>
              <span className='text-gray-500'>No Image</span>
            </div>
          )}
          <h1 className='text-4xl font-bold mt-4'>{user.name}</h1>
          <p className='text-lg text-gray-600'>@{user.username}</p>
          <p className='text-lg'>{user.email}</p>
          {/* Add additional user info here if needed */}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default UserProfilePage

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string }

  try {
    // Adjust the URL below to match your custom endpoint.
    // For example, if you're exposing a custom REST endpoint in WordPress:
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/custom/v1/user`,
      {
        params: { id },
      }
    )
    const user: UserProfile = res.data
    return {
      props: { user },
    }
  } catch (error) {
    console.error("Error fetching user:", error)
    return {
      props: { user: null },
    }
  }
}
