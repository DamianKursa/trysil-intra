// pages/dashboard.tsx
import React from "react"
import DashboardLayout from "@/components/Layout/DashboardLayout"

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
        {/* Card 1 */}
        <div className='bg-white p-4 rounded shadow'>
          <h2 className='text-gray-600 text-sm mb-2'>Total Views</h2>
          <p className='text-2xl font-bold'>3.456K</p>
          <p className='text-green-500 text-sm mt-1'>+2.5%</p>
        </div>

        {/* Card 2 */}
        <div className='bg-white p-4 rounded shadow'>
          <h2 className='text-gray-600 text-sm mb-2'>Revenue</h2>
          <p className='text-2xl font-bold'>$45,2K</p>
          <p className='text-green-500 text-sm mt-1'>+4.35%</p>
        </div>

        {/* Card 3 */}
        <div className='bg-white p-4 rounded shadow'>
          <h2 className='text-gray-600 text-sm mb-2'>Total Users</h2>
          <p className='text-2xl font-bold'>2.350</p>
          <p className='text-blue-500 text-sm mt-1'>+1.22%</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className='bg-white p-4 rounded shadow h-64 flex items-center justify-center'>
        <p className='text-gray-400'>Chart Placeholder</p>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard
