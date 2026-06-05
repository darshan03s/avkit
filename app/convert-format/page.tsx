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
import { getFilename, saveOutput } from '@/utils'
import { useInput } from '@/hooks/use-input'
import { useConversion } from '@/hooks/use-conversion'
import { ToolPage } from '@/components/tool-page'
import ProgressBar from '@/components/progress-bar'

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
    <div className="max-w-6xl mx-auto space-y-4 flex-1">
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
      {progress < 1 && (
        <div className="flex justify-center">
          <Button onClick={handleConvert}>
            <Repeat2 /> Convert
          </Button>
        </div>
      )}
      {progress > 1 && (
        <>
          <div className="flex justify-center">
            <ProgressBar progress={progress} description="Converting..." />
          </div>
          <div className="flex justify-center">
            <Button disabled={progress < 100} onClick={handleSave}>
              Save
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

const Page = () => {
  return (
    <ToolPage description="Upload audio or video">
      {(file) => (
        <div className="flex-1 flex items-center justify-center">
          <Convert file={file} />
        </div>
      )}
    </ToolPage>
  )
}

export default Page
