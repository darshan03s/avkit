'use client'

import SelectBox from '@/components/select-box'
import ToolAction from '@/components/tool/tool-action'
import ToolCentered from '@/components/tool/tool-centered'
import ToolCompletion from '@/components/tool/tool-completion'
import ToolContainer from '@/components/tool/tool-container'
import ToolMain from '@/components/tool/tool-main'
import { ToolPage } from '@/components/tool/tool-page'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useConversion } from '@/hooks/use-conversion'
import { useFile } from '@/store/use-file'
import { convertWithErrorHandler } from '@/utils'
import { useState } from 'react'

const ResizeVideo = () => {
  const fileData = useFile((s) => s.fileData!)

  const [width, setWidth] = useState<string>(
    fileData.tracksData.find((track) => track.isVideo)?.displayWidth?.toString() ?? ''
  )
  const [height, setHeight] = useState<string>(
    fileData.tracksData.find((track) => track.isVideo)?.displayHeight?.toString() ?? ''
  )
  const [fit, setFit] = useState<'fill' | 'contain' | 'cover'>()

  const { progress, execute, cancel, save } = useConversion()

  async function handleResize() {
    if (!width || !height || !fit) return

    await convertWithErrorHandler(() =>
      execute({ resize: { width: Number(width), height: Number(height), fit } })
    )
  }

  return (
    <ToolContainer>
      <ToolMain>
        <div className="space-y-2">
          <Label>Width</Label>
          <Input
            value={width}
            placeholder="Width"
            type="text"
            onChange={(e) => {
              if (isNaN(Number(e.target.value))) return
              if (Number(e.target.value) < 0) return
              setWidth(e.target.value)
            }}
          />
        </div>
        <div className="space-y-2">
          <Label>Height</Label>
          <Input
            value={height}
            placeholder="Height"
            type="text"
            onChange={(e) => {
              if (isNaN(Number(e.target.value))) return
              if (Number(e.target.value) < 0) return
              setHeight(e.target.value)
            }}
          />
        </div>
        <SelectBox
          label="Fit"
          value={fit}
          onValueChange={(v) => setFit(v as 'fill' | 'contain' | 'cover')}
          placeholder="Select a fit"
          groupLabel="Fit"
          options={['fill', 'contain', 'cover']}
        />
        {progress < 1 && <ToolAction onClick={handleResize} disabled={!width || !height || !fit} />}
        {progress > 1 && <ToolCompletion progress={progress} handleSave={save} cancel={cancel} />}
      </ToolMain>
    </ToolContainer>
  )
}

const Page = () => {
  return (
    <ToolPage>
      <ToolCentered>
        <ResizeVideo />
      </ToolCentered>
    </ToolPage>
  )
}

export default Page
