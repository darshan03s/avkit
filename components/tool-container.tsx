import { cn } from '@/lib/utils'

type ToolContainerProps = {
  children: React.ReactNode
  className?: string
}

const ToolContainer = ({ children, className }: ToolContainerProps) => {
  return <div className={cn('w-full max-w-6xl mx-auto', className)}>{children}</div>
}
export default ToolContainer
