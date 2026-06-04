'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger
} from '@/components/ui/sidebar'
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
      className={cn(buttonVariants({ variant: isActive ? 'outline' : 'secondary' }), 'gap-3 py-5')}
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
      <SidebarHeader className="flex flex-row items-center justify-between">
        <SidebarTrigger />
        <Brand />
      </SidebarHeader>
      <SidebarContent className="p-2 space-y-2">
        {tools.map((tool) => (
          <Option
            key={tool.name}
            Icon={tool.icon}
            name={tool.name}
            path={tool.path}
            isActive={pathname === tool.path}
          />
        ))}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
