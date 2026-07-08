'use client'

import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'
import { tools } from '@/tools'

export const ToolAction = ({ onClick, disabled }: { onClick: () => void; disabled: boolean }) => {
  const pathname = usePathname()
  const tool = tools[pathname]!
  const { icon: Icon, name, note } = tool

  return (
    <>
      {note && (
        <span className="text-[10px] md:text-xs text-accent-foreground text-center">{note}</span>
      )}
      <Button onClick={onClick} disabled={disabled} className="font-mono">
        <Icon /> {name}
      </Button>
    </>
  )
}
