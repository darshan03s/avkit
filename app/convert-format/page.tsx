'use client'

import { Button } from '@/components/ui/button'
import { convertFormat } from '@/utils/mediabunny'
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
import { InputMediaData, MediaBunnyInput, SupportedOutputFormat } from '@/types/mediabunny'
import {
  convertWithErrorHandler,
  getFilename,
  getFileType,
  getOutputFormatOptions,
  saveOutput
} from '@/utils'
import { useConversion } from '@/hooks/use-conversion'
import { ToolPage } from '@/components/tool-page'
import ProgressBar from '@/components/progress-bar'
import ToolCentered from '@/components/tool-centered'
import ToolContainer from '@/components/tool-container'
import ToolMain from '@/components/tool-main'

const Convert = ({
  file,
  fileInput,
  fileData
}: {
  file: File
  fileInput: MediaBunnyInput
  fileData: InputMediaData
}) => {
  const [format, setFormat] = useState<SupportedOutputFormat>()
  const fileType = getFileType(file)

  const outputFormatOptions = getOutputFormatOptions(fileType)

  const { progress, conversion, execute, reset } = useConversion()

  async function handleConvert() {
    if (!format) return

    await convertWithErrorHandler(() =>
      execute((onProgress) => {
        return convertFormat(fileInput, format, onProgress)
      })
    )
  }

  async function handleSave() {
    saveOutput(conversion, getFilename(file.name), format!)
    reset()
  }

  return (
    <ToolContainer>
      <ToolMain file={file} fileData={fileData} showPlayer={false}>
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
      </ToolMain>
    </ToolContainer>
  )
}

const Page = () => {
  return (
    <ToolPage description="Import audio or video">
      {(file, fileInput, fileData) => (
        <ToolCentered>
          <Convert file={file} fileInput={fileInput} fileData={fileData} />
        </ToolCentered>
      )}
    </ToolPage>
  )
}

export default Page
