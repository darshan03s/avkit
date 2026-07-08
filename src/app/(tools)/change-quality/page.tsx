'use client'

import { SelectBox } from '@/components/select-box'
import { ToolAction } from '@/components/tool/tool-action'
import { ToolCompletion } from '@/components/tool/tool-completion'
import { ToolContainer } from '@/components/tool/tool-container'
import { ToolMain } from '@/components/tool/tool-main'
import { useConversion } from '@/hooks/use-conversion'
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
      <ToolMain>
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

export default ChangeQuality
