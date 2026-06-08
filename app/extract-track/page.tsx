'use client'

import ProgressBar from '@/components/progress-bar'
import ToolCentered from '@/components/tool-centered'
import ToolContainer from '@/components/tool-container'
import ToolMain from '@/components/tool-main'
import { ToolPage } from '@/components/tool-page'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Item, ItemActions, ItemContent, ItemTitle } from '@/components/ui/item'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useConversion } from '@/hooks/use-conversion'
import { useInput } from '@/hooks/use-input'
import { useMediaData } from '@/hooks/use-media-data'
import { SupportedOutputFormat } from '@/types/mediabunny'
import { convertWithErrorHandler, formatBitrate, getFilename, saveOutput } from '@/utils'
import {
  extractTrack,
  SUPPORTED_AUDIO_OUTPUT_FORMATS,
  SUPPORTED_VIDEO_OUTPUT_FORMATS
} from '@/utils/mediabunny'
import { Disc } from 'lucide-react'
import { useState } from 'react'

const ExtractTrack = ({ file }: { file: File }) => {
  const input = useInput(file)
  const data = useMediaData(input)
  const [selectedTrackId, setSelectedTrackId] = useState('')
  const selectedTrack = data?.tracksData.find((track) => track.id.toString() === selectedTrackId)
  const [format, setFormat] = useState<SupportedOutputFormat | ''>('')

  const outputFormatOptions = selectedTrack?.type.startsWith('video')
    ? SUPPORTED_VIDEO_OUTPUT_FORMATS
    : SUPPORTED_AUDIO_OUTPUT_FORMATS

  const { progress, conversion, execute, reset } = useConversion()

  async function handleExtract() {
    if (!selectedTrack || !format) return
    await convertWithErrorHandler(() =>
      execute((onProgress) =>
        extractTrack(input, selectedTrack, onProgress, format as SupportedOutputFormat)
      )
    )
  }

  async function handleSave() {
    saveOutput(conversion, getFilename(file.name), format as SupportedOutputFormat)
    reset()
  }

  return (
    <ToolContainer>
      <ToolMain file={file} input={input}>
        {(data) => (
          <div className="flex flex-col gap-4 max-w-2xl mx-auto">
            {data.tracksData.length > 0 ? (
              <div className="space-y-2">
                <RadioGroup
                  className="space-y-2"
                  value={selectedTrackId}
                  onValueChange={(value) => {
                    setSelectedTrackId(value)
                    setFormat('')
                  }}
                >
                  {data.tracksData.map((track) => (
                    <Item key={track.id} variant={'outline'}>
                      <ItemContent>
                        <ItemTitle>{track.type}</ItemTitle>
                        <div className="flex items-center gap-2">
                          <Badge>Lang: {track.lang}</Badge>
                          <Badge>Codec: {track.codec}</Badge>
                          <Badge>Codec string: {track.codecParamString}</Badge>
                          <Badge>Average bitrate: {formatBitrate(track.averageBitrate)}</Badge>
                        </div>
                      </ItemContent>
                      <ItemActions>
                        <RadioGroupItem value={track.id.toString()} id={track.id.toString()}>
                          {track.type}
                        </RadioGroupItem>
                      </ItemActions>
                    </Item>
                  ))}
                </RadioGroup>
                <Select
                  key={selectedTrackId}
                  onValueChange={(v) => setFormat(v as SupportedOutputFormat)}
                  value={format}
                >
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
            ) : (
              <div className="text-center">No tracks to extract</div>
            )}
            {data.tracksData.length > 0 && progress < 1 && (
              <Button onClick={handleExtract} disabled={!selectedTrackId || !format}>
                <Disc /> Extract Track
              </Button>
            )}
            {progress > 1 && (
              <>
                <ProgressBar progress={progress} description="Extracting track..." />
                <Button disabled={progress < 100} onClick={handleSave}>
                  Save
                </Button>
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
    <ToolPage description="Import video">
      {(file) => (
        <ToolCentered>
          <ExtractTrack file={file} />
        </ToolCentered>
      )}
    </ToolPage>
  )
}
export default Page
