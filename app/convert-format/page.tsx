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
import { convertWithErrorHandler, getFilename, saveOutput } from '@/utils'
import { useInput } from '@/hooks/use-input'
import { useConversion } from '@/hooks/use-conversion'
import { ToolPage } from '@/components/tool-page'
import ProgressBar from '@/components/progress-bar'
import ToolCentered from '@/components/tool-centered'
import ToolContainer from '@/components/tool-container'
import FileName from '@/components/file-name'

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

    await convertWithErrorHandler(() =>
      execute((onProgress) => {
        return convertFormat(input, format, onProgress)
      })
    )
  }

  async function handleSave() {
    saveOutput(conversion, getFilename(file.name), format!)
    reset()
  }

  return (
    <ToolContainer>
      <div className="space-y-4">
        <FileName name={file.name} />
        <div className="flex flex-col gap-4 max-w-xl mx-auto">
          <Select onValueChange={(v) => setFormat(v as SupportedOutputFormat)} value={format}>
            <SelectTrigger className="w-full">
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
          {progress < 1 && (
            <Button onClick={handleConvert}>
              <Repeat2 /> Convert
            </Button>
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
      </div>
    </ToolContainer>
  )
}

const Page = () => {
  return (
    <ToolPage description="Upload audio or video">
      {(file) => (
        <ToolCentered>
          <Convert file={file} />
        </ToolCentered>
      )}
    </ToolPage>
  )
}

export default Page
