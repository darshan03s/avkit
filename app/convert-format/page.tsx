'use client'

import FileInput from '@/components/file-input'
import Main from '@/components/main'
import { Button } from '@/components/ui/button'
import {
  convertFormat,
  SUPPORTED_AUDIO_OUTPUT_FORMATS,
  SUPPORTED_VIDEO_OUTPUT_FORMATS
} from '@/utils/mediabunny'
import { Conversion } from 'mediabunny'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Repeat2 } from 'lucide-react'
import { SupportedOutputFormat } from '@/types/mediabunny'
import { Progress } from '@/components/ui/progress'
import { getExtension, getFilename, saveOutput } from '@/utils'
import { useInput } from '@/hooks/use-input'

const Convert = ({ file }: { file: File }) => {
  const [format, setFormat] = useState<SupportedOutputFormat>()
  const [progress, setProgress] = useState<number>(0)
  const [conversion, setConversion] = useState<Conversion | null>(null)
  const type = file.type

  const outputFormatOptions = type.startsWith('video')
    ? SUPPORTED_VIDEO_OUTPUT_FORMATS
    : SUPPORTED_AUDIO_OUTPUT_FORMATS

  const input = useInput(file)

  const onProgress = (progress: number) => {
    setProgress(Number((progress * 100).toFixed(0)))
  }

  function handleConvert() {
    if (!format) return
    convertFormat(input, format, onProgress).then((conversion) => {
      setConversion(conversion)
    })
  }

  async function handleSave() {
    saveOutput(conversion, getFilename(file.name), getExtension(file.name))
    setProgress(0)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="text-center font-semibold">{file.name}</div>
      <div className="flex justify-center">
        <Select onValueChange={(v) => setFormat(v as SupportedOutputFormat)} value={format}>
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="Select a format" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Formats</SelectLabel>
              {outputFormatOptions.map((format) => {
                return (
                  <SelectItem key={format} value={format}>
                    {format}
                  </SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-center">
        <Button onClick={handleConvert}>
          <Repeat2 /> Convert
        </Button>
      </div>
      <div className="flex justify-center">
        <Progress value={progress} className="w-3xl h-4" />
      </div>
      <div className="flex justify-center">
        <Button disabled={progress < 100} onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  )
}

const Page = () => {
  const [file, setFile] = useState<File | null>(null)

  return (
    <Main>
      {!file ? (
        <FileInput setFile={setFile} description="Upload audio or video file to convert" />
      ) : (
        <>
          <div className="flex items-center justify-end p-2">
            <Button onClick={() => setFile(null)}>Clear</Button>
          </div>
          <Convert file={file} />
        </>
      )}
    </Main>
  )
}

export default Page
