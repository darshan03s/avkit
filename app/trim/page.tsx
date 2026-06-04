'use client'

import Player from '@/components/player'
import { ToolPage } from '@/components/tool-page'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { useConversion } from '@/hooks/use-conversion'
import { useInput } from '@/hooks/use-input'
import { InputMediaData } from '@/types/mediabunny'
import { convertToSeconds, getExtension, getFilename, isValidDuration, saveOutput } from '@/utils'
import { getInputData, trim } from '@/utils/mediabunny'
import { Scissors } from 'lucide-react'
import { useEffect, useState } from 'react'

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

    await execute((onProgress) =>
      trim(input, onProgress, {
        start,
        end
      })
    )
  }

  async function handleSave() {
    saveOutput(conversion, getFilename(file.name), getExtension(file.name))
    reset()
  }

  if (!data) return null

  return (
    <div>
      <div className="max-w-6xl mx-auto">
        <div className="space-y-4 flex flex-col items-center">
          <Player data={data} file={file} />
          <span className="text-md font-semibold text-center line-clamp-2">{file.name}</span>
          <div className="trim flex items-center gap-4">
            <Input placeholder="HH:MM:SS" onChange={(e) => setStartTime(e.target.value)} />
            <Input placeholder="HH:MM:SS" onChange={(e) => setEndTime(e.target.value)} />
          </div>
          <Button onClick={handleTrim}>
            <Scissors /> Trim
          </Button>
          <Progress value={progress} className="w-3xl h-4" />
          <Button disabled={progress < 100} onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

const Page = () => {
  return (
    <ToolPage description="Upload audio or video file to trim">
      {(file) => <Trim file={file} />}
    </ToolPage>
  )
}

export default Page
