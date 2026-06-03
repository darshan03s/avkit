import { cn } from '@/lib/utils'
import { Dispatch, SetStateAction, useRef } from 'react'
import { buttonVariants } from './ui/button'
import { Upload } from 'lucide-react'

const FileInput = ({
  setFile,
  description
}: {
  setFile: Dispatch<SetStateAction<File | null>>
  description: string
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

  return (
    <div className="h-[calc(100vh-var(--header-height))] flex items-center justify-center">
      <div
        onClick={handleFileInput}
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'w-125 h-75 p-2 rounded-md cursor-pointer'
        )}
      >
        <div className="w-full h-full border-2 border-dashed rounded-md">
          <div className="flex flex-col gap-4 items-center justify-center h-full">
            <Upload className="bg-primary text-primary-foreground size-12 p-3 rounded-full" />
            <span className="text-accent-foreground">{description}</span>
          </div>
        </div>
      </div>

      <input
        type="file"
        hidden
        ref={fileInputRef}
        onChange={(e) => handleFileChange(e.target.files)}
        accept="
    .mp4,
    .mov,
    .mkv,
    .webm,
    .wav,
    .ogg,
    .flac,
    .mp3,
    video/mp4,
    video/quicktime,
    video/x-matroska,
    video/webm,
    audio/wav,
    audio/ogg,
    audio/flac,
    audio/mpeg
  "
      />
    </div>
  )
}

export default FileInput
