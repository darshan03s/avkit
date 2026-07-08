'use client'

import SelectBox from '@/components/select-box'
import ToolAction from '@/components/tool/tool-action'
import ToolCentered from '@/components/tool/tool-centered'
import ToolCompletion from '@/components/tool/tool-completion'
import ToolContainer from '@/components/tool/tool-container'
import ToolMain from '@/components/tool/tool-main'
import { ToolPage } from '@/components/tool/tool-page'
import { useConversion } from '@/hooks/use-conversion'
import { useFile } from '@/store/use-file'
import { convertWithErrorHandler } from '@/utils'
import {
  QUALITY_HIGH,
  QUALITY_LOW,
  QUALITY_MEDIUM,
  QUALITY_VERY_HIGH,
  QUALITY_VERY_LOW
} from 'mediabunny'
import { useState } from 'react'

const ChangeQuality = () => {
  const file = useFile((s) => s.file!)
  const fileData = useFile((s) => s.fileData!)

  const qualityMap = {
    'Very low': QUALITY_VERY_LOW,
    Low: QUALITY_LOW,
    Medium: QUALITY_MEDIUM,
    High: QUALITY_HIGH,
    'Very high': QUALITY_VERY_HIGH
  }
  const [quality, setQuality] = useState<keyof typeof qualityMap>()
  const qualityOptions = Object.keys(qualityMap)

  const { progress, execute, cancel, save } = useConversion()

  async function handleCompress() {
    if (!quality) return

    await convertWithErrorHandler(() => execute({ quality: qualityMap[quality] }))
  }

  return (
    <ToolContainer>
      <ToolMain file={file} fileData={fileData}>
        <SelectBox
          label="Quality"
          value={quality}
          onValueChange={(v) => setQuality(v as keyof typeof qualityMap)}
          placeholder="Select a quality"
          groupLabel="Quality"
          options={qualityOptions}
        />
        {progress < 1 && <ToolAction onClick={handleCompress} disabled={!quality} />}
        {progress > 1 && <ToolCompletion progress={progress} handleSave={save} cancel={cancel} />}
      </ToolMain>
    </ToolContainer>
  )
}

const Page = () => {
  return (
    <ToolPage>
      <ToolCentered>
        <ChangeQuality />
      </ToolCentered>
    </ToolPage>
  )
}

export default Page
