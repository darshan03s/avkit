import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/header'
import { Toaster } from '@/components/ui/sonner'
import { siteMetadata } from '@/data'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme.provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

const fontSans = Geist({
  variable: '--font-sans',
  subsets: ['latin']
})

const fontMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin']
})

export const metadata: Metadata = siteMetadata

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <SidebarProvider>
              <AppSidebar />
              <div className="flex-1">
                <Header />
                {children}
              </div>
            </SidebarProvider>
          </TooltipProvider>
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
