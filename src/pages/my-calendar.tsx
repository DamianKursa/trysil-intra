// pages/my-calendar.tsx
import { GetServerSideProps } from "next"
import DashboardLayout from "@/components/Layout/DashboardLayout"
import WeekCalendar from "@/components/Calendar/WeekCalendar"

const MyCalendarPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className='container mx-auto py-16 px-4'>
        <h1 className='text-3xl font-bold mb-6'>My Calendar</h1>
        <WeekCalendar />
      </div>
    </DashboardLayout>
  )
}

export default MyCalendarPage

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies.token

  // If there's no JWT token, redirect to /login
  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
