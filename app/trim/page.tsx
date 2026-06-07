'use client'

import FileName from '@/components/file-name'
import Player from '@/components/player'
import ProgressBar from '@/components/progress-bar'
import ToolCentered from '@/components/tool-centered'
import ToolContainer from '@/components/tool-container'
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
    <ToolContainer>
      <div className="space-y-4">
        <Player data={data} file={file} />
        <FileName name={file.name} />
        <div className="flex flex-col gap-4 max-w-xl mx-auto">
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
    </ToolContainer>
  )
}

const Page = () => {
  return (
    <ToolPage description="Import audio or video">
      {(file) => (
        <ToolCentered>
          <Trim file={file} />
        </ToolCentered>
      )}
    </ToolPage>
  )
}

export default Page
