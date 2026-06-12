'use client'

import ProgressBar from '@/components/progress-bar'
import ToolCentered from '@/components/tool-centered'
import ToolContainer from '@/components/tool-container'
import ToolMain from '@/components/tool-main'
import { ToolPage } from '@/components/tool-page'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useConversion } from '@/hooks/use-conversion'
import { ToolPageProps } from '@/types'
import { convertWithErrorHandler, getExtension, getFilename, saveOutput } from '@/utils'
import { rotateVideo } from '@/utils/mediabunny'
import { RotateCw } from 'lucide-react'
import { useState } from 'react'

type Rotation = 0 | 90 | 180 | 270

const rotationOptions: { label: string; value: Rotation }[] = [
  { label: '0°', value: 0 },
  { label: '90°', value: 90 },
  { label: '180°', value: 180 },
  { label: '270°', value: 270 }
]

const RotateVideo = ({ file, fileInput, fileData }: ToolPageProps) => {
  const [rotation, setRotation] = useState<Rotation | undefined>()

  const { progress, conversion, execute, reset } = useConversion()

  async function handleRotate() {
    if (rotation === undefined) return

    await convertWithErrorHandler(() =>
      execute((onProgress) => rotateVideo(fileInput, rotation, onProgress))
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
          <div className="space-y-1">
            <Label className="text-xs text-accent-foreground">Rotation</Label>
            <Select
              value={rotation?.toString()}
              onValueChange={(v) => setRotation(Number(v) as Rotation)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select rotation" />
              </SelectTrigger>
              <SelectContent className="p-2">
                <SelectGroup>
                  <SelectLabel>Clockwise Rotations</SelectLabel>
                  {rotationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {progress < 1 && (
            <Button onClick={handleRotate} disabled={rotation === undefined}>
              <RotateCw /> Rotate video
            </Button>
          )}
          {progress > 1 && (
            <>
              <ProgressBar progress={progress} description="Rotating video..." />
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
          <RotateVideo file={file} fileInput={fileInput} fileData={fileData} />
        </ToolCentered>
      )}
    </ToolPage>
  )
}

export default Page
