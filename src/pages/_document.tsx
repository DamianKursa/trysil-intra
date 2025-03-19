// pages/_document.tsx
import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang='pl-PL'>
      <Head>
        {/* Basic Meta Tags */}
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta
          name='description'
          content='Trysil Intranet – Bezpieczny system wewnętrzny organizacji. Zarządzaj użytkownikami, wydarzeniami i treściami w nowoczesnym interfejsie.'
        />
        <meta
          name='keywords'
          content='Trysil, Intranet, system wewnętrzny, zarządzanie, organizacja, bezpieczeństwo'
        />
        <meta name='author' content='Trysil RMM' />
        <meta name='robots' content='index, follow' />
        <link rel='canonical' href='https://trysil-intra.vercel.app' />

        {/* Open Graph Meta Tags */}
        <meta
          property='og:title'
          content='Trysil Intranet – System zarządzania wewnętrznego'
        />
        <meta
          property='og:description'
          content='Trysil Intranet to nowoczesne rozwiązanie do zarządzania treściami, użytkownikami oraz wydarzeniami w Twojej organizacji.'
        />
        <meta property='og:url' content='https://trysil-intra.vercel.app' />
        <meta property='og:type' content='website' />
        <meta
          property='og:image'
          content='https://trysil-intra.vercel.app/og-image.jpg'
        />

        {/* Favicon */}
        <link rel='icon' href='/favicon.png' />

        {/* Fonts */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap'
          rel='stylesheet'
        />

        {/* PWA Meta Tags for iOS */}
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta
          name='apple-mobile-web-app-status-bar-style'
          content='black-translucent'
        />
        <meta name='apple-mobile-web-app-title' content='Trysil Intranet' />
      </Head>
      <body className='bg-beige-light'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
