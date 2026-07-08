import { cn } from '@/lib/utils'
import { useFile } from '@/store/use-file'

const FileName = ({ className }: { className?: string }) => {
  const file = useFile((s) => s.file!)

  return (
    <span className={cn('text-md font-semibold text-center line-clamp-2', className)}>
      {file.name}
    </span>
  )
}
export default FileName
