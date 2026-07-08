'use client'

import SelectBox from '@/components/select-box'
import ShowTracks from '@/components/show-tracks'
import ToolAction from '@/components/tool/tool-action'
import ToolCentered from '@/components/tool/tool-centered'
import ToolCompletion from '@/components/tool/tool-completion'
import ToolContainer from '@/components/tool/tool-container'
import ToolMain from '@/components/tool/tool-main'
import { ToolPage } from '@/components/tool/tool-page'
import { useConversion } from '@/hooks/use-conversion'
import { ToolPageProps } from '@/types'
import { SupportedOutputFormat } from '@/types/mediabunny'
import { convertWithErrorHandler, getOutputFormatOptions } from '@/utils'
import { useState } from 'react'

const ExtractTrack = ({ file, fileData }: ToolPageProps) => {
  const [selectedTrackId, setSelectedTrackId] = useState('')
  const [format, setFormat] = useState<SupportedOutputFormat | undefined>(undefined)
  const selectedTrack = fileData.tracksData.find((track) => track.id.toString() === selectedTrackId)

  const outputFormatOptions = getOutputFormatOptions(selectedTrack?.type as 'video' | 'audio')

  const { progress, execute, cancel, save } = useConversion()

  async function handleExtract() {
    if (!selectedTrack || !format) return

    await convertWithErrorHandler(() => execute({ trackToExtract: selectedTrack, format }))
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
          <ToolCompletion progress={progress} handleSave={() => save(format)} cancel={cancel} />
        )}
      </ToolMain>
    </ToolContainer>
  )
}

const Page = () => {
  return (
    <ToolPage>
      {(file, fileData) => (
        <ToolCentered>
          <ExtractTrack file={file} fileData={fileData} />
        </ToolCentered>
      )}
    </ToolPage>
  )
}
export default Page
