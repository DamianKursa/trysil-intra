// components/CalendarSection.tsx
import React from "react"
import CalendarEvents from "./CalendarEvents"

const CalendarSection: React.FC = () => {
  return (
    <div className='bg-white rounded shadow'>
      <CalendarEvents />
    </div>
  )
}

export default CalendarSection
