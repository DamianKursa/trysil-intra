// components/Sidebar.tsx
import React, { useEffect, useState } from "react"
import axios from "axios"

interface UserInfo {
  id: number
  name: string
  username: string
  email: string
}

const Sidebar: React.FC = () => {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/user")
        setUser(res.data)
      } catch (err: any) {
        setError("Failed to load user info")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) return <div className='p-4'>Loading...</div>
  if (error) return <div className='p-4 text-red-500'>{error}</div>
  if (!user) return <div className='p-4'>No user data</div>

  return (
    <aside className='p-4 border-r border-gray-200 min-w-[250px]'>
      <h2 className='text-xl font-semibold mb-2'>User Info</h2>
      <p className='mb-1'>
        <strong>Name:</strong> {user.name}
      </p>
      <p className='mb-1'>
        <strong>Username:</strong> {user.username}
      </p>
      <p className='mb-1'>
        <strong>Email:</strong> {user.email}
      </p>
    </aside>
  )
}

export default Sidebar
