'use client'

import { Button } from '@/components/ui/button'
import { changeCodec } from '@/utils/mediabunny'
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
import { Code } from 'lucide-react'
import { InputMediaData, MediaBunnyInput, SupportedOutputFormat } from '@/types/mediabunny'
import {
  convertWithErrorHandler,
  getCodecOptions,
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
import { AudioCodec, VideoCodec } from 'mediabunny'
import ShowTracks from '@/components/show-tracks'
import { Label } from '@/components/ui/label'

const ChangeCodec = ({
  file,
  fileInput,
  fileData
}: {
  file: File
  fileInput: MediaBunnyInput
  fileData: InputMediaData
}) => {
  const [codec, setCodec] = useState<AudioCodec | VideoCodec | ''>('')
  const [format, setFormat] = useState<SupportedOutputFormat | ''>('')
  const fileType = getFileType(file)

  const outputFormatOptions = getOutputFormatOptions(fileType)
  const codecOptions = getCodecOptions(fileType)

  const { progress, conversion, execute, reset } = useConversion()

  async function handleChangeCodec() {
    if (!format || !codec) return

    await convertWithErrorHandler(() =>
      execute((onProgress) => {
        return changeCodec(fileInput, fileType, format as SupportedOutputFormat, codec, onProgress)
      })
    )
  }

  async function handleSave() {
    saveOutput(conversion, getFilename(file.name), format as SupportedOutputFormat)
    reset()
  }

  return (
    <ToolContainer>
      <ToolMain file={file} fileData={fileData}>
        <div className="flex flex-col gap-4 max-w-xl mx-auto">
          {fileData.tracksData.length > 0 ? (
            <div className="space-y-2">
              <ShowTracks
                data={fileData}
                onlyAudio={fileType === 'audio'}
                onlyVideo={fileType === 'video'}
              />
            </div>
          ) : (
            <div className="text-center">No tracks to change codec</div>
          )}
          <div className="space-y-2">
            <Label className="text-xs text-accent-foreground">Format</Label>
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
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-accent-foreground">Codec</Label>
            <Select onValueChange={(v) => setCodec(v as AudioCodec | VideoCodec)} value={codec}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a codec" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Codecs</SelectLabel>
                  {codecOptions.map((codec) => {
                    return (
                      <SelectItem key={codec} value={codec} className="flex items-center gap-2">
                        {codec} {codec === 'avc' && '(H.264)'} {codec === 'hevc' && '(H.265)'}
                      </SelectItem>
                    )
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {progress < 1 && (
            <>
              <span className="text-xs text-accent-foreground text-center">
                This process is dependent on your browser support for the codec.
              </span>
              <Button onClick={handleChangeCodec} disabled={!format || !codec}>
                <Code /> Change codec
              </Button>
            </>
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
          <ChangeCodec file={file} fileInput={fileInput} fileData={fileData} />
        </ToolCentered>
      )}
    </ToolPage>
  )
}

export default Page
