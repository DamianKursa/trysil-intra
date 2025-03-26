// components/CalendarEvents.tsx
import React, { useEffect, useState } from "react"

const CalendarEvents: React.FC = () => {
  const [calendarData, setCalendarData] = useState<any>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const res = await fetch("/api/graph/calendar")
        if (!res.ok) {
          throw new Error("Failed to fetch calendar data")
        }
        const data = await res.json()
        console.log("Calendar data:", data)
        setCalendarData(data)
      } catch (err: any) {
        console.error("Calendar error:", err)
        setError(err.message || "Error fetching calendar data")
      }
    }
    fetchCalendarData()
  }, [])

  if (error) return <p className='text-red-500'>{error}</p>
  if (!calendarData) return <p>Loading calendars...</p>

  return (
    <div>
      <h4>Calendar</h4>
      {/* Render calendar data as needed */}
      <pre>{JSON.stringify(calendarData, null, 2)}</pre>
    </div>
  )
}

export default CalendarEvents
