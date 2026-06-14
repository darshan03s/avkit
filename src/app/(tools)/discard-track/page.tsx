'use client'

import ShowTracks from '@/components/show-tracks'
import ToolAction from '@/components/tool-action'
import ToolCentered from '@/components/tool-centered'
import ToolCompletion from '@/components/tool-completion'
import ToolContainer from '@/components/tool-container'
import ToolMain from '@/components/tool-main'
import { ToolPage } from '@/components/tool-page'
import { useConversion } from '@/hooks/use-conversion'
import { ToolPageProps } from '@/types'
import { convertWithErrorHandler, getExtension, getFilename, saveOutput } from '@/utils'
import { discardTrack } from '@/utils/mediabunny'
import { useState } from 'react'
import { toast } from 'sonner'

const DiscardTrack = ({ file, fileInput, fileData }: ToolPageProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  const { progress, conversion, execute, reset, cancel } = useConversion()

  async function handleDiscard() {
    if (selectedIds.size - fileData.tracksData.length === 0) {
      toast.error('You cannot discard all tracks')
      return
    }
    await convertWithErrorHandler(() =>
      execute((onProgress) => discardTrack(fileInput, selectedIds, onProgress))
    )
  }

  async function handleSave() {
    saveOutput(conversion, getFilename(file.name), getExtension(file.name))
    reset()
  }

  function toggle(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev)

      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }

      return next
    })
  }

  return (
    <ToolContainer>
      <ToolMain file={file} fileData={fileData}>
        {fileData.tracksData.length > 0 ? (
          <ShowTracks
            data={fileData}
            onTrackClick={(id) => toggle(Number(id))}
            activeTrack={selectedIds}
            label="Select one or more track(s)"
          />
        ) : (
          <div className="text-center">No tracks to discard</div>
        )}
        {fileData.tracksData.length > 0 && progress < 1 && (
          <ToolAction onClick={handleDiscard} disabled={selectedIds.size === 0} />
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
          <DiscardTrack file={file} fileInput={fileInput} fileData={fileData} />
        </ToolCentered>
      )}
    </ToolPage>
  )
}

export default Page
