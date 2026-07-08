import { cn } from '@/lib/utils'
import { MediaPlayer } from '../media-player'

interface ToolMainProps {
  children: React.ReactNode
  className?: string
  showPlayer?: boolean
  showCropper?: boolean
}

export const ToolMain = ({
  children,
  className,
  showPlayer = true,
  showCropper
}: ToolMainProps) => {
  return (
    <div className={cn('flex flex-col gap-4 max-w-md md:max-w-sm lg:max-w-lg mx-auto', className)}>
      {showPlayer && <MediaPlayer showFileName showCropper={showCropper} />}
      {children}
    </div>
  )
}
