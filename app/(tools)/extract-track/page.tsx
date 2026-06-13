'use client'

import ProgressBar from '@/components/progress-bar'
import SelectBox from '@/components/select-box'
import ShowTracks from '@/components/show-tracks'
import ToolCentered from '@/components/tool-centered'
import ToolContainer from '@/components/tool-container'
import ToolMain from '@/components/tool-main'
import { ToolPage } from '@/components/tool-page'
import { Button } from '@/components/ui/button'
import { useConversion } from '@/hooks/use-conversion'
import { ToolPageProps } from '@/types'
import { SupportedOutputFormat } from '@/types/mediabunny'
import { convertWithErrorHandler, getFilename, getOutputFormatOptions, saveOutput } from '@/utils'
import { extractTrack } from '@/utils/mediabunny'
import { Disc } from 'lucide-react'
import { useState } from 'react'

const ExtractTrack = ({ file, fileInput, fileData }: ToolPageProps) => {
  const [selectedTrackId, setSelectedTrackId] = useState('')
  const [format, setFormat] = useState<SupportedOutputFormat | ''>('')
  const selectedTrack = fileData.tracksData.find((track) => track.id.toString() === selectedTrackId)

  const outputFormatOptions = getOutputFormatOptions(selectedTrack?.type as 'video' | 'audio')

  const { progress, conversion, execute, reset } = useConversion()

  async function handleExtract() {
    if (!selectedTrack || !format) return
    await convertWithErrorHandler(() =>
      execute((onProgress) =>
        extractTrack(fileInput, selectedTrack, onProgress, format as SupportedOutputFormat)
      )
    )
  }

  async function handleSave() {
    saveOutput(conversion, getFilename(file.name), format as SupportedOutputFormat)
    reset()
  }

  return (
    <ToolContainer>
      <ToolMain file={file} fileData={fileData}>
        {fileData.tracksData.length > 0 ? (
          <div className="space-y-4">
            <ShowTracks
              data={fileData}
              onTrackClick={(id) => setSelectedTrackId(String(id))}
              activeTrack={selectedTrackId}
            />
            <SelectBox
              key={selectedTrackId}
              label="Formats"
              onValueChange={(v) => setFormat(v as SupportedOutputFormat)}
              value={format}
              placeholder="Select a format"
              groupLabel="Formats"
              options={outputFormatOptions}
            />
          </div>
        ) : (
          <div className="text-center">No tracks to extract</div>
        )}
        {fileData.tracksData.length > 0 && progress < 1 && (
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
      </ToolMain>
    </ToolContainer>
  )
}

const Page = () => {
  return (
    <ToolPage description="Import video" acceptAudio={false}>
      {(file, fileInput, fileData) => (
        <ToolCentered>
          <ExtractTrack file={file} fileInput={fileInput} fileData={fileData} />
        </ToolCentered>
      )}
    </ToolPage>
  )
}
export default Page
