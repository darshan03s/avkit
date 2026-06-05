'use client'

import Player from '@/components/player'
import ProgressBar from '@/components/progress-bar'
import { ToolPage } from '@/components/tool-page'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useConversion } from '@/hooks/use-conversion'
import { useInput } from '@/hooks/use-input'
import { InputMediaData } from '@/types/mediabunny'
import {
  convertToSeconds,
  convertWithErrorHandler,
  getExtension,
  getFilename,
  isValidDuration,
  saveOutput
} from '@/utils'
import { getInputData, trim } from '@/utils/mediabunny'
import { Scissors } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const Trim = ({ file }: { file: File }) => {
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [data, setData] = useState<InputMediaData | null>(null)

  const input = useInput(file)

  useEffect(() => {
    async function getData() {
      const d = await getInputData(input)
      setData(d)
    }

    getData()
  }, [input])

  const { progress, conversion, execute, reset } = useConversion()

  async function handleTrim() {
    if (!isValidDuration(startTime) && !isValidDuration(endTime)) return

    const start = convertToSeconds(startTime)
    const end = convertToSeconds(endTime)

    if (start === end) {
      toast.error('Start and end cannot be the same')
      return
    }

    if (start > end) {
      toast.error('Start cannot be more than end')
      return
    }

    if (start > data!.duration || end > data!.duration) {
      toast.error('Start or end cannot be more than media duration')
      return
    }

    await convertWithErrorHandler(() =>
      execute((onProgress) =>
        trim(input, onProgress, {
          start,
          end
        })
      )
    )
  }

  async function handleSave() {
    saveOutput(conversion, getFilename(file.name), getExtension(file.name))
    reset()
  }

  if (!data) return null

  return (
    <div className="max-w-6xl mx-auto">
      <div className="space-y-4 flex flex-col items-center">
        <Player data={data} file={file} />
        <span className="text-md font-semibold text-center line-clamp-2">{file.name}</span>
        <div className="trim flex items-center gap-4">
          <Input placeholder="HH:MM:SS" onChange={(e) => setStartTime(e.target.value)} />
          <Input placeholder="HH:MM:SS" onChange={(e) => setEndTime(e.target.value)} />
        </div>
        {progress < 1 && (
          <Button onClick={handleTrim}>
            <Scissors /> Trim
          </Button>
        )}
        {progress > 1 && (
          <>
            <ProgressBar progress={progress} description="Trimming..." />
            <Button disabled={progress < 100} onClick={handleSave}>
              Save
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

const Page = () => {
  return (
    <ToolPage description="Upload audio or video">
      {(file) => (
        <div className="flex-1 flex items-center justify-center">
          <Trim file={file} />
        </div>
      )}
    </ToolPage>
  )
}

export default Page
