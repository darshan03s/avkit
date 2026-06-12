'use client'

import ProgressBar from '@/components/progress-bar'
import ToolCentered from '@/components/tool-centered'
import ToolContainer from '@/components/tool-container'
import ToolMain from '@/components/tool-main'
import { ToolPage } from '@/components/tool-page'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Item, ItemActions, ItemContent, ItemTitle } from '@/components/ui/item'
import { useConversion } from '@/hooks/use-conversion'
import { ToolPageProps } from '@/types'
import {
  convertWithErrorHandler,
  formatBitrate,
  getExtension,
  getFilename,
  saveOutput,
  truncateTo2Decimals
} from '@/utils'
import { discardTrack } from '@/utils/mediabunny'
import { Disc } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

const DiscardTrack = ({ file, fileInput, fileData }: ToolPageProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  const { progress, conversion, execute, reset } = useConversion()

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
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          {fileData.tracksData.length > 0 ? (
            <div className="space-y-2">
              {fileData.tracksData.map((track, i) => (
                <Item key={track.id} variant={'outline'}>
                  <ItemContent>
                    <ItemTitle>
                      {track.type} {i}
                    </ItemTitle>
                    <div className="flex items-center gap-2">
                      <Badge>Lang: {track.lang}</Badge>
                      <Badge>Codec: {track.codec}</Badge>
                      <Badge>Codec string: {track.codecParamString}</Badge>
                      <Badge>Average bitrate: {formatBitrate(track.averageBitrate)}</Badge>
                      {track.frameRate && (
                        <Badge>FPS: {truncateTo2Decimals(track.frameRate)}</Badge>
                      )}
                    </div>
                  </ItemContent>
                  <ItemActions>
                    <Checkbox
                      checked={selectedIds.has(track.id)}
                      onCheckedChange={() => {
                        toggle(track.id)
                      }}
                    />
                  </ItemActions>
                </Item>
              ))}
            </div>
          ) : (
            <div className="text-center">No tracks to discard</div>
          )}
          {fileData.tracksData.length > 0 && progress < 1 && (
            <Button onClick={handleDiscard} disabled={selectedIds.size === 0}>
              <Disc /> Discard Track
            </Button>
          )}
          {progress > 1 && (
            <>
              <ProgressBar progress={progress} description="Discarding track..." />
              <Button disabled={progress < 100} onClick={handleSave}>
                Save
              </Button>
            </>
          )}
        </div>
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
