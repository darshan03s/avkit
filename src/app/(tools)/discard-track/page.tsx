'use client'

import ShowTracks from '@/components/show-tracks'
import ToolAction from '@/components/tool/tool-action'
import ToolCentered from '@/components/tool/tool-centered'
import ToolCompletion from '@/components/tool/tool-completion'
import ToolContainer from '@/components/tool/tool-container'
import ToolMain from '@/components/tool/tool-main'
import { ToolPage } from '@/components/tool/tool-page'
import { useConversion } from '@/hooks/use-conversion'
import { useFile } from '@/store/use-file'
import { convertWithErrorHandler } from '@/utils'
import { useState } from 'react'
import { toast } from 'sonner'

const DiscardTrack = () => {
  const file = useFile((s) => s.file!)
  const fileData = useFile((s) => s.fileData!)

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  const { progress, execute, cancel, save } = useConversion()

  async function handleDiscard() {
    if (selectedIds.size - fileData.tracksData.length === 0) {
      toast.error('You cannot discard all tracks')
      return
    }

    await convertWithErrorHandler(() => execute({ trackIdsToDiscard: selectedIds }))
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
        {progress > 1 && <ToolCompletion progress={progress} handleSave={save} cancel={cancel} />}
      </ToolMain>
    </ToolContainer>
  )
}

const Page = () => {
  return (
    <ToolPage>
      <ToolCentered>
        <DiscardTrack />
      </ToolCentered>
    </ToolPage>
  )
}

export default Page
