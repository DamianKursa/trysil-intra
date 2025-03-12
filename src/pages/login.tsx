// pages/login.tsx
import React from "react"
import LoginForm from "@/components/User/LoginForm"

const Login: React.FC = () => {
  return (
    <div
      className='min-h-screen flex items-center justify-center bg-cover bg-center'
      style={{
        backgroundImage: "url('/images/Thermoliner_edited-scaled-12.webp')",
      }}
    >
      <div className='bg-white p-8 rounded shadow-md max-w-md w-full'>
        <img
          src='/images/logo.webp'
          alt='Trysil RMM Logo'
          className='h-10 mb-4 mx-auto'
        />
        <h1 className='text-2xl font-bold mb-4 text-center'>
          Login to your account
        </h1>
        <LoginForm />
      </div>
    </div>
  )
}

export default Login
