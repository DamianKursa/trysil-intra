// components/User/LoginForm.tsx
import React, { useState } from "react"
import { useRouter } from "next/router"

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({ username: "", password: "" })
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const stripHtmlTags = (html: string): string => {
    return html.replace(/<[^>]*>?/gm, "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        // Store the token (for simplicity, in localStorage)
        localStorage.setItem("token", data.token)
        router.push("/dashboard")
      } else {
        const data = await response.json()
        const cleanedMessage =
          data.message && typeof data.message === "string"
            ? stripHtmlTags(data.message)
            : "An error occurred while logging in. Please try again later."
        setError(cleanedMessage)
      }
    } catch (err) {
      setError("An error occurred while logging in. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Username Input */}
      <div className='relative'>
        <input
          type='text'
          value={formData.username}
          onFocus={() => setFocusedField("username")}
          onBlur={() => setFocusedField(null)}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          className='w-full border-b border-gray-300 focus:border-black px-2 py-2'
          required
        />
        <span
          className={`absolute left-2 top-2 transition-opacity duration-200 ${
            formData.username || focusedField === "username"
              ? "opacity-0"
              : "opacity-100"
          }`}
        >
          Username or email address *
        </span>
      </div>

      {/* Password Input */}
      <div className='relative'>
        <input
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onFocus={() => setFocusedField("password")}
          onBlur={() => setFocusedField(null)}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className='w-full border-b border-gray-300 focus:border-black px-2 py-2'
          required
        />
        <span
          className={`absolute left-2 top-2 transition-opacity duration-200 ${
            formData.password || focusedField === "password"
              ? "opacity-0"
              : "opacity-100"
          }`}
        >
          Password *
        </span>
        <img
          src='/icons/show-pass.svg'
          alt='Show Password'
          className='absolute right-2 top-3 w-5 h-5 cursor-pointer'
          onClick={() => setShowPassword(!showPassword)}
        />
      </div>

      {error && (
        <div className='mt-4 px-4 py-2 rounded bg-red-500 text-white'>
          {error}
        </div>
      )}

      <button
        type='submit'
        className='w-full bg-black text-white py-3 rounded-full'
        disabled={loading}
      >
        {loading ? "Loading..." : "Log In"}
      </button>
    </form>
  )
}

export default LoginForm
