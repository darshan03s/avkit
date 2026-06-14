'use client'

import SelectBox from '@/components/select-box'
import ToolAction from '@/components/tool-action'
import ToolCentered from '@/components/tool-centered'
import ToolCompletion from '@/components/tool-completion'
import ToolContainer from '@/components/tool-container'
import ToolMain from '@/components/tool-main'
import { ToolPage } from '@/components/tool-page'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useConversion } from '@/hooks/use-conversion'
import { ToolPageProps } from '@/types'
import { convertWithErrorHandler, getExtension, getFilename, saveOutput } from '@/utils'
import { resizeVideo } from '@/utils/mediabunny'
import { useState } from 'react'

const ResizeVideo = ({ file, fileInput, fileData }: ToolPageProps) => {
  const [width, setWidth] = useState<string>(
    fileData.tracksData.find((track) => track.isVideo)?.displayWidth?.toString() ?? ''
  )
  const [height, setHeight] = useState<string>(
    fileData.tracksData.find((track) => track.isVideo)?.displayHeight?.toString() ?? ''
  )
  const [fit, setFit] = useState<'fill' | 'contain' | 'cover'>()

  const { progress, conversion, execute, reset, cancel } = useConversion()

  async function handleResize() {
    if (!width || !height || !fit) return

    await convertWithErrorHandler(() =>
      execute((onProgress) =>
        resizeVideo(fileInput, { width: Number(width), height: Number(height) }, fit, onProgress)
      )
    )
  }

  async function handleSave() {
    saveOutput(conversion, getFilename(file.name), getExtension(file.name))
    reset()
  }

  return (
    <ToolContainer>
      <ToolMain file={file} fileData={fileData}>
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
          <ResizeVideo file={file} fileInput={fileInput} fileData={fileData} />
        </ToolCentered>
      )}
    </ToolPage>
  )
}

export default Page
