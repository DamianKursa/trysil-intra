import React, { useEffect, useState } from "react"

// Define an interface for an event
interface CalendarEvent {
  id: string
  subject: string
  start: { dateTime: string; timeZone: string }
  end: { dateTime: string; timeZone: string }
  location?: { displayName: string }
}

// Define an interface for the API response
interface CalendarData {
  events: CalendarEvent[]
}

const CalendarEvents: React.FC = () => {
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const res = await fetch("/api/graph/calendar")
        if (!res.ok) {
          throw new Error("Failed to fetch calendar data")
        }
        const data: CalendarData = await res.json()
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

  // Filter to show only upcoming events (start time is in the future)
  const upcomingEvents = calendarData.events.filter(
    (event) => new Date(event.start.dateTime) >= new Date()
  )

  if (upcomingEvents.length === 0) return <p>No upcoming events found.</p>

  // Format date and time options for friendly display
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  }
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  }

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Upcoming Events</h2>
      {/* Scrollable container */}
      <div className='max-h-96 overflow-y-scroll'>
        <ul className='space-y-4'>
          {upcomingEvents.map((event) => {
            const start = new Date(event.start.dateTime)
            const end = new Date(event.end.dateTime)
            return (
              <li key={event.id} className='p-4 border rounded shadow-sm'>
                <h3 className='text-xl font-semibold mb-1'>
                  {event.subject || "No Event Name"}
                </h3>
                <p className='text-sm text-gray-600'>
                  {start.toLocaleDateString(undefined, dateOptions)}
                </p>
                <p className='text-sm text-gray-600'>
                  {start.toLocaleTimeString(undefined, timeOptions)} -{" "}
                  {end.toLocaleTimeString(undefined, timeOptions)}
                </p>
                {event.location && event.location.displayName && (
                  <p className='text-sm text-gray-500'>
                    {event.location.displayName}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default CalendarEvents
