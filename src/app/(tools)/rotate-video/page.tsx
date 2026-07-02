'use client'

import SelectBox from '@/components/select-box'
import ToolAction from '@/components/tool/tool-action'
import ToolCentered from '@/components/tool/tool-centered'
import ToolCompletion from '@/components/tool/tool-completion'
import ToolContainer from '@/components/tool/tool-container'
import ToolMain from '@/components/tool/tool-main'
import { ToolPage } from '@/components/tool/tool-page'
import { useConversion } from '@/hooks/use-conversion'
import { ToolPageProps } from '@/types'
import { convertWithErrorHandler, getExtension, getFilename, saveOutput } from '@/utils'
import { Rotation } from 'mediabunny'
import { useState } from 'react'

const RotateVideo = ({ file, fileInput, fileData }: ToolPageProps) => {
  const rotationOptionsMap: Record<string, Rotation> = {
    '0°': 0,
    '90°': 90,
    '180°': 180,
    '270°': 270
  }
  const rotationOptions = Object.keys(rotationOptionsMap)
  const [rotation, setRotation] = useState<Rotation | undefined>()

  const { progress, conversion, execute, reset, cancel } = useConversion()

  async function handleRotate() {
    if (rotation === undefined) return

    await convertWithErrorHandler(() => execute(fileInput, { rotation }))
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
        {progress < 1 && <ToolAction onClick={handleRotate} disabled={rotation === undefined} />}
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
          <RotateVideo file={file} fileInput={fileInput} fileData={fileData} />
        </ToolCentered>
      )}
    </ToolPage>
  )
}

export default Page
