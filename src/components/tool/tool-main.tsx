import { cn } from '@/lib/utils'
import FileName from '../file-name'
import { InputMediaData } from '@/types/mediabunny'
import Player from '../player'

interface ToolMainProps {
  children: React.ReactNode
  className?: string
  file: File
  showPlayer?: boolean
  fileData: InputMediaData
  showCropper?: boolean
}

const ToolMain = ({
  children,
  className,
  file,
  showPlayer = true,
  fileData,
  showCropper
}: ToolMainProps) => {
  return (
    <div
      className={cn(
        'space-y-4 pb-4 flex flex-col gap-2 max-w-md md:max-w-sm lg:max-w-lg mx-auto',
        className
      )}
    >
      {showPlayer && <Player data={fileData} file={file} showCropper={showCropper} />}
      <FileName name={file.name} />
      {children}
    </div>
  )
}
export default ToolMain
