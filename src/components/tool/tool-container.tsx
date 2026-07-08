import { cn } from '@/lib/utils'

type ToolContainerProps = {
  children: React.ReactNode
  className?: string
}

export const ToolContainer = ({ children, className }: ToolContainerProps) => {
  return (
    <div className={cn('w-full max-w-6xl mx-auto px-4 xl:px-0 py-4', className)}>{children}</div>
  )
}
