'use client'

import { Button } from '@/components/ui/button'
import {
  convertFormat,
  SUPPORTED_AUDIO_OUTPUT_FORMATS,
  SUPPORTED_VIDEO_OUTPUT_FORMATS
} from '@/utils/mediabunny'
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
import { getFilename, saveOutput } from '@/utils'
import { useInput } from '@/hooks/use-input'
import { useConversion } from '@/hooks/use-conversion'
import { ToolPage } from '@/components/tool-page'

const Convert = ({ file }: { file: File }) => {
  const [format, setFormat] = useState<SupportedOutputFormat>()
  const type = file.type

  const outputFormatOptions = type.startsWith('video')
    ? SUPPORTED_VIDEO_OUTPUT_FORMATS
    : SUPPORTED_AUDIO_OUTPUT_FORMATS

  const input = useInput(file)

  const { progress, conversion, execute, reset } = useConversion()

  async function handleConvert() {
    if (!format) return
    await execute((onProgress) => {
      return convertFormat(input, format, onProgress)
    })
  }

  async function handleSave() {
    saveOutput(conversion, getFilename(file.name), format!)
    reset()
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
  return (
    <ToolPage description="Upload audio or video">{(file) => <Convert file={file} />}</ToolPage>
  )
}

export default Page
