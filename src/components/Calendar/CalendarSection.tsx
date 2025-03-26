// components/CalendarSection.tsx
import React from "react"
import CalendarEvents from "./CalendarEvents"

const CalendarSection: React.FC = () => {
  return (
    <div className='bg-white p-4 rounded shadow'>
      <CalendarEvents />
    </div>
  )
}

export default CalendarSection
