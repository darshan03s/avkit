'use client'

import ProgressBar from '@/components/progress-bar'
import ToolCentered from '@/components/tool-centered'
import ToolContainer from '@/components/tool-container'
import ToolMain from '@/components/tool-main'
import { ToolPage } from '@/components/tool-page'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
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
        <div className="flex flex-col gap-4 max-w-xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex-1">
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
            <div className="flex-1">
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
            <div className="flex-1">
              <Label className="text-xs text-accent-foreground">Fit</Label>
              <Select value={fit} onValueChange={(v) => setFit(v as 'fill' | 'contain' | 'cover')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a fit" />
                </SelectTrigger>
                <SelectContent className="p-2">
                  <SelectItem
                    value="fill"
                    title="This will stretch the image to fill the entire box, potentially altering aspect ratio."
                  >
                    Fill
                  </SelectItem>
                  <SelectItem
                    value="contain"
                    title="This will contain the entire image within the box while preserving aspect ratio. This may lead to letterboxing."
                  >
                    Contain
                  </SelectItem>
                  <SelectItem
                    value="cover"
                    title="This will scale the image until the entire box is filled, while preserving aspect ratio."
                  >
                    Cover
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
          <ResizeVideo file={file} fileInput={fileInput} fileData={fileData} />
        </ToolCentered>
      )}
    </ToolPage>
  )
}

export default Page
