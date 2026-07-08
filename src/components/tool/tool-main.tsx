import { cn } from '@/lib/utils'
import FileName from '../file-name'
import Player from '../player'

interface ToolMainProps {
  children: React.ReactNode
  className?: string
  showPlayer?: boolean
  showCropper?: boolean
}

const ToolMain = ({ children, className, showPlayer = true, showCropper }: ToolMainProps) => {
  return (
    <div
      className={cn(
        'space-y-4 pb-4 flex flex-col gap-2 max-w-md md:max-w-sm lg:max-w-lg mx-auto',
        className
      )}
    >
      {showPlayer && <Player showCropper={showCropper} />}
      <FileName />
      {children}
    </div>
  )
}
export default ToolMain
