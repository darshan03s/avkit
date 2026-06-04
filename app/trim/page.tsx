'use client'

import FileInput from '@/components/file-input'
import Main from '@/components/main'
import Player from '@/components/player'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { useInput } from '@/hooks/use-input'
import { InputMediaData } from '@/types/mediabunny'
import { convertToSeconds, getExtension, getFilename, isValidDuration, saveOutput } from '@/utils'
import { getInputData, trim } from '@/utils/mediabunny'
import { Scissors } from 'lucide-react'
import { Conversion } from 'mediabunny'
import { useEffect, useState } from 'react'

const Trim = ({ file }: { file: File }) => {
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [data, setData] = useState<InputMediaData | null>(null)
  const [progress, setProgress] = useState<number>(0)
  const [conversion, setConversion] = useState<Conversion | null>(null)

  const input = useInput(file)

  useEffect(() => {
    async function getData() {
      const d = await getInputData(input)
      setData(d)
    }

    getData()
  }, [input])

  const onProgress = (progress: number) => {
    setProgress(Number((progress * 100).toFixed(0)))
  }

  function handleTrim() {
    if (!isValidDuration(startTime) && !isValidDuration(endTime)) return

    const startSeconds = convertToSeconds(startTime)
    const endSeconds = convertToSeconds(endTime)

    trim(input, onProgress, { start: Number(startSeconds), end: Number(endSeconds) }).then(
      (conversion) => {
        setConversion(conversion)
      }
    )
  }

  async function handleSave() {
    saveOutput(conversion, getFilename(file.name), getExtension(file.name))
    setProgress(0)
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
  const [file, setFile] = useState<File | null>(null)

  return (
    <Main>
      {!file ? (
        <FileInput setFile={setFile} description="Upload audio or video file to trim" />
      ) : (
        <>
          <div className="flex items-center justify-end p-2">
            <Button onClick={() => setFile(null)}>Clear</Button>
          </div>
          <Trim file={file} />
        </>
      )}
    </Main>
  )
}

export default Page
