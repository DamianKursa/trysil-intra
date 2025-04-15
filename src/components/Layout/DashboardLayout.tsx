// components/Layout/DashboardLayout.tsx
import React, { useEffect, useState, ChangeEvent } from "react"
import Link from "next/link"
import axios from "axios"
import { useRouter } from "next/router"
import CalendarSection from "@/components/Calendar/CalendarSection"
import InstallPromptModal from "@/components/UI/InstallPromptModal"

interface DashboardLayoutProps {
  children: React.ReactNode
}

interface UserProfileData {
  id: number
  name: string
  username: string
  email: string
  avatar?: string
}

interface UserProfile {
  id: number
  name: string
  email: string
  avatar?: string
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<UserProfile[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState("")
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

  const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    if (value.length < 3) {
      setSearchResults([])
      setSearchError("")
      return
    }
    setSearchLoading(true)
    try {
      const res = await fetch(
        `/api/users/search?query=${encodeURIComponent(value)}`
      )
      if (!res.ok) {
        throw new Error("Error fetching search results")
      }
      const users: UserProfile[] = await res.json()
      setSearchResults(users)
    } catch (err: any) {
      console.error("Error fetching search results:", err)
      setSearchError("Error fetching search results")
    } finally {
      setSearchLoading(false)
    }
  }

  return (
    <div className='h-screen flex bg-gray-100'>
      {/* Desktop Sidebar */}
      <aside className='hidden md:block w-64 fixed left-0 top-0 h-screen bg-white shadow-lg'>
        <div className='p-6 border-b'>
          <Link href='/'>
            <img
              src='/images/logo.webp'
              alt='Trysil RMM Logo'
              className='h-10 mx-auto'
            />
          </Link>
        </div>
        <nav className='p-4'>
          <ul className='space-y-2'>
            <li>
              <Link
                className='flex items-center p-2 rounded hover:bg-gray-200 transition-colors cursor-pointer'
                href='/blog/category/news'
              >
                {/* News Icon */}
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
                    d='M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2-2h4l2 2h4a2 2 0 012 2v12a2 2 0 01-2 2z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M9 9h6m-6 4h6'
                  />
                </svg>
                News
              </Link>
            </li>
            <li>
              <Link
                className='flex items-center p-2 rounded hover:bg-gray-200 transition-colors cursor-pointer'
                href='/blog/category/sales-and-market'
              >
                {/* Sales & Market Icon */}
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
                    d='M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0-2a6 6 0 016 6 6 6 0 01-6 6 6 6 0 01-6-6 6 6 0 016-6z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 2v2m0 16v2m-8-8h2m12 0h2'
                  />
                </svg>
                Sales & Market
              </Link>
            </li>
            <li>
              <Link
                className='flex items-center p-2 rounded hover:bg-gray-200 transition-colors cursor-pointer'
                href='/blog/category/economy'
              >
                {/* Economy Icon */}
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
                    d='M3 3v18h18'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M3 17l7-7 4 4 7-7'
                  />
                </svg>
                Economy
              </Link>
            </li>
            <li>
              <Link
                className='flex items-center p-2 rounded hover:bg-gray-200 transition-colors cursor-pointer'
                href='/moje-konto'
              >
                {/* My Account Icon */}
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
                    d='M5.121 17.804A9 9 0 1118.88 17.804M12 12a4 4 0 100-8 4 4 0 000 8z'
                  />
                </svg>
                My Account
              </Link>
            </li>
          </ul>
          <div className='mt-8'>
            <CalendarSection />
          </div>
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className='md:hidden fixed bottom-0 left-0 w-full bg-white shadow z-50'>
        <ul className='flex justify-around p-2'>
          <li>
            <Link
              className='flex flex-col items-center text-gray-600'
              href='/blog/category/news'
            >
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2-2h4l2 2h4a2 2 0 012 2v12a2 2 0 01-2 2z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9 9h6m-6 4h6'
                />
              </svg>
              <span className='text-xs'>News</span>
            </Link>
          </li>
          <li>
            <Link
              className='flex flex-col items-center text-gray-600'
              href='/blog/category/sales-and-market'
            >
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0-2a6 6 0 016 6 6 6 0 01-6 6 6 6 0 01-6-6 6 6 0 016-6z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 2v2m0 16v2m-8-8h2m12 0h2'
                />
              </svg>
              <span className='text-xs'>Sales & Market</span>
            </Link>
          </li>
          <li>
            <Link
              className='flex flex-col items-center text-gray-600'
              href='/blog/category/economy'
            >
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3 3v18h18'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3 17l7-7 4 4 7-7'
                />
              </svg>
              <span className='text-xs'>Economy</span>
            </Link>
          </li>
          <li>
            <Link
              className='flex flex-col items-center text-gray-600'
              href='/moje-konto'
            >
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M5.121 17.804A9 9 0 1118.88 17.804M12 12a4 4 0 100-8 4 4 0 000 8z'
                />
              </svg>
              <span className='text-xs'>My Account</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Container */}
      <div className='md:ml-64 flex flex-col w-full'>
        {/* Header: sticky at the top */}
        <header className='sticky top-0 z-10 bg-white h-36 px-4 flex items-center justify-between shadow'>
          {/* Left: Search */}
          <div className='flex items-center space-x-4'>
            <input
              type='text'
              placeholder='Type to search...'
              className='border border-gray-300 min-w-[400px] rounded-full px-3 py-1 focus:outline-none'
              onChange={(e) => handleSearch(e)}
            />
          </div>
          {/* Right: User Profile (desktop only) */}
          <div className='hidden md:flex items-center space-x-4 relative'>
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
              <Link className='text-blue-600 hover:underline' href='/login'>
                Login
              </Link>
            )}
          </div>
        </header>

        {/* Inline Search Results */}
        {searchQuery.length >= 3 && (
          <div className='p-4 bg-white shadow rounded mb-4'>
            {searchLoading ? (
              <p>Searching...</p>
            ) : searchError ? (
              <p className='text-red-500'>{searchError}</p>
            ) : searchResults.length > 0 ? (
              <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                {searchResults.map((result) => (
                  <li key={result.id} className='border p-4 rounded-lg'>
                    <Link
                      className='flex flex-col items-center'
                      href={`/users/${result.id}`}
                    >
                      {result.avatar ? (
                        <img
                          src={result.avatar}
                          alt={result.name}
                          className='w-20 h-20 rounded-full object-cover'
                        />
                      ) : (
                        <div className='w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center'>
                          <span className='text-gray-500'>No Image</span>
                        </div>
                      )}
                      <p className='mt-2 text-sm font-medium'>{result.name}</p>
                      <p className='text-xs text-gray-500'>{result.email}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No users found for "{searchQuery}".</p>
            )}
          </div>
        )}

        {/* Main Content */}
        <main className='flex-grow overflow-y-auto p-4'>{children}</main>
      </div>

      {/* Optional: Install Prompt Modal */}
      {/*<InstallPromptModal />*/}
    </div>
  )
}

export default DashboardLayout
