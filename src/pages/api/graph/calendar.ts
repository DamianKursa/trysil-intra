// pages/api/graph/calendar.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { ConfidentialClientApplication } from "@azure/msal-node";

/**
 * MSAL config for client credentials flow (application permissions)
 */
const msalConfig = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID || "",
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
    clientSecret: process.env.AZURE_CLIENT_SECRET || "",
  },
};

const cca = new ConfidentialClientApplication(msalConfig);

/**
 * Example: Three shared mailboxes in your org.
 * Replace with the actual email addresses of the shared calendars.
 */
const SHARED_MAILBOXES = [
  "Felleskalender@trysilrmm.com",
];

/**
 * GET /api/graph/calendar
 * Fetches calendar events from the three shared mailboxes
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 1. Acquire an access token via client credentials
    const tokenResponse = await cca.acquireTokenByClientCredential({
      scopes: ["https://graph.microsoft.com/.default"], // Ensures all app-permissions from Graph are included
    });

    if (!tokenResponse?.accessToken) {
      return res.status(500).json({ error: "Failed to acquire access token" });
    }

    // 2. For each shared mailbox, fetch events from Microsoft Graph
    const allEvents = [];

    for (const mailbox of SHARED_MAILBOXES) {
      // Example endpoint: /users/{mailbox}/events
      // Or you can call /users/{mailbox}/calendar/events
      const graphResponse = await fetch(
        `https://graph.microsoft.com/v1.0/users/${mailbox}/events`,
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.accessToken}`,
          },
        }
      );

      if (!graphResponse.ok) {
        const errorData = await graphResponse.text();
        console.error("Graph error for mailbox:", mailbox, errorData);
        // You can decide whether to fail immediately or continue
        // For this example, we’ll continue to the next mailbox
        continue;
      }

      const data = await graphResponse.json();
      // data.value is the array of events
      // Merge them into our array
      allEvents.push(...(data.value || []));
    }

    // 3. Return the combined array of events
    return res.status(200).json({ events: allEvents });
  } catch (error: any) {
    console.error("Graph API error:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}
