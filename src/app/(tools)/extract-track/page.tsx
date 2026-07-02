'use client'

import SelectBox from '@/components/select-box'
import ShowTracks from '@/components/show-tracks'
import ToolAction from '@/components/tool-action'
import ToolCentered from '@/components/tool-centered'
import ToolCompletion from '@/components/tool-completion'
import ToolContainer from '@/components/tool-container'
import ToolMain from '@/components/tool-main'
import { ToolPage } from '@/components/tool-page'
import { useConversion } from '@/hooks/use-conversion'
import { ToolPageProps } from '@/types'
import { SupportedOutputFormat } from '@/types/mediabunny'
import { convertWithErrorHandler, getFilename, getOutputFormatOptions, saveOutput } from '@/utils'
import { useState } from 'react'

const ExtractTrack = ({ file, fileInput, fileData }: ToolPageProps) => {
  const [selectedTrackId, setSelectedTrackId] = useState('')
  const [format, setFormat] = useState<SupportedOutputFormat | ''>('')
  const selectedTrack = fileData.tracksData.find((track) => track.id.toString() === selectedTrackId)

  const outputFormatOptions = getOutputFormatOptions(selectedTrack?.type as 'video' | 'audio')

  const { progress, conversion, execute, reset, cancel } = useConversion()

  async function handleExtract() {
    if (!selectedTrack || !format) return

    await convertWithErrorHandler(() =>
      execute(fileInput, { trackToExtract: selectedTrack, format })
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
              label={'Select a track'}
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
          <ToolAction onClick={handleExtract} disabled={!selectedTrackId || !format} />
        )}
        {progress > 1 && (
          <ToolCompletion progress={progress} handleSave={handleSave} cancel={cancel} />
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
