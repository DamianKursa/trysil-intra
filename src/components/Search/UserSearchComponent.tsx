// components/UserSearchComponent.tsx
import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

interface UserProfile {
  id: number
  name: string
  email: string
  avatar?: string // optional avatar URL
}

const UserSearchComponent: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Handle search input changes
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (value.length < 3) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      // Fetch users from your custom endpoint (adjust the URL as needed)
      const res = await fetch(
        `/api/users/search?query=${encodeURIComponent(value)}`
      )
      if (!res.ok) {
        throw new Error("Error fetching search results")
      }
      const users: UserProfile[] = await res.json()
      setResults(users)
    } catch (err: any) {
      console.error("Error fetching search results:", err)
      setError("Error fetching search results")
    } finally {
      setLoading(false)
    }
  }

  // Prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  return (
    <div
      className='fixed inset-0 flex items-center justify-center z-50'
      style={{ backgroundColor: "rgba(54, 49, 50, 0.4)" }}
    >
      <div className='bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-[800px] max-h-[80vh] flex flex-col'>
        {/* Header (fixed) */}
        <div className='flex items-center justify-between pb-2 mb-4 flex-shrink-0'>
          <input
            type='text'
            value={query}
            onChange={handleSearch}
            placeholder='Search users'
            className='w-full p-2 border-b border-gray-300 focus:outline-none'
          />
          <button onClick={onClose} className='text-gray-500 text-2xl ml-4'>
            ×
          </button>
        </div>

        {/* Results (scrollable) */}
        <div className='flex-grow overflow-y-auto'>
          {loading ? (
            <div className='mt-6 text-center'>Searching...</div>
          ) : results.length > 0 ? (
            <div className='mt-6'>
              <h3 className='text-sm font-semibold mb-2'>User Profiles</h3>
              <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                {results.map((user) => (
                  <li key={user.id} className='border p-4 rounded-lg'>
                    <Link
                      className='flex flex-col items-center'
                      onClick={onClose}
                      href={`/users/${user.id}`}
                    >
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          width={80}
                          height={80}
                          className='rounded-full'
                        />
                      ) : (
                        <div className='w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center'>
                          <span className='text-gray-500'>No Image</span>
                        </div>
                      )}
                      <p className='mt-2 text-sm font-medium'>{user.name}</p>
                      <p className='text-xs text-gray-500'>{user.email}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            query.length >= 3 && (
              <div className='mt-6 text-center text-black'>
                <p>No users found for "{query}".</p>
                <p>Try different keywords.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default UserSearchComponent
