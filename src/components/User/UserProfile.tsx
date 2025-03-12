import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"

interface UserProfileData {
  id: number
  name: string
  username: string
  email: string
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<UserProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("/api/auth/user")
        if (!res.ok) {
          throw new Error("Failed to fetch user profile")
        }
        const data: UserProfileData = await res.json()
        setUser(data)
      } catch (err: any) {
        setError(err.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      })
      if (!res.ok) {
        throw new Error("Logout failed")
      }
      // Optionally, clear any client-side storage if needed
      router.push("/login")
    } catch (err: any) {
      setError(err.message || "Logout error")
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p className='text-red-500'>{error}</p>
  if (!user) return null

  return (
    <div className='p-4'>
      <h2 className='text-xl font-bold mb-2'>User Profile</h2>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p className='mb-4'>
        <strong>Email:</strong> {user.email}
      </p>
      <button
        onClick={handleLogout}
        className='bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-all'
      >
        Log Out
      </button>
    </div>
  )
}

export default UserProfile
