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
import { useInput } from '@/hooks/use-input'
import {
  convertWithErrorHandler,
  formatBitrate,
  getExtension,
  getFilename,
  saveOutput
} from '@/utils'
import { removeAudio } from '@/utils/mediabunny'
import { VolumeOff } from 'lucide-react'
import { useState } from 'react'

const RemoveAudio = ({ file }: { file: File }) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  const input = useInput(file)

  const { progress, conversion, execute, reset } = useConversion()

  async function handleRemoveAudio() {
    await convertWithErrorHandler(() =>
      execute((onProgress) => removeAudio(input, onProgress, selectedIds))
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
      <ToolMain file={file} input={input}>
        {(data) => (
          <div className="flex flex-col gap-4 max-w-2xl mx-auto">
            {data.audioTracks.length > 0 ? (
              <div className="space-y-2">
                {data.tracksData.map(
                  (track, i) =>
                    track.isAudio && (
                      <Item key={track.id} variant={'outline'}>
                        <ItemContent>
                          <ItemTitle>Audio {i}</ItemTitle>
                          <div className="flex items-center gap-2">
                            <Badge>Lang: {track.lang}</Badge>
                            <Badge>Codec: {track.codec}</Badge>
                            <Badge>Codec string: {track.codecParamString}</Badge>
                            <Badge>Average bitrate: {formatBitrate(track.averageBitrate)}</Badge>
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
                    )
                )}
              </div>
            ) : (
              <div className="text-center">No audio tracks to remove</div>
            )}
            {data.audioTracks.length > 0 && progress < 1 && (
              <Button onClick={handleRemoveAudio} disabled={selectedIds.size === 0}>
                <VolumeOff /> Remove Audio
              </Button>
            )}
            {progress > 1 && (
              <>
                <ProgressBar progress={progress} description="Removing audio..." />
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
          <RemoveAudio file={file} />
        </ToolCentered>
      )}
    </ToolPage>
  )
}
export default Page
