import React, { useEffect, useState } from "react"
import { useMsal } from "@azure/msal-react"
import { Client } from "@microsoft/microsoft-graph-client"
import "isomorphic-fetch"

const CalendarList: React.FC = () => {
  const { instance, accounts } = useMsal()
  const [calendars, setCalendars] = useState<any[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchCalendars = async () => {
      if (accounts.length > 0) {
        try {
          const tokenResponse = await instance.acquireTokenSilent({
            scopes: ["Calendars.Read"],
            account: accounts[0],
          })
          const client = Client.init({
            authProvider: (done) => {
              done(null, tokenResponse.accessToken)
            },
          })
          const response = await client.api("/me/calendars").get()
          console.log("Graph response (calendars):", response)
          setCalendars(response.value)
        } catch (err: any) {
          console.error("Error fetching calendars:", err)
          setError("Failed to load calendars")
        }
      }
    }

    fetchCalendars()
  }, [accounts, instance])

  if (error) {
    return <p className='text-red-500'>{error}</p>
  }

  if (calendars.length === 0) {
    return <p>No calendars found.</p>
  }

  return (
    <div>
      <h3>Your Calendars:</h3>
      <ul>
        {calendars.map((cal) => (
          <li key={cal.id}>{cal.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default CalendarList
