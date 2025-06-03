// pages/min-konto.tsx
import { GetServerSideProps } from "next"
import axios from "axios"
import DashboardLayout from "@/components/Layout/DashboardLayout"
import Image from "next/image"

interface MyAccountProps {
  id: number
  name: string
  username: string
  email: string
  avatar?: string | null
  country?: string | null
}

const MyAccountPage: React.FC<MyAccountProps> = ({
  id,
  name,
  username,
  email,
  avatar,
  country,
}) => {
  return (
    <DashboardLayout>
      <div className='container mx-auto py-16 px-16'>
        <h1 className='text-3xl font-bold mb-6'>Min konto</h1>

        <div className='bg-white shadow rounded-lg p-6 flex flex-col items-left'>
          {avatar ? (
            <Image
              src={avatar}
              alt={`${name}’s avatar`}
              width={120}
              height={120}
              className='rounded-full mb-4'
            />
          ) : (
            <div className='w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center mb-4'>
              <span className='text-gray-500'>No Image</span>
            </div>
          )}

          <div className='text-left'>
            <p className='text-xl font-semibold'>{name}</p>
            <p className='text-gray-600'>@{username}</p>
          </div>

          <div className='mt-6 w-full'>
            <ul className='space-y-2'>
              <li>
                <span className='font-medium'>Email:</span>{" "}
                <span className='text-gray-700'>{email}</span>
              </li>
              {country && (
                <li>
                  <span className='font-medium'>Country:</span>{" "}
                  <span className='text-gray-700'>{country.toUpperCase()}</span>
                </li>
              )}
              <li>
                <span className='font-medium'>User ID:</span>{" "}
                <span className='text-gray-700'>{id}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MyAccountPage

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies.token

  // If no JWT token, redirect to /login
  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }

  try {
    // Call our internal API that returns { id, name, username, email, avatar, country }
    const userRes = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user`,
      {
        headers: {
          Cookie: req.headers.cookie || "",
        },
      }
    )

    return {
      props: userRes.data,
    }
  } catch (err: any) {
    // In case of error (e.g. expired token), redirect to /login
    console.error("Error fetching /api/auth/user in getServerSideProps:", err)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }
}
