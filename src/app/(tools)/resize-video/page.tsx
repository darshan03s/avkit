'use client'

import ProgressBar from '@/components/progress-bar'
import SelectBox from '@/components/select-box'
import ToolCentered from '@/components/tool-centered'
import ToolContainer from '@/components/tool-container'
import ToolMain from '@/components/tool-main'
import { ToolPage } from '@/components/tool-page'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useConversion } from '@/hooks/use-conversion'
import { ToolPageProps } from '@/types'
import { convertWithErrorHandler, getExtension, getFilename, saveOutput } from '@/utils'
import { resizeVideo } from '@/utils/mediabunny'
import { IconResize } from '@tabler/icons-react'
import { useState } from 'react'

const ResizeVideo = ({ file, fileInput, fileData }: ToolPageProps) => {
  const [width, setWidth] = useState<string>(
    fileData.tracksData.find((track) => track.isVideo)?.displayWidth?.toString() ?? ''
  )
  const [height, setHeight] = useState<string>(
    fileData.tracksData.find((track) => track.isVideo)?.displayHeight?.toString() ?? ''
  )
  const [fit, setFit] = useState<'fill' | 'contain' | 'cover'>()

  const { progress, conversion, execute, reset } = useConversion()

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
          <Label className="text-xs text-accent-foreground">Width</Label>
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
          <Label className="text-xs text-accent-foreground">Height</Label>
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
        {progress < 1 && (
          <Button onClick={handleResize} disabled={!width || !height || !fit}>
            <IconResize /> Resize video
          </Button>
        )}
        {progress > 1 && (
          <>
            <ProgressBar progress={progress} description="Resizing video..." />
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
          <ResizeVideo file={file} fileInput={fileInput} fileData={fileData} />
        </ToolCentered>
      )}
    </ToolPage>
  )
}

export default Page
