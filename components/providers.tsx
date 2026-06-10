'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import { AppSidebar } from './app-sidebar'
import { ThemeProvider } from './theme-provider'
import { TooltipProvider } from './ui/tooltip'
import { SidebarProvider } from './ui/sidebar'
import { Toaster } from './ui/sonner'

const Providers = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile()
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <SidebarProvider defaultOpen={isMobile ? false : true}>
          <AppSidebar />
          {children}
        </SidebarProvider>
      </TooltipProvider>
      <Toaster />
    </ThemeProvider>
  )
}
export default Providers
