import { cn } from '@/lib/utils'
import { Dispatch, SetStateAction, useMemo, useRef } from 'react'
import { buttonVariants } from './ui/button'
import { Upload } from 'lucide-react'

const FileInput = ({
  setFile,
  description,
  acceptAudio = true,
  acceptVideo = true
}: {
  setFile: Dispatch<SetStateAction<File | null>>
  description: string
  acceptAudio: boolean
  acceptVideo: boolean
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function handleFileInput() {
    if (!fileInputRef.current) return

    fileInputRef.current.click()
  }

  function handleFileChange(files: FileList | null) {
    if (files) {
      setFile(files[0])
    }
  }

  const audioFormats = '.wav, .ogg, .flac, .mp3, audio/wav, audio/ogg, audio/flac, audio/mpeg'
  const videoFormats =
    '.mp4, .mov, .mkv, .webm, video/mp4, video/quicktime, video/x-matroska, video/webm'

  const accept = useMemo(() => {
    if (acceptAudio && acceptVideo) {
      return `${videoFormats}, ${audioFormats}`
    }
    if (acceptAudio) {
      return audioFormats
    }
    return videoFormats
  }, [acceptAudio, acceptVideo])

  return (
    <div>
      <div
        onClick={handleFileInput}
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'w-full h-55 md:h-75 p-2 rounded-md cursor-pointer'
        )}
      >
        <div className="w-full h-full border-2 border-dashed rounded-md">
          <div className="flex flex-col gap-4 items-center justify-center h-full">
            <Upload className="bg-primary text-primary-foreground size-12 p-3 rounded-full" />
            <span className="text-accent-foreground text-xs md:text-sm">{description}</span>
          </div>
        </div>
      </div>
      <input
        type="file"
        hidden
        ref={fileInputRef}
        onChange={(e) => handleFileChange(e.target.files)}
        accept={accept}
      />
    </div>
  )
}

export default FileInput
