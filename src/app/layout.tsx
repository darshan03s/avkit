import type { Metadata } from 'next'
import Header from '@/components/header'
import { siteMetadata } from '@/metadata'
import { Analytics } from '@vercel/analytics/next'
import { Lora, IBM_Plex_Mono, Space_Grotesk, Outfit } from 'next/font/google'
import './globals.css'
import Providers from '@/components/providers'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading'
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit'
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-serif'
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['100', '200', '300', '400', '500', '600', '700']
})

export const metadata: Metadata = siteMetadata

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${ibmPlexMono.variable} ${lora.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <div className="flex-1">
            <Header />
            {children}
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
