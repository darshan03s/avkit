'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger
} from '@/components/ui/sidebar'
import Brand from './brand'
import { Info, LucideIcon, Repeat2, Scissors } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from './ui/button'
import { usePathname } from 'next/navigation'

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

const options = {
  'View metadata': {
    icon: Info,
    path: '/view-metadata'
  },
  'Convert format': {
    icon: Repeat2,
    path: '/convert-format'
  },
  Trim: {
    icon: Scissors,
    path: '/trim'
  }
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
        {Object.entries(options).map(([key, value]) => {
          return (
            <Option
              key={key}
              Icon={value.icon}
              name={key}
              path={value.path}
              isActive={pathname === value.path}
            />
          )
        })}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
