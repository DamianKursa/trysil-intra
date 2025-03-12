import React, { useEffect, useState } from "react"

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

  if (loading) return <p>Loading...</p>
  if (error) return <p className='text-red-500'>{error}</p>
  if (!user) return null

  return (
    <div className='p-4'>
      <h2 className='text-xl font-bold mb-2'>User Profile</h2>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
    </div>
  )
}

export default UserProfile
