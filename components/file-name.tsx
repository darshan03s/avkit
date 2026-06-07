import { cn } from '@/lib/utils'

const FileName = ({ name, className }: { name: string; className?: string }) => {
  return (
    <span className={cn('text-md font-semibold text-center line-clamp-2', className)}>{name}</span>
  )
}
export default FileName
