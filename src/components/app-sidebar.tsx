'use client'

import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger } from '@/components/ui/sidebar'
import Brand from './brand'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from './ui/button'
import { usePathname } from 'next/navigation'
import { tools } from '@/tools'

type OptionProps = {
  Icon: LucideIcon
  name: string
  path: string
  isActive: boolean
}

const Option = ({ Icon, name, path, isActive }: OptionProps) => {
  return (
    <Link
      href={path}
      className={cn(
        buttonVariants({ variant: 'ghost' }),
        'gap-3 py-5 font-mono',
        `${isActive && 'bg-accent text-accent-foreground'}`
      )}
    >
      <Icon />
      {name}
    </Link>
  )
}

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center justify-between bg-background">
        <SidebarTrigger />
        <Brand />
      </SidebarHeader>
      <SidebarContent className="p-2 space-y-2 bg-background">
        {Object.entries(tools).map(([path, tool]) => (
          <Option
            key={path}
            Icon={tool.icon}
            name={tool.name}
            path={path}
            isActive={pathname === path}
          />
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
