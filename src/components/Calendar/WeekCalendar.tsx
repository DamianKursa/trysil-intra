import React, { useEffect, useState } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"

// Use Moment as the localizer for date formatting
const localizer = momentLocalizer(moment)

interface CalendarEvent {
  id: string
  subject: string
  start: { dateTime: string; timeZone: string }
  end: { dateTime: string; timeZone: string }
  location?: { displayName: string }
}

interface CalendarData {
  events: CalendarEvent[]
}

const WeekCalendar: React.FC = () => {
  const [events, setEvents] = useState<any[]>([])
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const res = await fetch("/api/graph/calendar")
        if (!res.ok) {
          throw new Error("Failed to fetch calendar data")
        }
        const data: CalendarData = await res.json()

        // Map events to the shape required by react-big-calendar
        const mappedEvents = data.events.map((event) => ({
          id: event.id,
          title: event.subject || "No Event Name",
          start: new Date(event.start.dateTime),
          end: new Date(event.end.dateTime),
          // Optionally include any additional fields such as location
          location: event.location?.displayName,
        }))

        setEvents(mappedEvents)
      } catch (err: any) {
        console.error("Calendar error:", err)
        setError(err.message || "Error fetching calendar data")
      }
    }

    fetchCalendarData()
  }, [])

  if (error) return <p className='text-red-500'>{error}</p>
  if (!events.length) return <p>Loading calendars...</p>

  return (
    <div style={{ height: "80vh", padding: "1rem" }}>
      <h2 className='text-2xl font-bold mb-4'>Weekly Calendar</h2>
      <Calendar
        localizer={localizer}
        events={events}
        defaultView='week'
        views={["week", "day", "agenda"]}
        startAccessor='start'
        endAccessor='end'
        style={{ height: "100%" }}
      />
    </div>
  )
}

export default WeekCalendar
