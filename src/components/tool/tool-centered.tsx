import { cn } from '@/lib/utils'

type ToolCenteredProps = {
  children: React.ReactNode
  className?: string
}

export const ToolCentered = ({ children, className }: ToolCenteredProps) => {
  return <div className={cn('flex-1 flex items-center justify-center', className)}>{children}</div>
}
