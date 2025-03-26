// pages/_app.tsx
import { AppProps } from "next/app"
import { ApolloProvider } from "@apollo/client"
import { MsalProvider } from "@azure/msal-react"
import { PublicClientApplication } from "@azure/msal-browser"
import client from "@/utils/apollo/ApolloClient"
import { msalConfig } from "../lib/msalConfig" // wherever you define your MSAL config
import "@/styles/globals.css"

// Create an MSAL instance
const msalInstance = new PublicClientApplication(msalConfig)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <MsalProvider instance={msalInstance}>
        <Component {...pageProps} />
      </MsalProvider>
    </ApolloProvider>
  )
}

export default MyApp
