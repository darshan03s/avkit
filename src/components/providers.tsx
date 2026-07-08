'use client'

import { registerMp3Encoder } from '@mediabunny/mp3-encoder'
import { registerAacEncoder } from '@mediabunny/aac-encoder'
import { registerAc3Decoder, registerAc3Encoder } from '@mediabunny/ac3'
import { registerFlacEncoder } from '@mediabunny/flac-encoder'

registerFlacEncoder()
registerAc3Decoder()
registerAc3Encoder()
registerAacEncoder()
registerMp3Encoder()

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useIsMobile } from '@/hooks/use-mobile'
import { AppSidebar } from './app-sidebar'
import { ThemeProvider } from './theme-provider'
import { TooltipProvider } from './ui/tooltip'
import { SidebarProvider } from './ui/sidebar'
import { Toaster } from './ui/sonner'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile()
  const pathname = usePathname()

  const [prevPathname, setPrevPathname] = useState(pathname)
  const [userOverride, setUserOverride] = useState<boolean | null>(null)

  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setUserOverride(null)
  }

  const defaultOpen = pathname !== '/' && !isMobile
  const open = userOverride ?? defaultOpen

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <SidebarProvider open={open} onOpenChange={setUserOverride}>
          <AppSidebar />
          {children}
        </SidebarProvider>
      </TooltipProvider>
      <Toaster />
    </ThemeProvider>
  )
}
