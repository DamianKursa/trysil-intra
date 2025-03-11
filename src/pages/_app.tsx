// pages/_app.tsx
import { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import client from '@/utils/apollo/ApolloClient';
import '@/styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
