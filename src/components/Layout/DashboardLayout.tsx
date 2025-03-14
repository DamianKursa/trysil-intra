// components/Layout/DashboardLayout.tsx
import React, { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
import { useRouter } from "next/router"

interface DashboardLayoutProps {
  children: React.ReactNode
}

interface UserProfileData {
  id: number
  name: string
  username: string
  email: string
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/user")
        if (res.status === 200) {
          setUser(res.data)
        }
      } catch (err: any) {
        setError("Failed to fetch user data")
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" })
      if (!res.ok) {
        throw new Error("Logout failed")
      }
      router.push("/login")
    } catch (err: any) {
      setError(err.message || "Logout error")
    }
  }

  return (
    <div className='min-h-screen flex bg-gray-100'>
      {/* SIDEBAR */}
      <aside className='w-64 bg-white shadow-lg'>
        <div className='p-6 border-b'>
          <img
            src='/images/logo.webp'
            alt='Trysil RMM Logo'
            className='h-10 mx-auto'
          />
        </div>
        <nav className='p-4'>
          <ul className='space-y-2'>
            <li>
              <Link href='/dashboard'>
                <span className='flex items-center p-2 rounded hover:bg-gray-200 transition-colors cursor-pointer'>
                  {/* Dashboard Icon */}
                  <svg
                    className='w-5 h-5 mr-3 text-gray-600'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M3 3h18M9 9h6m-6 4h6m-6 4h6'
                    />
                  </svg>
                  Dashboard
                </span>
              </Link>
            </li>
            <li>
              <Link href='#'>
                <span className='flex items-center p-2 rounded hover:bg-gray-200 transition-colors cursor-pointer'>
                  {/* Tables Icon */}
                  <svg
                    className='w-5 h-5 mr-3 text-gray-600'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M8 6h13M8 12h9m-9 6h13M3 6h.01M3 12h.01M3 18h.01'
                    />
                  </svg>
                  Tables
                </span>
              </Link>
            </li>
            <li>
              <Link href='#'>
                <span className='flex items-center p-2 rounded hover:bg-gray-200 transition-colors cursor-pointer'>
                  {/* Analytics Icon */}
                  <svg
                    className='w-5 h-5 mr-3 text-gray-600'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M12 8c-1.657 0-3 1.79-3 4s1.343 4 3 4 3-1.79 3-4-1.343-4-3-4z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M19.458 8.667C20.732 9.34 22 10.642 22 12c0 1.357-1.268 2.66-2.542 3.333C18.267 16.005 16.771 17 15 17H9c-1.771 0-3.267-.995-4.458-1.667C3.268 14.66 2 13.357 2 12c0-1.358 1.268-2.66 2.542-3.333C5.733 7.995 7.229 7 9 7h6c1.771 0 3.267.995 4.458 1.667z'
                    />
                  </svg>
                  Analytics
                </span>
              </Link>
            </li>
            {/* Add more nav links as needed */}
          </ul>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className='flex-grow flex flex-col'>
        {/* HEADER */}
        <header className='bg-white h-16 px-4 flex items-center justify-between shadow'>
          {/* Left: Search */}
          <div className='flex items-center space-x-4'>
            <input
              type='text'
              placeholder='Type to search...'
              className='border border-gray-300 rounded-full px-3 py-1 focus:outline-none'
            />
          </div>
          {/* Right: User Profile */}
          <div className='flex items-center space-x-4 relative'>
            {loading && <span>Loading...</span>}
            {error && <span className='text-red-500'>{error}</span>}
            {user && (
              <div className='relative'>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className='flex items-center space-x-2 focus:outline-none'
                >
                  <span className='text-gray-600'>{user.name}</span>
                </button>
                {dropdownOpen && (
                  <div className='absolute right-0 mt-2 bg-white shadow-md rounded py-2 px-4 z-50 w-48'>
                    <p className='text-sm font-semibold'>{user.email}</p>
                    <button
                      onClick={handleLogout}
                      className='block mt-2 text-red-500 hover:underline'
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
            {!user && !loading && !error && (
              <Link href='/login' className='text-blue-600 hover:underline'>
                Login
              </Link>
            )}
          </div>
        </header>

        {/* MAIN PAGE CONTENT */}
        <main className='p-4 flex-grow'>{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
