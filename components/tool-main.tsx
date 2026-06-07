import { cn } from '@/lib/utils'
import FileName from './file-name'
import { InputMediaData } from '@/types/mediabunny'
import { Input } from 'mediabunny'
import Player from './player'
import { useMediaData } from '@/hooks/use-media-data'

interface ToolMainProps {
  children: (data: InputMediaData) => React.ReactNode
  className?: string
  file: File
  showPlayer?: boolean
  input: Input
}

const ToolMain = ({ children, className, file, showPlayer = true, input }: ToolMainProps) => {
  const data = useMediaData(input)

  if (!data) return null

  return (
    <div className={cn('space-y-4', className)}>
      {showPlayer && <Player data={data} file={file} />}
      <FileName name={file.name} />
      {children(data)}
    </div>
  )
}
export default ToolMain
