'use client'

import { Button } from '@/components/ui/button'
import {
  changeCodec,
  SUPPORTED_AUDIO_CODECS,
  SUPPORTED_AUDIO_OUTPUT_FORMATS,
  SUPPORTED_VIDEO_CODECS,
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
import { Code } from 'lucide-react'
import { SupportedOutputFormat } from '@/types/mediabunny'
import { convertWithErrorHandler, getFilename, saveOutput } from '@/utils'
import { useInput } from '@/hooks/use-input'
import { useConversion } from '@/hooks/use-conversion'
import { ToolPage } from '@/components/tool-page'
import ProgressBar from '@/components/progress-bar'
import ToolCentered from '@/components/tool-centered'
import ToolContainer from '@/components/tool-container'
import ToolMain from '@/components/tool-main'
import { AudioCodec, VideoCodec } from 'mediabunny'
import ShowTracks from '@/components/show-tracks'
import { Label } from '@/components/ui/label'

const ChangeCodec = ({ file }: { file: File }) => {
  const [codec, setCodec] = useState<AudioCodec | VideoCodec | ''>('')
  const [format, setFormat] = useState<SupportedOutputFormat | ''>('')
  const type = file.type

  const outputFormatOptions = type.startsWith('video')
    ? SUPPORTED_VIDEO_OUTPUT_FORMATS
    : SUPPORTED_AUDIO_OUTPUT_FORMATS

  const codecOptions = type.startsWith('video') ? SUPPORTED_VIDEO_CODECS : SUPPORTED_AUDIO_CODECS

  const input = useInput(file)

  const { progress, conversion, execute, reset } = useConversion()

  async function handleChangeCodec() {
    if (!format || !codec) return

    await convertWithErrorHandler(() =>
      execute((onProgress) => {
        return changeCodec(
          input,
          type.startsWith('audio') ? 'audio' : 'video',
          format as SupportedOutputFormat,
          codec,
          onProgress
        )
      })
    )
  }

  async function handleSave() {
    saveOutput(conversion, getFilename(file.name), format as SupportedOutputFormat)
    reset()
  }

  return (
    <ToolContainer>
      <ToolMain file={file} input={input} showPlayer={false}>
        {(data) => (
          <div className="flex flex-col gap-4 max-w-xl mx-auto">
            {data.tracksData.length > 0 ? (
              <div className="space-y-2">
                <ShowTracks
                  data={data}
                  onlyAudio={type.startsWith('audio')}
                  onlyVideo={type.startsWith('video')}
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
              <Button onClick={handleChangeCodec} disabled={!format || !codec}>
                <Code /> Change codec
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
        )}
      </ToolMain>
    </ToolContainer>
  )
}

const Page = () => {
  return (
    <ToolPage description="Import audio or video">
      {(file) => (
        <ToolCentered>
          <ChangeCodec file={file} />
        </ToolCentered>
      )}
    </ToolPage>
  )
}

export default Page
