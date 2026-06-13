'use client'

import ProgressBar from '@/components/progress-bar'
import SelectBox from '@/components/select-box'
import ToolCentered from '@/components/tool-centered'
import ToolContainer from '@/components/tool-container'
import ToolMain from '@/components/tool-main'
import { ToolPage } from '@/components/tool-page'
import { Button } from '@/components/ui/button'
import { useConversion } from '@/hooks/use-conversion'
import { ToolPageProps } from '@/types'
import { convertWithErrorHandler, getExtension, getFilename, saveOutput } from '@/utils'
import { rotateVideo } from '@/utils/mediabunny'
import { RotateCw } from 'lucide-react'
import { useState } from 'react'

type Rotation = 0 | 90 | 180 | 270

const RotateVideo = ({ file, fileInput, fileData }: ToolPageProps) => {
  const rotationOptionsMap: Record<string, Rotation> = {
    '0°': 0,
    '90°': 90,
    '180°': 180,
    '270°': 270
  }
  const rotationOptions = Object.keys(rotationOptionsMap)
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
        <SelectBox
          label="Rotation"
          value={rotation?.toString()}
          onValueChange={(v) => setRotation(Number(v) as Rotation)}
          placeholder="Select rotation"
          groupLabel="Clockwise rotations"
          options={rotationOptions}
        />
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
