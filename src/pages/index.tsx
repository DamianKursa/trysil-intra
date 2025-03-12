// pages/index.tsx
import { useEffect } from "react"
import { useRouter } from "next/router"

const Home = () => {
  const router = useRouter()

  useEffect(() => {
    // Check for token in localStorage (or in cookies, if you prefer)
    const token = localStorage.getItem("token")
    if (token) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }, [router])

  return null
}

export default Home
